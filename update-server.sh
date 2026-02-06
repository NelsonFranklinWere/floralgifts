#!/bin/bash

# Update server with latest GitHub changes
SERVER_USER="floral"
SERVER_IP="157.245.34.218"
APP_DIR="/home/$SERVER_USER/floralgifts"

echo "🔄 Updating server with latest GitHub changes..."

# Function to execute commands on remote server
execute_remote() {
    sshpass -p "Floral@254Floral" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$1"
}

echo "📥 Step 1: Pulling latest changes from GitHub..."
execute_remote "cd $APP_DIR && git pull origin main"

echo "📦 Step 2: Installing dependencies..."
execute_remote "cd $APP_DIR && npm install --production"

echo "🔨 Step 3: Building application..."
execute_remote "cd $APP_DIR && npm run build"

echo "🔄 Step 4: Restarting PM2..."
execute_remote "cd $APP_DIR && pm2 restart floralgifts || pm2 start ecosystem.config.js"

echo "✅ Server update completed!"

