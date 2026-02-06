#!/bin/bash

# Server Update Script for Floral Whispers Gifts
# Run this script ON THE SERVER (not locally)

echo "🔄 Starting server update..."
echo ""

# Navigate to app directory
cd /home/floral/floralgifts || exit 1

# Step 1: Pull latest changes
echo "📥 Step 1/5: Pulling latest changes from GitHub..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to pull from GitHub"
    exit 1
fi

# Step 2: Install dependencies
echo ""
echo "📦 Step 2/5: Installing dependencies..."
npm install --production
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

# Step 3: Build application
echo ""
echo "🔨 Step 3/5: Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

# Step 4: Restart PM2
echo ""
echo "🔄 Step 4/5: Restarting PM2..."
pm2 restart floralgifts || pm2 start ecosystem.config.js
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: PM2 restart had issues, but continuing..."
fi

# Step 5: Save PM2 configuration
echo ""
echo "💾 Step 5/5: Saving PM2 configuration..."
pm2 save

echo ""
echo "✅ Server update completed successfully!"
echo ""
echo "📊 To check status, run:"
echo "   pm2 status"
echo "   pm2 logs floralgifts --lines 50"
echo ""
echo "🔍 To test search API:"
echo "   curl https://floralwhispersgifts.co.ke/api/search?q=flower"


