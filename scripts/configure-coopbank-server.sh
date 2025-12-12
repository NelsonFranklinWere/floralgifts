#!/bin/bash

# Co-op Bank STK Push Server Configuration Script
# This script configures environment variables on the DigitalOcean server

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Server details
SERVER_IP="157.245.34.218"
SERVER_USER="floral"
SERVER_PASSWORD="Floral@254Floral"

# Co-op Bank credentials from Postman collection
COOP_BANK_CONSUMER_KEY="gF8Si3TsoRyLl9Pnpv8XYBtn04ca"
COOP_BANK_CONSUMER_SECRET="ILYevkBdY_gHz0e1FQfzQWZljv4a"
COOP_BANK_CALLBACK_URL="https://157.245.34.218/api/coopbank/callback"
COOP_BANK_OPERATOR_CODE="FLORAL"
COOP_BANK_USER_ID="FLORALWHISPERS"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Co-op Bank STK Push Configuration${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Function to update environment variables on server
update_server_env() {
    echo -e "${YELLOW}Updating environment variables on server...${NC}"
    
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << EOF
        # Navigate to application directory
        cd ~/floralgifts || cd /var/www/floralgifts || cd /home/floral/floralgifts || { echo "Could not find app directory"; exit 1; }
        
        # Backup existing .env file
        if [ -f .env.local ]; then
            cp .env.local .env.local.backup.\$(date +%Y%m%d_%H%M%S)
            echo "Backed up existing .env.local"
        fi
        
        # Update or add Co-op Bank environment variables
        echo "Updating Co-op Bank configuration..."
        
        # Remove old Co-op Bank variables if they exist
        grep -v "^COOP_BANK_" .env.local > .env.local.tmp 2>/dev/null || true
        mv .env.local.tmp .env.local 2>/dev/null || touch .env.local
        
        # Add Co-op Bank variables
        echo "" >> .env.local
        echo "# Co-op Bank M-Pesa STK Push Configuration" >> .env.local
        echo "COOP_BANK_CONSUMER_KEY=$COOP_BANK_CONSUMER_KEY" >> .env.local
        echo "COOP_BANK_CONSUMER_SECRET=$COOP_BANK_CONSUMER_SECRET" >> .env.local
        echo "COOP_BANK_CALLBACK_URL=$COOP_BANK_CALLBACK_URL" >> .env.local
        echo "COOP_BANK_OPERATOR_CODE=$COOP_BANK_OPERATOR_CODE" >> .env.local
        echo "COOP_BANK_USER_ID=$COOP_BANK_USER_ID" >> .env.local
        
        echo "Environment variables updated successfully"
        
        # Show updated Co-op Bank variables
        echo ""
        echo "Current Co-op Bank configuration:"
        grep "^COOP_BANK_" .env.local
        
        # Restart application if PM2 is used
        if command -v pm2 &> /dev/null; then
            echo ""
            echo "Restarting application with PM2..."
            pm2 restart floralgifts || pm2 restart all || echo "PM2 restart failed, please restart manually"
        fi
EOF

    echo -e "${GREEN}✓ Environment variables updated on server${NC}"
}

# Function to test the configuration
test_configuration() {
    echo ""
    echo -e "${YELLOW}Testing Co-op Bank configuration...${NC}"
    
    # Test token endpoint
    echo "Testing token endpoint..."
    TOKEN_RESPONSE=$(sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "curl -s -X POST https://openapi.co-opbank.co.ke/token \
        -H 'Authorization: Basic Z0Y4U2kzVHNvUnlMbDlQbnB2OFhZQnRuMDRjYTpJTFlldmtCZFlfZ0h6MGUxRlFmelFXWmxqdjRh' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -d 'grant_type=client_credentials'")
    
    if echo "$TOKEN_RESPONSE" | grep -q "access_token"; then
        echo -e "${GREEN}✓ Token endpoint working${NC}"
    else
        echo -e "${RED}✗ Token endpoint test failed${NC}"
        echo "Response: $TOKEN_RESPONSE"
    fi
    
    # Test callback URL accessibility
    echo ""
    echo "Testing callback URL accessibility..."
    CALLBACK_TEST=$(sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "curl -s -o /dev/null -w '%{http_code}' -X POST https://floralwhispersgifts.co.ke/api/coopbank/callback \
        -H 'Content-Type: application/json' \
        -d '{\"test\":\"true\"}' || echo '000'")
    
    if [ "$CALLBACK_TEST" = "200" ] || [ "$CALLBACK_TEST" = "400" ] || [ "$CALLBACK_TEST" = "500" ]; then
        echo -e "${GREEN}✓ Callback URL is accessible (HTTP $CALLBACK_TEST)${NC}"
    else
        echo -e "${YELLOW}⚠ Callback URL returned HTTP $CALLBACK_TEST (may need to check server)${NC}"
    fi
}

# Main execution
echo -e "${YELLOW}Server: $SERVER_USER@$SERVER_IP${NC}"
echo -e "${YELLOW}Callback URL: $COOP_BANK_CALLBACK_URL${NC}"
echo ""

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}sshpass is not installed. Installing...${NC}"
    sudo apt-get update && sudo apt-get install -y sshpass || {
        echo -e "${RED}Could not install sshpass. Please install it manually:${NC}"
        echo "sudo apt-get install sshpass"
        echo ""
        echo "Or run these commands manually on the server:"
        echo "cd ~/floralgifts"
        echo "echo 'COOP_BANK_CONSUMER_KEY=$COOP_BANK_CONSUMER_KEY' >> .env.local"
        echo "echo 'COOP_BANK_CONSUMER_SECRET=$COOP_BANK_CONSUMER_SECRET' >> .env.local"
        echo "echo 'COOP_BANK_CALLBACK_URL=$COOP_BANK_CALLBACK_URL' >> .env.local"
        echo "echo 'COOP_BANK_OPERATOR_CODE=$COOP_BANK_OPERATOR_CODE' >> .env.local"
        echo "echo 'COOP_BANK_USER_ID=$COOP_BANK_USER_ID' >> .env.local"
        exit 1
    }
fi

# Update server environment
update_server_env

# Test configuration
test_configuration

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Configuration Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Test STK Push with phone: 254743869564"
echo "2. Verify callback is received when payment is made"
echo "3. Check order status updates in database"
echo ""
echo "Test command:"
echo "curl -X POST https://floralwhispersgifts.co.ke/api/coopbank/stkpush \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"MobileNumber\":\"254743869564\",\"Amount\":1}'"

