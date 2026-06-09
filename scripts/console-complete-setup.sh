#!/bin/bash
# Paste in DigitalOcean Droplet Console (root). Opens SSH, adds keys, deploys site.
set -euo pipefail

APP_USER="floral"
APP_DIR="/home/${APP_USER}/floralgifts"
APP_PORT=3000
FLORAL_PASS="${FLORAL_PASS:-Floral@254Flo0ral}"

SSH_PUBKEYS=(
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIK2zF5vGxPimVK/JJoTGFSlHwm0Qvb0VlPy4kA87r1h airm1@Nelson-Frank.local"
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEegAyqEFMvAtjPpz/5Lt4BDqf7t/N8WLyB1UaaEgqXs digitalocean-prince-esquare"
)

echo "=== 1. Restore SSH access ==="
ufw allow 22/tcp 2>/dev/null || true
ufw allow OpenSSH 2>/dev/null || true
sed -i 's/^PermitRootLogin no/PermitRootLogin yes/' /etc/ssh/sshd_config 2>/dev/null || true
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
grep -q '^PubkeyAuthentication' /etc/ssh/sshd_config || echo 'PubkeyAuthentication yes' >> /etc/ssh/sshd_config
systemctl enable ssh 2>/dev/null || systemctl enable sshd 2>/dev/null || true
systemctl restart ssh 2>/dev/null || systemctl restart sshd 2>/dev/null || true
fail2ban-client unban --all 2>/dev/null || true

echo "=== 2. App user + SSH keys ==="
id "$APP_USER" 2>/dev/null || useradd -m -s /bin/bash "$APP_USER"
echo "${APP_USER}:${FLORAL_PASS}" | chpasswd
usermod -aG sudo "$APP_USER" 2>/dev/null || true

for user in root "$APP_USER"; do
  home=$(eval echo "~$user")
  mkdir -p "$home/.ssh"
  chmod 700 "$home/.ssh"
  touch "$home/.ssh/authorized_keys"
  for key in "${SSH_PUBKEYS[@]}"; do
    grep -qF "$key" "$home/.ssh/authorized_keys" 2>/dev/null || echo "$key" >> "$home/.ssh/authorized_keys"
  done
  chmod 600 "$home/.ssh/authorized_keys"
  chown -R "$user:$user" "$home/.ssh"
done

echo "=== 3. Node.js + PM2 ==="
if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
npm install -g pm2

echo "=== 4. Clone app ==="
mkdir -p "/home/${APP_USER}"
chown "${APP_USER}:${APP_USER}" "/home/${APP_USER}"
if [[ ! -d "${APP_DIR}/.git" ]]; then
  sudo -u "$APP_USER" git clone https://github.com/NelsonFranklinWere/floralgifts.git "$APP_DIR"
else
  sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && git fetch origin main && git reset --hard origin/main"
fi

if [[ ! -f "${APP_DIR}/.env.local" ]]; then
  echo "WARN: ${APP_DIR}/.env.local missing — copy via scp before build."
  exit 2
fi
chown "${APP_USER}:${APP_USER}" "${APP_DIR}/.env.local"
chmod 600 "${APP_DIR}/.env.local"

echo "=== 5. Build & PM2 (localhost only) ==="
sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && npm install --production && npm run build"
sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && pm2 delete floralgifts 2>/dev/null || true"
sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && HOSTNAME=127.0.0.1 PORT=${APP_PORT} pm2 start server.js --name floralgifts && pm2 save"
sudo -u "$APP_USER" pm2 startup systemd -u "$APP_USER" --hp "/home/${APP_USER}" 2>/dev/null | grep -E '^sudo' | bash || true

echo "=== 6. Nginx ==="
cat > /etc/nginx/sites-available/floralwhispersgifts.co.ke << NGINX
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name floralwhispersgifts.co.ke www.floralwhispersgifts.co.ke _;

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
ln -sf /etc/nginx/sites-available/floralwhispersgifts.co.ke /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "=== 7. Firewall ==="
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw deny ${APP_PORT}/tcp
ufw --force enable

echo "=== Done ==="
curl -s -o /dev/null -w "app:%{http_code} nginx:%{http_code}\n" "http://127.0.0.1:${APP_PORT}/" "http://127.0.0.1/"
sudo -u "$APP_USER" pm2 status
