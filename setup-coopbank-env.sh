#!/bin/bash

# Co-op Bank Environment Setup Script
# This script helps set up Co-op Bank environment variables

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Co-op Bank Environment Setup${NC}"

# Navigate to project directory
cd /home/floral/floralgifts || {
    echo -e "${RED}❌ Failed to navigate to project directory${NC}"
    exit 1
}

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}📄 Found .env.local file${NC}"
    echo -e "${BLUE}📋 Current Co-op Bank variables:${NC}"
    grep "COOP_BANK" .env.local 2>/dev/null || echo -e "${YELLOW}No Co-op Bank variables found${NC}"
else
    echo -e "${YELLOW}📝 Creating .env.local file...${NC}"
    touch .env.local
fi

# Backup current .env.local
echo -e "${YELLOW}💾 Backing up current .env.local...${NC}"
cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)

echo -e "${YELLOW}🔧 Please enter your Co-op Bank API credentials:${NC}"
echo -e "${BLUE}📖 You can get these from your Co-op Bank developer portal${NC}"

# Get Consumer Key
echo -e "${YELLOW}💡 Enter Co-op Bank Consumer Key:${NC}"
read -p "Consumer Key: " CONSUMER_KEY

if [ -z "$CONSUMER_KEY" ]; then
    echo -e "${RED}❌ Consumer Key is required${NC}"
    exit 1
fi

# Get Consumer Secret
echo -e "${YELLOW}💡 Enter Co-op Bank Consumer Secret:${NC}"
read -s -p "Consumer Secret: " CONSUMER_SECRET
echo ""

if [ -z "$CONSUMER_SECRET" ]; then
    echo -e "${RED}❌ Consumer Secret is required${NC}"
    exit 1
fi

# Function to add/update environment variable
update_env() {
    local key=$1
    local value=$2
    local file=".env.local"
    
    if grep -q "^${key}=" "$file"; then
        # Update existing variable
        sed -i "s|^${key}=.*|${key}=${value}|" "$file"
        echo -e "${GREEN}✅ Updated ${key}${NC}"
    else
        # Add new variable
        echo "${key}=${value}" >> "$file"
        echo -e "${GREEN}✅ Added ${key}${NC}"
    fi
}

# Add Co-op Bank variables
echo -e "${YELLOW}📝 Adding Co-op Bank variables to .env.local...${NC}"

update_env "COOP_BANK_CONSUMER_KEY" "$CONSUMER_KEY"
update_env "COOP_BANK_CONSUMER_SECRET" "$CONSUMER_SECRET"
update_env "COOP_BANK_OPERATOR_CODE" "FLORAL"
update_env "COOP_BANK_USER_ID" "FLORALWHISPERS"

# Export variables for current session
export COOP_BANK_CONSUMER_KEY="$CONSUMER_KEY"
export COOP_BANK_CONSUMER_SECRET="$CONSUMER_SECRET"
export COOP_BANK_OPERATOR_CODE="FLORAL"
export COOP_BANK_USER_ID="FLORALWHISPERS"

echo -e "${GREEN}✅ Environment variables set successfully!${NC}"

# Test the credentials
echo -e "${YELLOW}🧪 Testing Co-op Bank credentials...${NC}"

CREDENTIALS=$(echo -n "${COOP_BANK_CONSUMER_KEY}:${COOP_BANK_CONSUMER_SECRET}" | base64)

echo -e "${BLUE}🔐 Making test request to Co-op Bank API...${NC}"

RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
    -X POST \
    "https://openapi.co-opbank.co.ke/token" \
    -H "Authorization: Basic ${CREDENTIALS}" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "User-Agent: FloralWhispersGifts/1.0" \
    -H "Accept: application/json" \
    -H "Cache-Control: no-cache" \
    -H "Pragma: no-cache" \
    -d "grant_type=client_credentials")

# Extract HTTP status
HTTP_STATUS=$(echo $RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
# Extract response body
RESPONSE_BODY=$(echo $RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

echo -e "${BLUE}📊 Response Status: ${HTTP_STATUS}${NC}"

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Co-op Bank credentials are valid!${NC}"
    
    # Extract token info
    ACCESS_TOKEN=$(echo "${RESPONSE_BODY}" | jq -r '.access_token' 2>/dev/null)
    EXPIRES_IN=$(echo "${RESPONSE_BODY}" | jq -r '.expires_in' 2>/dev/null)
    
    if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
        echo -e "${GREEN}🎫 Access Token: ${ACCESS_TOKEN:0:20}...${NC}"
        echo -e "${GREEN}⏰ Expires in: ${EXPIRES_IN} seconds${NC}"
    fi
    
    echo -e "${YELLOW}🔄 Restarting PM2 to apply environment changes...${NC}"
    
    # Restart PM2 with environment variables
    pm2 restart floralgifts --update-env || pm2 start npm --name floralgifts -- start
    pm2 save
    
    echo -e "${GREEN}✅ Setup completed successfully!${NC}"
    echo -e "${GREEN}🌐 Your STK push payments should now work${NC}"
    
else
    echo -e "${RED}❌ Co-op Bank credentials test failed${NC}"
    echo -e "${YELLOW}📄 Response Body:${NC}"
    echo "${RESPONSE_BODY}"
    
    if echo "$RESPONSE_BODY" | grep -q "Request Rejected"; then
        echo -e "${YELLOW}🚫 Your server IP is being blocked by Co-op Bank's firewall${NC}"
        echo -e "${YELLOW}🔧 Solutions:${NC}"
        echo -e "${YELLOW}   1. Contact Co-op Bank to whitelist your server IP: $(curl -s ifconfig.me)${NC}"
        echo -e "${YELLOW}   2. Use a VPN/proxy with a whitelisted IP${NC}"
        echo -e "${YELLOW}   3. Check if you're using sandbox vs production credentials${NC}"
        echo -e "${YELLOW}   4. Verify your Co-op Bank API account is active${NC}"
    else
        echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
        echo -e "${YELLOW}   1. Double-check your Consumer Key and Secret${NC}"
        echo -e "${YELLOW}   2. Ensure credentials don't have extra spaces${NC}"
        echo -e "${YELLOW}   3. Check if your API account is active${NC}"
    fi
    
    echo -e "${YELLOW}💡 Would you like to re-enter credentials? (y/n)${NC}"
    read -p "Choice: " retry_choice
    
    if [ "$retry_choice" = "y" ] || [ "$retry_choice" = "Y" ]; then
        exec "$0"
    fi
fi

echo -e "${GREEN}🔧 Environment setup completed!${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "${YELLOW}   1. Test STK push payment on your site${NC}"
echo -e "${YELLOW}   2. Check PM2 logs: pm2 logs floralgifts${NC}"
echo -e "${YELLOW}   3. Monitor successful payments in admin dashboard${NC}"
