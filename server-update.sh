#!/bin/bash

# Server-Side Update Script
# Run this script directly on your Digital Ocean droplet server console
# This script updates code from Git and restarts the application

set -e

APP_DIR="/home/floral/floralgifts"

echo "=========================================="
echo "🔄 Updating Application on Server"
echo "=========================================="
echo "App Directory: $APP_DIR"
echo ""

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "❌ App directory not found: $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

echo "📥 Step 1: Pulling latest changes from Git..."
git pull origin main
echo "✅ Code updated"
echo ""

echo "📦 Step 2: Installing/updating dependencies..."
npm install --production
echo "✅ Dependencies updated"
echo ""

echo "🔨 Step 3: Rebuilding application..."
rm -rf .next
npm run build
echo "✅ Application rebuilt"
echo ""

echo "🔄 Step 4: Restarting application..."
pm2 restart floralgifts
pm2 save
echo "✅ Application restarted"
echo ""

echo "📊 Step 5: Checking application status..."
pm2 status floralgifts
echo ""

echo "📋 Step 6: Viewing recent logs..."
pm2 logs floralgifts --lines 10 --nostream
echo ""

echo "=========================================="
echo "✅ Update Complete!"
echo "=========================================="
echo ""
echo "🌐 Website: https://floralwhispersgifts.co.ke"
echo ""
echo "📝 Useful commands:"
echo "  pm2 status              - Check application status"
echo "  pm2 logs floralgifts    - View application logs"
echo "  pm2 restart floralgifts - Restart application"
echo "  pm2 stop floralgifts     - Stop application"
echo ""
