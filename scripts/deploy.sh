#!/bin/bash

# Floral Whispers Gifts - Server Deployment Script
# This script deploys the Next.js app to DigitalOcean server

set -e  # Exit on error

# Server Configuration
SERVER_USER="floral"
SERVER_IP="157.245.34.218"
SERVER_PASSWORD="Floral@254Floral"
APP_NAME="floralgifts"
APP_DIR="/home/$SERVER_USER/$APP_NAME"
GIT_REPO_URL=""  # Add your Git repository URL here

echo "🚀 Starting deployment to $SERVER_USER@$SERVER_IP..."

# Function to execute commands on remote server
execute_remote() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$1"
}

# Function to copy files to remote server
copy_to_remote() {
    sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=no "$1" "$SERVER_USER@$SERVER_IP:$2"
}

echo "📦 Step 1: Cleaning up old deployment..."
execute_remote "cd /home/$SERVER_USER && rm -rf $APP_NAME || true"

echo "📥 Step 2: Cloning repository..."
if [ -z "$GIT_REPO_URL" ]; then
    echo "⚠️  GIT_REPO_URL not set. Please clone manually or set it in the script."
    echo "   Run: git clone YOUR_REPO_URL $APP_DIR"
else
    execute_remote "git clone $GIT_REPO_URL $APP_DIR"
fi

echo "📦 Step 3: Installing dependencies..."
execute_remote "cd $APP_DIR && npm install --production"

echo "✅ Deployment script completed!"
echo ""
echo "📋 Next steps:"
echo "   1. SSH into server: ssh $SERVER_USER@$SERVER_IP"
echo "   2. Copy .env.local file to $APP_DIR/.env.local"
echo "   3. Run: cd $APP_DIR && pm2 start ecosystem.config.js"
echo "   4. Run: pm2 save"
echo "   5. Setup Nginx and SSL (see scripts/server-setup.sh)"

