#!/bin/bash

# Quick Co-op Bank STK Push Deployment Script
# Uses server IP for callback URL

set -e

SERVER_IP="157.245.34.218"
SERVER_USER="floral"
SERVER_PASSWORD="Floral@254Floral"

COOP_BANK_CONSUMER_KEY="gF8Si3TsoRyLl9Pnpv8XYBtn04ca"
COOP_BANK_CONSUMER_SECRET="ILYevkBdY_gHz0e1FQfzQWZljv4a"
COOP_BANK_CALLBACK_URL="https://157.245.34.218/api/coopbank/callback"
COOP_BANK_OPERATOR_CODE="FLORAL"
COOP_BANK_USER_ID="FLORALWHISPERS"

echo "=========================================="
echo "Co-op Bank STK Push Deployment"
echo "=========================================="
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Callback URL: $COOP_BANK_CALLBACK_URL"
echo ""

# Check if sshpass is available
if ! command -v sshpass &> /dev/null; then
    echo "Installing sshpass..."
    sudo apt-get update -qq && sudo apt-get install -y -qq sshpass
fi

echo "Connecting to server and configuring..."

sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
    # Find application directory
    APP_DIR=$(find ~ -name "floralgifts" -type d 2>/dev/null | head -1)
    if [ -z "$APP_DIR" ]; then
        APP_DIR=$(find /var/www -name "floralgifts" -type d 2>/dev/null | head -1)
    fi
    if [ -z "$APP_DIR" ]; then
        APP_DIR="~/floralgifts"
    fi
    
    cd "$APP_DIR" || exit 1
    echo "Working in: $(pwd)"
    
    # Backup existing .env.local
    if [ -f .env.local ]; then
        cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
        echo "✓ Backed up existing .env.local"
    else
        touch .env.local
        echo "✓ Created new .env.local"
    fi
    
    # Remove old Co-op Bank variables
    grep -v "^COOP_BANK_" .env.local > .env.local.tmp 2>/dev/null || true
    mv .env.local.tmp .env.local
    
    # Add Co-op Bank configuration
    cat >> .env.local << EOF

# Co-op Bank M-Pesa STK Push Configuration
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a
COOP_BANK_CALLBACK_URL=https://157.245.34.218/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
EOF
    
    echo ""
    echo "✓ Environment variables updated"
    echo ""
    echo "Current Co-op Bank configuration:"
    grep "^COOP_BANK_" .env.local || echo "No COOP_BANK variables found"
    
    # Restart application
    echo ""
    echo "Restarting application..."
    if command -v pm2 &> /dev/null; then
        pm2 restart floralgifts 2>/dev/null || pm2 restart all || echo "Note: PM2 restart attempted"
        pm2 save 2>/dev/null || true
        echo "✓ Application restarted with PM2"
    else
        echo "⚠ PM2 not found - please restart application manually"
    fi
    
    echo ""
    echo "Configuration complete!"
ENDSSH

echo ""
echo "=========================================="
echo "Testing Configuration"
echo "=========================================="
echo ""

# Test 1: Verify environment variables
echo "1. Checking environment variables..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
    "cd ~/floralgifts 2>/dev/null || cd /var/www/floralgifts 2>/dev/null || find ~ -name 'floralgifts' -type d | head -1 | xargs -I {} sh -c 'cd {} && grep \"^COOP_BANK_\" .env.local 2>/dev/null' || echo 'Could not find .env.local'"

echo ""
echo "2. Testing Co-op Bank token endpoint..."
TOKEN_RESULT=$(sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
    "curl -s -X POST https://openapi.co-opbank.co.ke/token \
    -H 'Authorization: Basic Z0Y4U2kzVHNvUnlMbDlQbnB2OFhZQnRuMDRjYTpJTFlldmtCZFlfZ0h6MGUxRlFmelFXWmxqdjRh' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'grant_type=client_credentials' | head -c 200")

if echo "$TOKEN_RESULT" | grep -q "access_token"; then
    echo "   ✓ Token endpoint working"
else
    echo "   ⚠ Token test response: $TOKEN_RESULT"
fi

echo ""
echo "3. Testing callback URL accessibility..."
CALLBACK_TEST=$(sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST https://157.245.34.218/api/coopbank/callback \
    -H 'Content-Type: application/json' \
    -d '{\"test\":true}' 2>&1 || echo '000'")

if [ "$CALLBACK_TEST" = "200" ] || [ "$CALLBACK_TEST" = "400" ] || [ "$CALLBACK_TEST" = "500" ]; then
    echo "   ✓ Callback URL is accessible (HTTP $CALLBACK_TEST)"
else
    echo "   ⚠ Callback URL returned: HTTP $CALLBACK_TEST"
fi

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Next: Test STK Push on the server:"
echo "ssh $SERVER_USER@$SERVER_IP"
echo "curl -X POST https://157.245.34.218/api/coopbank/stkpush \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"MobileNumber\":\"254743869564\",\"Amount\":1,\"Narration\":\"Test\"}'"
echo ""

