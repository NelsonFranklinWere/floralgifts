#!/bin/bash

# Deploy logging improvements to production server

echo "🚀 Deploying logging improvements to production..."

# Server details
SERVER="floral@157.245.34.218"
SERVER_PATH="/home/floral/floralgifts"

# Copy updated files
echo "📁 Uploading updated files..."
scp app/api/orders/route.ts $SERVER:$SERVER_PATH/app/api/orders/
scp app/api/coopbank/stkpush/route.ts $SERVER:$SERVER_PATH/app/api/coopbank/stkpush/
scp lib/store/cart.ts $SERVER:$SERVER_PATH/lib/store/
scp app/checkout/page.tsx $SERVER:$SERVER_PATH/app/checkout/

# SSH into server and restart
echo "🔄 Restarting application on server..."
ssh $SERVER << 'EOF'
    cd /home/floral/floralgifts
    
    # Build the application
    npm run build
    
    # Restart with PM2
    pm2 restart floralgifts || pm2 start ecosystem.config.js
    
    echo "✅ Application restarted with improved logging"
    
    # Show recent logs
    echo "📋 Recent application logs:"
    pm2 logs floralgifts --lines 20
EOF

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔍 Logging improvements added:"
echo "1. ✅ Cart operations (add, remove, clear)"
echo "2. ✅ Order creation process"
echo "3. ✅ Co-op Bank STK Push initiation"
echo "4. ✅ Checkout payment process"
echo "5. ✅ Pesapal payment success/failure"
echo "6. ✅ Comprehensive error logging"
echo ""
echo "📊 To monitor logs in real-time:"
echo "ssh $SERVER"
echo "pm2 logs floralgifts --follow"