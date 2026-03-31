#!/bin/bash

# Co-op Bank Token Diagnostic Script
# This script helps diagnose and fix Co-op Bank authentication issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔍 Co-op Bank Token Diagnostic Tool${NC}"

# Navigate to project directory
cd /home/floral/floralgifts || {
    echo -e "${RED}❌ Failed to navigate to project directory${NC}"
    exit 1
}

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"

# Check environment variables
echo -e "${YELLOW}🔧 Checking environment variables...${NC}"

if [ -z "$COOP_BANK_CONSUMER_KEY" ]; then
    echo -e "${RED}❌ COOP_BANK_CONSUMER_KEY is not set${NC}"
    echo -e "${YELLOW}💡 Set it in your .env.local file or server environment${NC}"
else
    echo -e "${GREEN}✅ COOP_BANK_CONSUMER_KEY is set (${#COOP_BANK_CONSUMER_KEY} characters)${NC}"
    echo -e "${BLUE}   Key: ${COOP_BANK_CONSUMER_KEY:0:8}...${NC}"
fi

if [ -z "$COOP_BANK_CONSUMER_SECRET" ]; then
    echo -e "${RED}❌ COOP_BANK_CONSUMER_SECRET is not set${NC}"
    echo -e "${YELLOW}💡 Set it in your .env.local file or server environment${NC}"
else
    echo -e "${GREEN}✅ COOP_BANK_CONSUMER_SECRET is set (${#COOP_BANK_CONSUMER_SECRET} characters)${NC}"
    echo -e "${BLUE}   Secret: ${COOP_BANK_CONSUMER_SECRET:0:8}...${NC}"
fi

# Test Co-op Bank API connectivity
echo -e "${YELLOW}🌐 Testing Co-op Bank API connectivity...${NC}"

# Create Basic Auth credentials
if [ -n "$COOP_BANK_CONSUMER_KEY" ] && [ -n "$COOP_BANK_CONSUMER_SECRET" ]; then
    CREDENTIALS=$(echo -n "${COOP_BANK_CONSUMER_KEY}:${COOP_BANK_CONSUMER_SECRET}" | base64)
    
    echo -e "${BLUE}🔐 Testing token endpoint...${NC}"
    
    # Test the token endpoint
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
    echo -e "${BLUE}📄 Response Body:${NC}"
    echo "${RESPONSE_BODY}" | jq . 2>/dev/null || echo "${RESPONSE_BODY}"
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Co-op Bank API authentication successful!${NC}"
        
        # Extract access token
        ACCESS_TOKEN=$(echo "${RESPONSE_BODY}" | jq -r '.access_token' 2>/dev/null)
        if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
            echo -e "${GREEN}🎫 Access Token: ${ACCESS_TOKEN:0:20}...${NC}"
        fi
    else
        echo -e "${RED}❌ Co-op Bank API authentication failed${NC}"
        echo -e "${YELLOW}🔧 Troubleshooting steps:${NC}"
        echo -e "${YELLOW}   1. Verify your Co-op Bank API credentials${NC}"
        echo -e "${YELLOW}   2. Check if your IP is whitelisted with Co-op Bank${NC}"
        echo -e "${YELLOW}   3. Ensure your account is active for API access${NC}"
        echo -e "${YELLOW}   4. Check if the credentials are for sandbox vs production${NC}"
    fi
else
    echo -e "${RED}❌ Cannot test API - missing credentials${NC}"
fi

# Check PM2 logs for recent errors
echo -e "${YELLOW}📋 Checking PM2 logs for recent errors...${NC}"
pm2 logs floralgifts --lines 10 --err 2>/dev/null || echo -e "${YELLOW}No PM2 logs available${NC}"

echo -e "${GREEN}🔍 Diagnostic completed!${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "${YELLOW}   1. Update your Co-op Bank credentials if needed${NC}"
echo -e "${YELLOW}   2. Restart the application: pm2 restart floralgifts${NC}"
echo -e "${YELLOW}   3. Test STK push payment to verify fix${NC}"
