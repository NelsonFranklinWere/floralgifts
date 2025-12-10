#!/bin/bash

# Deployment and Testing Script
# This script deploys the app and tests STK push

set -e

SERVER_USER="floral"
SERVER_IP="157.245.34.218"
SERVER_PASSWORD="Floral@254Floral"
TEST_PHONE="254743869564"  # Format: 254743869564

echo "🚀 Starting deployment and testing..."

# Function to execute commands on remote server
execute_remote() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$1"
}

echo "📋 Step 1: Checking current status..."
execute_remote "cd /home/floral/floralgifts && pm2 status || echo 'PM2 not running'"

echo "📦 Step 2: Pulling latest changes (if git repo exists)..."
execute_remote "cd /home/floral/floralgifts && git pull || echo 'Not a git repo or no changes'"

echo "📦 Step 3: Installing dependencies..."
execute_remote "cd /home/floral/floralgifts && npm install --production"

echo "🔨 Step 4: Building application..."
execute_remote "cd /home/floral/floralgifts && npm run build"

echo "🔄 Step 5: Restarting application..."
execute_remote "cd /home/floral/floralgifts && pm2 restart floralgifts || pm2 start ecosystem.config.js"

echo "⏳ Waiting for app to start..."
sleep 5

echo "🧪 Step 6: Testing Co-op Bank Token endpoint..."
TOKEN_RESPONSE=$(execute_remote "curl -s -X POST http://localhost:3000/api/coopbank/token")
echo "Token Response: $TOKEN_RESPONSE"

echo "🧪 Step 7: Testing STK Push with phone: $TEST_PHONE..."
STK_RESPONSE=$(execute_remote "curl -s -X POST http://localhost:3000/api/coopbank/stkpush -H 'Content-Type: application/json' -d '{\"MobileNumber\": \"$TEST_PHONE\", \"Amount\": 10}'")
echo "STK Push Response: $STK_RESPONSE"

echo "✅ Deployment and testing completed!"
echo ""
echo "📊 Check PM2 status:"
execute_remote "pm2 status"

echo ""
echo "📋 Check logs:"
execute_remote "pm2 logs floralgifts --lines 20 --nostream"

