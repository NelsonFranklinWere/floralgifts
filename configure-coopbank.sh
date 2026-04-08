#!/bin/bash

# Co-op Bank Consumer Secret Configuration Script
# Uses your provided Consumer Key and helps configure the Consumer Secret

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Co-op Bank Consumer Secret Configuration${NC}"

# Navigate to project directory
cd /home/floral/floralgifts || {
    echo -e "${RED}❌ Failed to navigate to project directory${NC}"
    exit 1
}

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"

# Your provided Consumer Key
CONSUMER_KEY="gF8Si3TsoRyLl9Pnpv8XYBtn04ca"
echo -e "${GREEN}✅ Using Consumer Key: ${CONSUMER_KEY}${NC}"

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

echo -e "${YELLOW}🔧 Please enter your Co-op Bank Consumer Secret:${NC}"
echo -e "${BLUE}📖 You can find this in your Co-op Bank developer dashboard${NC}"
echo -e "${BLUE}🌐 Callback URL configured: https://floralwhispersgifts.co.ke/api/coopbank/callback${NC}"

# Get Consumer Secret
echo -e "${YELLOW}💡 Enter Co-op Bank Consumer Secret:${NC}"
read -s -p "Consumer Secret: " CONSUMER_SECRET
echo ""

if [ -z "$CONSUMER_SECRET" ]; then
    echo -e "${RED}❌ Consumer Secret is required${NC}"
    exit 1
fi

# Validate Consumer Secret format (should be reasonably long)
if [ ${#CONSUMER_SECRET} -lt 10 ]; then
    echo -e "${RED}❌ Consumer Secret seems too short. Please verify it's correct.${NC}"
    echo -e "${YELLOW}💡 Consumer Secrets are typically 20+ characters long${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Consumer Secret received (${#CONSUMER_SECRET} characters)${NC}"

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

echo -e "${GREEN}✅ Environment variables configured successfully!${NC}"

# Show configuration summary
echo ""
echo -e "${BLUE}📋 Configuration Summary:${NC}"
echo -e "${BLUE}   • Consumer Key: ${CONSUMER_KEY}${NC}"
echo -e "${BLUE}   • Consumer Secret: ${CONSUMER_SECRET:0:8}...${CONSUMER_SECRET: -4}${NC}"
echo -e "${BLUE}   • Callback URL: https://floralwhispersgifts.co.ke/api/coopbank/callback${NC}"
echo -e "${BLUE}   • Operator Code: FLORAL${NC}"
echo -e "${BLUE}   • User ID: FLORALWHISPERS${NC}"

# Test the credentials
echo ""
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
    
    echo -e "${GREEN}✅ Configuration completed successfully!${NC}"
    echo -e "${GREEN}🌐 Your STK push payments should now work${NC}"
    
else
    echo -e "${RED}❌ Co-op Bank credentials test failed${NC}"
    echo -e "${YELLOW}📄 Response Body:${NC}"
    echo "${RESPONSE_BODY}"
    
    if echo "$RESPONSE_BODY" | grep -q "Request Rejected"; then
        echo -e "${YELLOW}🚫 Your server IP is being blocked by Co-op Bank's firewall${NC}"
        echo -e "${YELLOW}🔧 Solutions:${NC}"
        echo -e "${YELLOW}   1. Contact Co-op Bank to whitelist your server IP: $(curl -s ifconfig.me)${NC}"
        echo -e "${YELLOW}   2. Verify the Consumer Secret is correct${NC}"
        echo -e "${YELLOW}   3. Check if your API account is active${NC}"
        echo -e "${YELLOW}   4. Ensure callback URL is configured in Co-op Bank portal${NC}"
        
        echo -e "${YELLOW}📧 IP Whitelist Request Template:${NC}"
        echo -e "${BLUE}   To: apisupport@co-opbank.co.ke${NC}"
        echo -e "${BLUE}   Subject: IP Whitelist Request - Floral Whispers Gifts${NC}"
        echo -e "${BLUE}   Body: Please whitelist IP $(curl -s ifconfig.me) for API access. Consumer Key: ${CONSUMER_KEY}${NC}"
        
    elif echo "$RESPONSE_BODY" | grep -q "invalid_client"; then
        echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
        echo -e "${YELLOW}   1. Double-check your Consumer Secret for typos${NC}"
        echo -e "${YELLOW}   2. Ensure no extra spaces or characters${NC}"
        echo -e "${YELLOW}   3. Verify Consumer Key matches exactly: ${CONSUMER_KEY}${NC}"
        echo -e "${YELLOW}   4. Check if your API account is active and not suspended${NC}"
        
        echo -e "${YELLOW}💡 Would you like to re-enter the Consumer Secret? (y/n)${NC}"
        read -p "Choice: " retry_choice
        
        if [ "$retry_choice" = "y" ] || [ "$retry_choice" = "Y" ]; then
            exec "$0"
        fi
    fi
fi

echo ""
echo -e "${GREEN}🔧 Configuration completed!${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "${YELLOW}   1. If successful, test STK push payment on your site${NC}"
echo -e "${YELLOW}   2. If blocked, request IP whitelisting from Co-op Bank${NC}"
echo -e "${YELLOW}   3. Check PM2 logs: pm2 logs floralgifts${NC}"
echo -e "${YELLOW}   4. Monitor successful payments in admin dashboard${NC}"
