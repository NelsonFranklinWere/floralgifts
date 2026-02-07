#!/bin/bash

# Complete Fix for PM2 Port Conflict
# Run this on the server

echo "🔍 Step 1: Finding process on port 3000..."
PID=$(lsof -ti:3000)
if [ ! -z "$PID" ]; then
    echo "Found process: $PID"
    echo "🔪 Killing process $PID..."
    kill -9 $PID
    sleep 1
else
    echo "No process found on port 3000"
fi

echo ""
echo "🛑 Step 2: Stopping all PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

echo ""
echo "⏳ Step 3: Waiting 2 seconds..."
sleep 2

echo ""
echo "🔍 Step 4: Verifying port 3000 is free..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 still in use, killing again..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
else
    echo "✅ Port 3000 is free"
fi

echo ""
echo "🚀 Step 5: Starting PM2..."
cd /home/floral/floralgifts
pm2 start ecosystem.config.js

echo ""
echo "📊 Step 6: PM2 Status..."
pm2 status

echo ""
echo "📝 Step 7: Recent logs..."
pm2 logs floralgifts --lines 10 --nostream

echo ""
echo "✅ Done! Check full logs with: pm2 logs floralgifts"
