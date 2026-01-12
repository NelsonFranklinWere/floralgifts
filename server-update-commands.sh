#!/bin/bash

# Server Update Commands
# Run these commands on the server after SSH login

echo "🔄 Updating Floral Whispers Gifts Server..."

# Navigate to app directory
cd /home/floral/floralgifts

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart floralgifts || pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

echo "✅ Server update completed!"
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs floralgifts --lines 50"

