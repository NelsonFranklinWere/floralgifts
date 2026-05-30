#!/bin/bash
# Recover production after a failed deploy (502 / broken CSS).
# Run on the server as root: bash scripts/recover-production.sh

set -e

APP_DIR="/home/floral/floralgifts"
APP_PORT=3000

echo "=== 1. Stop PM2 and free ports ==="
pm2 stop floralgifts 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 2

echo "=== 2. Check Nginx points to port $APP_PORT ==="
NGINX_CONF=$(grep -r "proxy_pass" /etc/nginx/sites-enabled/ 2>/dev/null | grep -v "#" | head -1 || true)
echo "Current: $NGINX_CONF"
if echo "$NGINX_CONF" | grep -q "3001"; then
  echo "FIXING: Nginx was on 3001, switching to 3000..."
  sed -i 's|proxy_pass http://127.0.0.1:3001|proxy_pass http://127.0.0.1:3000|g' /etc/nginx/sites-available/*
  sed -i 's|proxy_pass http://localhost:3001|proxy_pass http://localhost:3000|g' /etc/nginx/sites-available/*
  nginx -t && systemctl reload nginx
fi

echo "=== 3. Build the app (this takes 3–8 min) ==="
cd "$APP_DIR"
export NODE_OPTIONS="--max-old-space-size=4096"
if ! npm run build; then
  echo "Full build failed — trying low-memory build..."
  export NODE_OPTIONS="--max-old-space-size=2048"
  npm run build:low-memory
fi

echo "=== 4. Start PM2 on port $APP_PORT ==="
pm2 delete floralgifts 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
sleep 5

echo "=== 5. Verify ==="
pm2 status
echo "--- curl localhost:$APP_PORT ---"
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:$APP_PORT/" || true
echo "--- recent PM2 errors ---"
tail -20 "$APP_DIR/logs/pm2-error.log" 2>/dev/null || pm2 logs floralgifts --lines 15 --nostream

echo ""
echo "Done. Test: https://www.floralwhispersgifts.co.ke"
