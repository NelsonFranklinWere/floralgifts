#!/bin/bash

# Co-op Bank IP Whitelist Request Template
# This script generates the information you need to request IP whitelisting

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌐 Co-op Bank IP Whitelist Request Generator${NC}"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
echo -e "${BLUE}📍 Your Server IP: ${SERVER_IP}${NC}"

# Generate whitelist request template
echo -e "${YELLOW}📧 Email Template for Co-op Bank Support:${NC}"
echo ""

cat << EOF
Subject: IP Whitelist Request - Floral Whispers Gifts API Integration

Dear Co-op Bank API Support Team,

We are integrating our e-commerce platform "Floral Whispers Gifts" with the Co-op Bank Open API for STK Push payments.

We need our server IP address to be whitelisted for API access.

**Technical Details:**
- Company Name: Floral Whispers Gifts
- Application: E-commerce Payment Integration
- Server IP Address: ${SERVER_IP}
- API Endpoints Required: 
  * https://openapi.co-opbank.co.ke/token
  * https://openapi.co-opbank.co.ke/FT/stk/1.0.0
  * https://openapi.co-opbank.co.ke/Enquiry/STK/1.0.0/

**Current Issue:**
We are receiving "Request Rejected" responses when trying to access the API, indicating our IP is not whitelisted.

**Request:**
Please add our server IP (${SERVER_IP}) to the whitelist for API access.

**Contact Information:**
- Technical Contact: [Your Name/Email]
- Phone: [Your Phone Number]
- Application URL: https://floralwhispersgifts.co.ke

Thank you for your assistance.

Best regards,
Floral Whispers Gifts Team
EOF

echo ""
echo -e "${YELLOW}📋 Additional Information to Include:${NC}"
echo -e "${BLUE}   • Your Co-op Bank Account Number${NC}"
echo -e "${BLUE}   • API Application ID (if you have one)${NC}"
echo -e "${BLUE}   • Your developer portal credentials${NC}"
echo -e "${BLUE}   • Business registration documents (if required)${NC}"

echo ""
echo -e "${YELLOW}📞 Co-op Bank Support Contacts:${NC}"
echo -e "${BLUE}   • Email: apisupport@co-opbank.co.ke${NC}"
echo -e "${BLUE}   • Phone: +254 020 2770000${NC}"
echo -e "${BLUE}   • API Portal: https://openapi.co-opbank.co.ke${NC}"

echo ""
echo -e "${GREEN}🔧 Alternative Solutions:${NC}"
echo -e "${YELLOW}   1. Use a proxy server with a whitelisted IP${NC}"
echo -e "${YELLOW}   2. Contact your hosting provider for IP whitelisting assistance${NC}"
echo -e "${YELLOW}   3. Use Co-op Bank sandbox environment for testing${NC}"

echo ""
echo -e "${GREEN}✅ Whitelist request template generated!${NC}"
echo -e "${YELLOW}💡 Copy the email template above and send it to Co-op Bank support${NC}"
