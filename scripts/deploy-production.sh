#!/bin/bash
# Full production deploy: pull, build, restart PM2, reload nginx.
set -e

SERVER_USER="floral"
SERVER_IP="157.245.34.218"
APP_DIR="/home/$SERVER_USER/floralgifts"

echo "Deploying to $SERVER_USER@$SERVER_IP..."

ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" bash -s <<'REMOTE'
set -e
cd /home/floral/floralgifts

echo "==> Git pull"
git pull origin main

echo "==> Ensure Pesapal env (checkout uses Pesapal, not Co-op Bank)"
if [ -f .env.local ]; then
  grep -q '^PESAPAL_CONSUMER_KEY=' .env.local || echo 'WARNING: PESAPAL_CONSUMER_KEY missing in .env.local'
  grep -q '^PESAPAL_ENV=production' .env.local || echo 'WARNING: set PESAPAL_ENV=production'
fi

echo "==> npm install & build"
npm install
npm run build:prod

echo "==> PM2 restart"
pm2 restart floralgifts || pm2 start ecosystem.config.js
pm2 save

if [ -f nginx/floralwhispersgifts.conf ]; then
  echo "==> nginx reload"
  sudo cp nginx/floralwhispersgifts.conf /etc/nginx/sites-available/floralwhispersgifts
  sudo nginx -t && sudo systemctl reload nginx
fi

echo "DEPLOY_OK"
REMOTE

echo ""
echo "Live: https://www.floralwhispersgifts.co.ke"
echo "Test checkout: M-Pesa (Pesapal) should redirect to pay.pesapal.com"
