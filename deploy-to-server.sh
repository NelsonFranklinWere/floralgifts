#!/bin/bash

# Deploy Changes to Production Server
# This script deploys updated files to the production server

set -e

SERVER_USER="floral"
SERVER_IP="157.245.34.218"
SERVER_PASSWORD="Floral@254Floral"
APP_DIR="/home/$SERVER_USER/floralgifts"

echo "=========================================="
echo "🚀 Deploying Changes to Production Server"
echo "=========================================="
echo "Server: $SERVER_USER@$SERVER_IP"
echo "App Directory: $APP_DIR"
echo ""

# Check if sshpass is available
if ! command -v sshpass &> /dev/null; then
    echo "⚠️  sshpass not found. Installing..."
    sudo apt-get update -qq && sudo apt-get install -y -qq sshpass
fi

# Function to execute commands on remote server
execute_remote() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_IP" "$1"
}

# Function to copy files to remote server
copy_to_remote() {
    echo "📤 Copying $1..."
    sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null "$1" "$SERVER_USER@$SERVER_IP:$2" || {
        echo "❌ Failed to copy $1"
        return 1
    }
    echo "✅ Copied $1"
}

# Files to deploy (STK Push fixes and related changes)
FILES=(
    "components/CheckoutForm.tsx:/home/floral/floralgifts/components/"
    "app/checkout/page.tsx:/home/floral/floralgifts/app/checkout/"
    "app/api/coopbank/stkpush/route.ts:/home/floral/floralgifts/app/api/coopbank/stkpush/"
    "app/api/mpesa/callback/route.ts:/home/floral/floralgifts/app/api/mpesa/callback/"
    "app/api/mpesa/stkpush/route.ts:/home/floral/floralgifts/app/api/mpesa/stkpush/"
)

echo "📦 Step 1: Copying updated files to server..."
echo ""

# Copy each file
for file_path in "${FILES[@]}"; do
    IFS=':' read -r local_file remote_dir <<< "$file_path"
    
    if [ ! -f "$local_file" ]; then
        echo "⚠️  File not found: $local_file (skipping)"
        continue
    fi
    
    copy_to_remote "$local_file" "$remote_dir"
done

echo ""
echo "🔄 Step 2: Restarting application on server..."
echo ""

# Restart PM2 application
execute_remote "cd $APP_DIR && pm2 restart floralgifts && pm2 save" || {
    echo "❌ Failed to restart application"
    echo ""
    echo "Please restart manually:"
    echo "  ssh $SERVER_USER@$SERVER_IP"
    echo "  cd $APP_DIR && pm2 restart floralgifts && pm2 save"
    exit 1
}

echo ""
echo "✅ Step 3: Verifying application status..."
echo ""

# Check PM2 status
execute_remote "pm2 status floralgifts" || echo "⚠️  Could not check PM2 status"

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📋 Summary of deployed changes:"
echo "  ✅ STK Push now uses Co-op Bank API directly (no Pesapal redirect)"
echo "  ✅ Callback URL changed to use M-Pesa callback endpoint"
echo "  ✅ M-Pesa callback handler updated to handle Co-op Bank callbacks"
echo "  ✅ Email notifications added to M-Pesa callback"
echo ""
echo "🌐 Website: https://floralwhispersgifts.co.ke"
echo ""
echo "🧪 Test the changes:"
echo "  ./test-stk-payment.sh 254743869564 100"
echo ""
