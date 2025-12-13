#!/bin/bash
# Sync server files with repository
# This ensures server has the latest code from the repository

set -e

SERVER_USER="floral"
SERVER_IP="157.245.34.218"
SERVER_PASSWORD="Floral@254Floral"
APP_DIR="/home/$SERVER_USER/floralgifts"

echo "🔄 Syncing server with repository..."

# Function to execute commands on remote server
execute_remote() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$1"
}

echo "📥 Step 1: Pulling latest changes from repository..."
execute_remote "cd $APP_DIR && git fetch origin main && git reset --hard origin/main"

echo "🔨 Step 2: Rebuilding application..."
execute_remote "cd $APP_DIR && pm2 stop floralgifts || true && rm -rf .next && npm run build"

echo "🚀 Step 3: Restarting application..."
execute_remote "cd $APP_DIR && pm2 start npm --name floralgifts -- start && pm2 save"

echo "✅ Server synced successfully!"
echo ""
echo "🌐 Website: https://floralwhispersgifts.co.ke"
echo "📱 STK Push ready for testing"

