#!/bin/bash

# Co-op Bank Credentials Fix Script
# This script helps fix common Co-op Bank authentication issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Co-op Bank Credentials Fix Script${NC}"

# Navigate to project directory
cd /home/floral/floralgifts || {
    echo -e "${RED}❌ Failed to navigate to project directory${NC}"
    exit 1
}

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}📄 Found .env.local file${NC}"
else
    echo -e "${YELLOW}📝 Creating .env.local file...${NC}"
    touch .env.local
fi

# Backup current .env.local
echo -e "${YELLOW}💾 Backing up current .env.local...${NC}"
cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)

echo -e "${YELLOW}🔧 Checking Co-op Bank credentials...${NC}"

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

# Check and set COOP_BANK_CONSUMER_KEY
if [ -z "$COOP_BANK_CONSUMER_KEY" ]; then
    echo -e "${RED}❌ COOP_BANK_CONSUMER_KEY is not set${NC}"
    echo -e "${YELLOW}💡 Please enter your Co-op Bank Consumer Key:${NC}"
    read -p "Consumer Key: " CONOP_BANK_CONSUMER_KEY_INPUT
    
    if [ -n "$CONOP_BANK_CONSUMER_KEY_INPUT" ]; then
        update_env "COOP_BANK_CONSUMER_KEY" "$CONOP_BANK_CONSUMER_KEY_INPUT"
        export COOP_BANK_CONSUMER_KEY="$CONOP_BANK_CONSUMER_KEY_INPUT"
    else
        echo -e "${RED}❌ No consumer key provided${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ COOP_BANK_CONSUMER_KEY is already set${NC}"
fi

# Check and set COOP_BANK_CONSUMER_SECRET
if [ -z "$COOP_BANK_CONSUMER_SECRET" ]; then
    echo -e "${RED}❌ COOP_BANK_CONSUMER_SECRET is not set${NC}"
    echo -e "${YELLOW}💡 Please enter your Co-op Bank Consumer Secret:${NC}"
    read -s -p "Consumer Secret: " COOP_BANK_CONSUMER_SECRET_INPUT
    echo ""
    
    if [ -n "$COOP_BANK_CONSUMER_SECRET_INPUT" ]; then
        update_env "COOP_BANK_CONSUMER_SECRET" "$COOP_BANK_CONSUMER_SECRET_INPUT"
        export COOP_BANK_CONSUMER_SECRET="$COOP_BANK_CONSUMER_SECRET_INPUT"
    else
        echo -e "${RED}❌ No consumer secret provided${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ COOP_BANK_CONSUMER_SECRET is already set${NC}"
fi

# Set other required Co-op Bank environment variables if not set
echo -e "${YELLOW}🔧 Setting additional Co-op Bank variables...${NC}"

update_env "COOP_BANK_OPERATOR_CODE" "FLORAL"
update_env "COOP_BANK_USER_ID" "FLORALWHISPERS"

# Test the credentials
echo -e "${YELLOW}🧪 Testing Co-op Bank credentials...${NC}"

CREDENTIALS=$(echo -n "${COOP_BANK_CONSUMER_KEY}:${COOP_BANK_CONSUMER_SECRET}" | base64)

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
        echo -e "${GREEN}🎫 Access Token obtained: ${ACCESS_TOKEN:0:20}...${NC}"
        echo -e "${GREEN}⏰ Expires in: ${EXPIRES_IN} seconds${NC}"
    fi
    
    echo -e "${YELLOW}🔄 Restarting PM2 to apply changes...${NC}"
    pm2 restart floralgifts || pm2 start npm --name floralgifts -- start
    pm2 save
    
    echo -e "${GREEN}✅ Co-op Bank authentication fixed and application restarted!${NC}"
    
else
    echo -e "${RED}❌ Co-op Bank credentials are invalid${NC}"
    echo -e "${YELLOW}📄 Error Response:${NC}"
    echo "${RESPONSE_BODY}" | jq . 2>/dev/null || echo "${RESPONSE_BODY}"
    
    echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
    echo -e "${YELLOW}   1. Double-check your Consumer Key and Secret${NC}"
    echo -e "${YELLOW}   2. Ensure your Co-op Bank API account is active${NC}"
    echo -e "${YELLOW}   3. Verify your server IP is whitelisted${NC}"
    echo -e "${YELLOW}   4. Check if you're using sandbox vs production credentials${NC}"
    
    echo -e "${YELLOW}💡 Would you like to re-enter credentials? (y/n)${NC}"
    read -p "Choice: " retry_choice
    
    if [ "$retry_choice" = "y" ] || [ "$retry_choice" = "Y" ]; then
        # Clear current credentials
        sed -i '/^COOP_BANK_CONSUMER_KEY=/d' .env.local
        sed -i '/^COOP_BANK_CONSUMER_SECRET=/d' .env.local
        
        # Run the script again
        exec "$0"
    fi
fi

echo -e "${GREEN}🔧 Credentials fix script completed!${NC}"
