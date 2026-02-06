#!/bin/bash

# Manual Server Update Script for Digital Ocean
# Run these commands on your Digital Ocean server console

echo "🔄 Starting manual server update..."

# Navigate to app directory
cd /home/floral/floralgifts

# Backup current working version (optional but recommended)
echo "📦 Creating backup..."
cp -r . ../floralgifts-backup-$(date +%Y%m%d-%H%M%S)

# If git pull works:
echo "📥 Attempting git pull..."
if git pull origin main; then
    echo "✅ Git pull successful"
else
    echo "❌ Git pull failed. You may need to update files manually."
    echo "Manual update needed for:"
    echo "1. app/api/mpesa/stkpush/route.ts - Fixed request.ip issue"
    echo "2. Valentine's SEO updates in app/layout.tsx"
    echo "3. Footer styling updates in components/Footer.tsx"
    echo "4. Cards category support in various files"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart floralgifts

# Check status
echo "📊 Checking PM2 status..."
pm2 status

# Show recent logs
echo "📝 Recent logs:"
pm2 logs floralgifts --lines 10

echo "✅ Update process completed!"
echo "🌐 Your site should be live at: https://floralwhispersgifts.co.ke"
