#!/bin/bash
# Run in DigitalOcean Droplet Console as root to finish deploy on 147.182.164.82
set -euo pipefail

APP_USER="floral"
APP_DIR="/home/${APP_USER}/floralgifts"

echo "=== Ensure floral user exists ==="
id "$APP_USER" 2>/dev/null || useradd -m -s /bin/bash "$APP_USER"

echo "=== Clone / update app ==="
if [[ ! -d "${APP_DIR}/.git" ]]; then
  sudo -u "$APP_USER" git clone https://github.com/NelsonFranklinWere/floralgifts.git "$APP_DIR"
else
  sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && git fetch origin main && git reset --hard origin/main"
fi

echo "=== .env.local required ==="
if [[ ! -f "${APP_DIR}/.env.local" ]]; then
  echo "Create ${APP_DIR}/.env.local with your secrets (copy from backup)."
  echo "Minimum: NEXT_PUBLIC_SUPABASE_*, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, payment keys"
  exit 1
fi
chown "${APP_USER}:${APP_USER}" "${APP_DIR}/.env.local"
chmod 600 "${APP_DIR}/.env.local"

echo "=== Build & start (Node server.js) ==="
sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && npm install --production && npm run build"
sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && pm2 delete floralgifts 2>/dev/null || true"
sudo -u "$APP_USER" bash -c "cd ${APP_DIR} && HOSTNAME=127.0.0.1 pm2 start server.js --name floralgifts"
sudo -u "$APP_USER" pm2 save

echo "=== Firewall: web only, block direct app ports ==="
ufw --force enable
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw deny 3000/tcp
ufw deny 3001/tcp

echo "=== Verify ==="
curl -s -o /dev/null -w "app: %{http_code}\n" http://127.0.0.1:3000/ || true
curl -s -o /dev/null -w "nginx: %{http_code}\n" http://127.0.0.1/ || true
sudo -u "$APP_USER" pm2 status

echo "Done. Point DNS A record to this server IP, then: certbot --nginx -d floralwhispersgifts.co.ke -d www.floralwhispersgifts.co.ke"
