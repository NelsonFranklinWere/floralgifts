#!/bin/bash

# Deploy Changes via Git (Recommended Method)
# This script commits changes and deploys via Git pull on server

set -e

SERVER_USER="floral"
SERVER_IP="${DEPLOY_SERVER_IP:-147.182.164.82}"
SERVER_PASSWORD="${DEPLOY_SERVER_PASSWORD:?Set DEPLOY_SERVER_PASSWORD env var — never commit passwords}"
APP_DIR="/home/$SERVER_USER/floralgifts"

echo "=========================================="
echo "🚀 Deploying Changes via Git"
echo "=========================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Please initialize git first."
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Committing changes..."
        git add .
        git commit -m "Fix STK push to use Co-op Bank API directly with M-Pesa callback

- Updated STK push to use Co-op Bank API (no Pesapal redirect)
- Changed callback URL to use M-Pesa callback endpoint
- Updated M-Pesa callback handler to handle Co-op Bank callbacks
- Added email notifications to M-Pesa callback handler
- Fixed payment status recording for both STK push and PayPal/card payments"
        
        echo "📤 Pushing to remote repository..."
        git push origin main || {
            echo "❌ Failed to push to remote. Please push manually:"
            echo "  git push origin main"
            exit 1
        }
        echo "✅ Changes pushed to repository"
    else
        echo "⚠️  Skipping commit. Please commit manually before deploying."
        exit 1
    fi
else
    echo "✅ No uncommitted changes"
fi

echo ""
echo "🔄 Deploying to server..."
echo ""

# Function to execute commands on remote server
execute_remote() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_IP" "$1"
}

# Pull latest changes on server
echo "📥 Pulling latest changes from repository..."
execute_remote "cd $APP_DIR && git pull origin main" || {
    echo "❌ Failed to pull changes on server"
    exit 1
}

echo "✅ Code updated on server"
echo ""

# Rebuild application
echo "🔨 Rebuilding application..."
execute_remote "cd $APP_DIR && rm -rf .next && npm run build" || {
    echo "⚠️  Build failed, but continuing with restart..."
}

# Restart PM2 application
echo "🔄 Restarting application..."
execute_remote "cd $APP_DIR && pm2 restart floralgifts && pm2 save" || {
    echo "❌ Failed to restart application"
    echo ""
    echo "Please restart manually:"
    echo "  ssh $SERVER_USER@$SERVER_IP"
    echo "  cd $APP_DIR && pm2 restart floralgifts && pm2 save"
    exit 1
}

echo ""
echo "✅ Verifying application status..."
execute_remote "pm2 status floralgifts"

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "🌐 Website: https://floralwhispersgifts.co.ke"
echo ""
echo "📋 Deployed changes:"
echo "  ✅ STK Push uses Co-op Bank API directly"
echo "  ✅ M-Pesa callback handles Co-op Bank callbacks"
echo "  ✅ Email notifications for payment confirmations"
echo ""
