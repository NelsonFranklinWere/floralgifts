#!/bin/bash

# Deploy STK Push Fix to Server
# This script deploys the updated files for Co-op Bank STK push

set -e

SERVER_USER="floral"
SERVER_IP="157.245.34.218"
SERVER_PASSWORD="Floral@254Floral"
APP_DIR="/home/$SERVER_USER/floralgifts"

echo "🚀 Deploying STK Push Fix to Server..."
echo ""

# Files to deploy
FILES=(
  "components/CheckoutForm.tsx"
  "app/checkout/page.tsx"
  "app/api/coopbank/stkpush/route.ts"
  "app/api/mpesa/callback/route.ts"
)

echo "📦 Files to deploy:"
for file in "${FILES[@]}"; do
  echo "  - $file"
done
echo ""

# Deploy each file
for file in "${FILES[@]}"; do
  echo "📤 Deploying $file..."
  sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=accept-new \
    "$file" "$SERVER_USER@$SERVER_IP:$APP_DIR/$file" || {
    echo "❌ Failed to deploy $file"
    echo ""
    echo "Please deploy manually:"
    echo "  scp $file $SERVER_USER@$SERVER_IP:$APP_DIR/$file"
    exit 1
  }
done

echo ""
echo "🔄 Restarting application..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=accept-new \
  "$SERVER_USER@$SERVER_IP" "cd $APP_DIR && pm2 restart floralgifts && pm2 save" || {
  echo "❌ Failed to restart application"
  echo ""
  echo "Please restart manually:"
  echo "  ssh $SERVER_USER@$SERVER_IP"
  echo "  cd $APP_DIR && pm2 restart floralgifts && pm2 save"
  exit 1
}

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Summary of changes:"
echo "  ✅ STK Push now uses Co-op Bank API directly (no Pesapal redirect)"
echo "  ✅ Callback URL changed to use M-Pesa callback endpoint"
echo "  ✅ M-Pesa callback handler updated to handle Co-op Bank callbacks"
echo ""
echo "🧪 Test the payment:"
echo "  ./test-stk-payment.sh 254743869564 100"
