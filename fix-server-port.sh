#!/bin/bash

# Complete Server Port Fix Script
# Usage: ./fix-server-port.sh [server_ip]

set -e

SERVER_USER="floral"
SERVER_IP="${1:-64.227.50.213}"
PROJECT_PATH="/home/floral/floralgifts"

echo "🔧 Connecting to server ${SERVER_USER}@${SERVER_IP}..."
echo ""

# Step 1: Stop PM2 completely
echo "🛑 Step 1: Stopping PM2..."
ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "pm2 stop all 2>/dev/null || true; pm2 kill 2>/dev/null || true"
sleep 2

# Step 2: Kill all Node processes
echo "🔪 Step 2: Killing all Node processes..."
ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "pkill -9 node 2>/dev/null || true"
sleep 2

# Step 3: Kill anything on port 3000
echo "🔪 Step 3: Freeing port 3000..."
ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "lsof -ti:3000 | xargs kill -9 2>/dev/null || true"
sleep 2

# Step 4: Verify port is free
echo "🔍 Step 4: Verifying port 3000 is free..."
PORT_CHECK=$(ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "lsof -ti:3000 2>/dev/null || echo 'free'")
if [ "$PORT_CHECK" != "free" ]; then
    echo "⚠️  Port still in use, killing again..."
    ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "kill -9 $PORT_CHECK 2>/dev/null || true"
    sleep 2
else
    echo "✅ Port 3000 is free"
fi

# Step 5: Start PM2
echo "🚀 Step 5: Starting PM2..."
ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && pm2 start ecosystem.config.js"
sleep 3

# Step 6: Check status
echo ""
echo "📊 Step 6: PM2 Status..."
ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "pm2 status"

# Step 7: Check logs
echo ""
echo "📝 Step 7: Recent Logs..."
ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "pm2 logs floralgifts --lines 10 --nostream"

echo ""
echo "✅ Done! Check full logs with: ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs floralgifts'"
