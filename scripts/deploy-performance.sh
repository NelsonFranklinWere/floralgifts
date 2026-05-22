#!/bin/bash
# Deploy performance optimizations to production (run after git push from your machine).
set -e

SERVER_USER="floral"
SERVER_IP="157.245.34.218"
APP_DIR="/home/$SERVER_USER/floralgifts"

echo "Deploying performance optimizations to $SERVER_USER@$SERVER_IP..."

ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" bash -s <<'REMOTE'
set -e
cd /home/floral/floralgifts
git pull origin main
npm install
npm run build:prod
pm2 restart floralgifts || pm2 start ecosystem.config.js
pm2 save
if [ -f nginx/floralwhispersgifts.conf ]; then
  sudo cp nginx/floralwhispersgifts.conf /etc/nginx/sites-available/floralwhispersgifts
  sudo nginx -t && sudo systemctl reload nginx
fi
echo "Deploy complete."
REMOTE

echo "Done. Check https://www.floralwhispersgifts.co.ke"
