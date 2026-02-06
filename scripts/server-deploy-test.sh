#!/bin/bash

# Server-side Deployment and Testing Script
# Run this script ON THE SERVER after SSH connection

set -e

TEST_PHONE="254743869564"  # Format: 254743869564
APP_DIR="/home/floral/floralgifts"

echo "🚀 Starting deployment and testing on server..."

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "❌ App directory not found: $APP_DIR"
    echo "Please clone your repository first:"
    echo "  cd /home/floral"
    echo "  git clone YOUR_REPO_URL floralgifts"
    exit 1
fi

cd "$APP_DIR"

echo "📦 Step 1: Installing dependencies..."
npm install --production

echo "🔨 Step 2: Building application..."
npm run build

echo "📁 Step 3: Creating logs directory..."
mkdir -p logs

echo "🔄 Step 4: Starting/Restarting PM2..."
if pm2 list | grep -q "floralgifts"; then
    echo "Restarting existing PM2 process..."
    pm2 restart floralgifts
else
    echo "Starting new PM2 process..."
    pm2 start ecosystem.config.js
fi

echo "⏳ Step 5: Waiting for app to start..."
sleep 5

echo "📊 Step 6: PM2 Status:"
pm2 status

echo ""
echo "🧪 Step 7: Testing Co-op Bank Token endpoint..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/coopbank/token)
echo "Token Response:"
echo "$TOKEN_RESPONSE" | jq . || echo "$TOKEN_RESPONSE"
echo ""

echo "🧪 Step 8: Testing STK Push with phone: $TEST_PHONE..."
STK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d "{\"MobileNumber\": \"$TEST_PHONE\", \"Amount\": 10}")
echo "STK Push Response:"
echo "$STK_RESPONSE" | jq . || echo "$STK_RESPONSE"
echo ""

# Extract MessageReference if present
MESSAGE_REF=$(echo "$STK_RESPONSE" | grep -o '"MessageReference":"[^"]*"' | cut -d'"' -f4 || echo "")

if [ ! -z "$MESSAGE_REF" ]; then
    echo "📋 MessageReference: $MESSAGE_REF"
    echo ""
    echo "🧪 Step 9: Testing Status Check..."
    STATUS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/coopbank/status \
      -H "Content-Type: application/json" \
      -d "{\"MessageReference\": \"$MESSAGE_REF\", \"UserID\": \"FLORALWHISPERS\"}")
    echo "Status Response:"
    echo "$STATUS_RESPONSE" | jq . || echo "$STATUS_RESPONSE"
fi

echo ""
echo "📋 Recent PM2 Logs:"
pm2 logs floralgifts --lines 20 --nostream

echo ""
echo "✅ Deployment and testing completed!"
echo ""
echo "📱 Check your phone ($TEST_PHONE) for M-Pesa prompt!"





















