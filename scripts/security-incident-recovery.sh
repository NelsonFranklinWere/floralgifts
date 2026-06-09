#!/bin/bash
# Run on the DigitalOcean droplet via the web console (as root) after a compromise.
# Restores nginx → Next.js, removes common backdoors, rebuilds the app.
#
# Usage (DigitalOcean → Droplets → 157.230.182.11 → Access → Launch Droplet Console):
#   curl -fsSL https://raw.githubusercontent.com/NelsonFranklinWere/floralgifts/main/scripts/security-incident-recovery.sh -o /tmp/recover.sh
#   bash /tmp/recover.sh
#
# Or paste this file contents into the console.

set -euo pipefail

APP_DIR="/home/floral/floralgifts"
APP_USER="floral"
APP_PORT=3000
DOMAIN="floralwhispersgifts.co.ke"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}"

echo "=========================================="
echo "Floral Whispers — security incident recovery"
echo "=========================================="

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root (use DigitalOcean Droplet Console)."
  exit 1
fi

echo ""
echo "=== 1. Stop suspicious services / free port ${APP_PORT} ==="
pm2 kill 2>/dev/null || true
pkill -9 -f "xmrig|kinsing|kdevtmpfsi|masscan|minerd" 2>/dev/null || true
fuser -k "${APP_PORT}/tcp" 2>/dev/null || true
sleep 2

echo ""
echo "=== 2. Audit SSH keys (review before continuing) ==="
echo "--- root authorized_keys ---"
cat /root/.ssh/authorized_keys 2>/dev/null || echo "(none)"
echo "--- ${APP_USER} authorized_keys ---"
cat "/home/${APP_USER}/.ssh/authorized_keys" 2>/dev/null || echo "(none)"
echo "Remove any keys you do not recognize, then re-run if needed."

echo ""
echo "=== 3. Audit cron ==="
crontab -l -u root 2>/dev/null || true
crontab -l -u "${APP_USER}" 2>/dev/null || true
ls -la /etc/cron.d/ /var/spool/cron/crontabs/ 2>/dev/null || true

echo ""
echo "=== 4. Find defacement / rogue nginx configs ==="
grep -r "Under New Management\|matrix\|hacked" /etc/nginx/ /var/www/ /home/ 2>/dev/null | head -20 || true
find /var/www /tmp /dev/shm -maxdepth 3 -type f \( -name "*.html" -o -name "index.php" \) -mtime -30 2>/dev/null | head -20 || true

echo ""
echo "=== 5. Restore nginx reverse proxy to Next.js ==="
if [[ ! -f "${NGINX_SITE}" ]]; then
  NGINX_SITE=$(ls /etc/nginx/sites-available/*floral* 2>/dev/null | head -1)
fi

if [[ -n "${NGINX_SITE}" && -f "${NGINX_SITE}" ]]; then
  cp "${NGINX_SITE}" "${NGINX_SITE}.bak.$(date +%s)"
  # Remove static root hijacks — force proxy to Node
  sed -i 's|root /var/www.*|# removed by recovery|g' "${NGINX_SITE}" || true
  sed -i 's|try_files \$uri|# try_files disabled|g' "${NGINX_SITE}" || true
  if ! grep -q "proxy_pass http://127.0.0.1:${APP_PORT}" "${NGINX_SITE}"; then
    cat >> "${NGINX_SITE}" << NGINXBLOCK

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
NGINXBLOCK
  fi
  nginx -t && systemctl reload nginx
  echo "Nginx reloaded."
else
  echo "WARN: nginx site config not found — fix manually."
fi

echo ""
echo "=== 6. Fix ownership & pull clean code ==="
chown -R "${APP_USER}:${APP_USER}" "/home/${APP_USER}"
if [[ -d "${APP_DIR}/.git" ]]; then
  sudo -u "${APP_USER}" bash -c "cd ${APP_DIR} && git fetch origin main && git reset --hard origin/main && git clean -fd"
else
  echo "WARN: ${APP_DIR} is not a git repo."
fi

echo ""
echo "=== 7. Rebuild application ==="
sudo -u "${APP_USER}" bash -c "cd ${APP_DIR} && npm install --production && rm -rf .next && NODE_OPTIONS='--max-old-space-size=4096' npm run build"

echo ""
echo "=== 8. Start PM2 as ${APP_USER} ==="
sudo -u "${APP_USER}" bash -c "cd ${APP_DIR} && pm2 delete floralgifts 2>/dev/null || true"
sudo -u "${APP_USER}" bash -c "cd ${APP_DIR} && pm2 start ecosystem.config.js && pm2 save"
sudo -u "${APP_USER}" pm2 startup systemd -u "${APP_USER}" --hp "/home/${APP_USER}" 2>/dev/null || true

echo ""
echo "=== 9. Verify ==="
sleep 4
sudo -u "${APP_USER}" pm2 status
curl -s -o /dev/null -w "localhost:${APP_PORT} → HTTP %{http_code}\n" "http://127.0.0.1:${APP_PORT}/" || true
curl -s -o /dev/null -w "public site → HTTP %{http_code}\n" "https://${DOMAIN}/" || true

echo ""
echo "=========================================="
echo "Recovery script finished."
echo "=========================================="
echo ""
echo "REQUIRED NEXT STEPS (do these immediately):"
echo "  1. Reset floral UNIX password:  passwd floral"
echo "  2. Rotate ALL secrets in ${APP_DIR}/.env.local:"
echo "     JWT_SECRET, ADMIN_PASSWORD, Supabase keys, Pesapal, Resend, Co-op Bank, Google API"
echo "  3. Change admin password in Supabase admins table"
echo "  4. Remove unknown SSH keys from /root and /home/floral/.ssh/authorized_keys"
echo "  5. Enable firewall: ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable"
echo "  6. Consider rebuilding the droplet from a fresh Ubuntu image (safest option)"
echo ""
