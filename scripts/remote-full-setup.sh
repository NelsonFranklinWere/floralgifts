#!/bin/bash
# Full remote setup: restore SSH, install keys, deploy app. Run from project root.
set -euo pipefail

SERVER_IP="${DEPLOY_SERVER_IP:-147.182.164.82}"
ROOT_PASS="${DEPLOY_SERVER_PASSWORD:-Floral@254Flo0ral}"
FLORAL_PASS="${FLORAL_USER_PASSWORD:-$ROOT_PASS}"
APP_USER="floral"
APP_DIR="/home/${APP_USER}/floralgifts"
APP_PORT=3000
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$REPO_ROOT/.env.local}"

SSH_PUBKEYS=(
  "$(cat "$HOME/.ssh/id_ed25519.pub" 2>/dev/null || true)"
  "$(cat "$HOME/.ssh/id_ed25519_digitalocean.pub" 2>/dev/null || true)"
)

ssh_cmd() {
  local user="$1"
  local pass="$2"
  shift 2
  local key=""
  if [[ "$user" == "root" ]]; then
    key="${SSH_KEY:-$HOME/.ssh/id_ed25519_digitalocean}"
  else
    key="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
  fi
  if [[ -f "$key" ]] && ssh -i "$key" -o BatchMode=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
    -o ConnectTimeout=15 -o NumberOfPasswordPrompts=0 "${user}@${SERVER_IP}" "$@" 2>/dev/null; then
    return 0
  fi
  sshpass -p "$pass" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
    -o PreferredAuthentications=password -o PubkeyAuthentication=no -o NumberOfPasswordPrompts=1 \
    "${user}@${SERVER_IP}" "$@"
}

ssh_root() { ssh_cmd root "$ROOT_PASS" "$@"; }

ssh_floral() { ssh_cmd floral "$FLORAL_PASS" "$@"; }

echo "=== Waiting for SSH on ${SERVER_IP}:22 ==="
for i in $(seq 1 60); do
  if nc -z -w 2 "$SERVER_IP" 22 2>/dev/null; then
    echo "Port 22 open (attempt $i)"
    break
  fi
  if [[ $i -eq 60 ]]; then
    echo "ERROR: SSH port 22 still closed."
    echo "Open DigitalOcean Droplet Console and run:"
    echo "  ufw allow OpenSSH; systemctl restart ssh; fail2ban-client unban --all"
    echo "Or: curl -fsSL https://raw.githubusercontent.com/NelsonFranklinWere/floralgifts/main/scripts/console-complete-setup.sh | bash"
    exit 1
  fi
  sleep 5
done

echo "=== Restore SSH + create ${APP_USER} user ==="
ssh_root bash -s <<REMOTE
set -euo pipefail
ufw allow OpenSSH 2>/dev/null || true
ufw allow 22/tcp 2>/dev/null || true
sed -i 's/^PermitRootLogin no/PermitRootLogin yes/' /etc/ssh/sshd_config 2>/dev/null || true
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
grep -q '^PubkeyAuthentication' /etc/ssh/sshd_config || echo 'PubkeyAuthentication yes' >> /etc/ssh/sshd_config
systemctl restart ssh 2>/dev/null || systemctl restart sshd
fail2ban-client unban --all 2>/dev/null || true

id "$APP_USER" 2>/dev/null || useradd -m -s /bin/bash "$APP_USER"
echo "${APP_USER}:${FLORAL_PASS}" | chpasswd
usermod -aG sudo "$APP_USER" 2>/dev/null || true
REMOTE

echo "=== Install SSH keys for root and ${APP_USER} ==="
for user in root "$APP_USER"; do
  for key in "${SSH_PUBKEYS[@]}"; do
    [[ -z "$key" ]] && continue
    ssh_root "home=\$(eval echo ~$user); mkdir -p \"\$home/.ssh\"; chmod 700 \"\$home/.ssh\"; touch \"\$home/.ssh/authorized_keys\"; grep -qF '$key' \"\$home/.ssh/authorized_keys\" || echo '$key' >> \"\$home/.ssh/authorized_keys\"; chmod 600 \"\$home/.ssh/authorized_keys\"; chown -R $user:$user \"\$home/.ssh\""
  done
done

echo "=== Node.js + PM2 ==="
ssh_root bash -s <<'REMOTE'
set -euo pipefail
if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
npm install -g pm2
REMOTE

echo "=== Clone / update app ==="
ssh_root bash -s <<REMOTE
set -euo pipefail
mkdir -p "/home/${APP_USER}"
chown "${APP_USER}:${APP_USER}" "/home/${APP_USER}"
if [[ ! -d "${APP_DIR}/.git" ]]; then
  sudo -u "${APP_USER}" git clone https://github.com/NelsonFranklinWere/floralgifts.git "${APP_DIR}"
else
  sudo -u "${APP_USER}" bash -c "cd ${APP_DIR} && git fetch origin main && git reset --hard origin/main"
fi
REMOTE

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found"
  exit 1
fi

echo "=== Upload .env.local ==="
sshpass -p "$FLORAL_PASS" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  "$ENV_FILE" "floral@${SERVER_IP}:${APP_DIR}/.env.local"
ssh_root "chown ${APP_USER}:${APP_USER} ${APP_DIR}/.env.local && chmod 600 ${APP_DIR}/.env.local"

echo "=== Build & start PM2 ==="
ssh_floral bash -s <<REMOTE
set -euo pipefail
cd "${APP_DIR}"
npm install --production
npm run build
pm2 delete floralgifts 2>/dev/null || true
HOSTNAME=127.0.0.1 PORT=${APP_PORT} pm2 start server.js --name floralgifts
pm2 save
REMOTE

ssh_root "sudo -u ${APP_USER} pm2 startup systemd -u ${APP_USER} --hp /home/${APP_USER} 2>/dev/null | grep -E '^sudo' | bash || true"

echo "=== Nginx ==="
ssh_root bash -s <<REMOTE
set -euo pipefail
cat > /etc/nginx/sites-available/floralwhispersgifts.co.ke << 'NGINX'
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

ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw deny ${APP_PORT}/tcp
ufw --force enable
REMOTE

echo "=== Verify ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "http://${SERVER_IP}/")
echo "http://${SERVER_IP}/ => ${HTTP_CODE}"
ssh_floral "pm2 status"

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "SUCCESS: Website is live at http://${SERVER_IP}/"
else
  echo "WARN: Expected HTTP 200, got ${HTTP_CODE}. Check: ssh floral@${SERVER_IP} pm2 logs floralgifts"
  exit 1
fi
