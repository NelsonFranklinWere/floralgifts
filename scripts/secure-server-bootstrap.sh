#!/bin/bash
# Fresh secure bootstrap — run as root on a new Ubuntu droplet.
set -euo pipefail

APP_USER="floral"
APP_DIR="/home/${APP_USER}/floralgifts"
APP_PORT=3000
DOMAIN="floralwhispersgifts.co.ke"

echo "=== Installing system packages ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git nginx ufw fail2ban

if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi

npm install -g pm2

echo "=== Create app user ==="
if ! id "$APP_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$APP_USER"
fi
# Set app user password from env (never commit passwords to git)
if [[ -n "${FLORAL_USER_PASSWORD:-}" ]]; then
  echo "${APP_USER}:${FLORAL_USER_PASSWORD}" | chpasswd
fi

echo "=== Clone application ==="
mkdir -p "/home/${APP_USER}"
chown "${APP_USER}:${APP_USER}" "/home/${APP_USER}"
if [[ ! -d "${APP_DIR}/.git" ]]; then
  sudo -u "$APP_USER" git clone https://github.com/NelsonFranklinWere/floralgifts.git "$APP_DIR"
else
  sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && git fetch origin main && git reset --hard origin/main"
fi

echo "=== Firewall: public web only (block app/debug ports) ==="
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
# Explicitly deny common attack ports (app must stay on localhost)
ufw deny 3000/tcp
ufw deny 3001/tcp
ufw deny 8080/tcp
ufw deny 8443/tcp
ufw --force enable

echo "=== SSH hardening (keeps console access until you add SSH keys) ==="
SSHD=/etc/ssh/sshd_config
cp "$SSHD" "${SSHD}.bak.$(date +%s)"
# Do NOT disable root until floral SSH key is confirmed — set HARDEN_SSH=1 to lock down
if [[ "${HARDEN_SSH:-}" == "1" ]]; then
  sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSHD"
fi
sed -i 's/^#*MaxAuthTries.*/MaxAuthTries 5/' "$SSHD"
systemctl reload ssh 2>/dev/null || systemctl reload sshd 2>/dev/null || true

echo "=== Fail2ban for SSH ==="
systemctl enable fail2ban
systemctl start fail2ban

echo "=== Nginx reverse proxy (app on 127.0.0.1 only) ==="
cat > "/etc/nginx/sites-available/${DOMAIN}" << NGINX
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${DOMAIN} www.${DOMAIN} _;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    client_max_body_size 10M;
}
NGINX

ln -sf "/etc/nginx/sites-available/${DOMAIN}" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "Bootstrap complete. Next: copy .env.local, npm run build, pm2 start."
