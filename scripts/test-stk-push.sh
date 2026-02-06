#!/bin/bash

# Test STK Push on Server
# Run this script to test Co-op Bank STK Push integration

SERVER_IP="157.245.34.218"
SERVER_USER="floral"
SERVER_PASSWORD="Floral@254Floral"
TEST_PHONE="254743869564"

echo "=========================================="
echo "Co-op Bank STK Push Test"
echo "=========================================="
echo "Test Phone: $TEST_PHONE"
echo "Amount: 1 KES"
echo ""

# Test 1: Verify token can be obtained
echo "1. Testing Co-op Bank Token Endpoint..."
TOKEN_RESPONSE=$(sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
    "curl -s -X POST https://openapi.co-opbank.co.ke/token \
    -H 'Authorization: Basic Z0Y4U2kzVHNvUnlMbDlQbnB2OFhZQnRuMDRjYTpJTFlldmtCZFlfZ0h6MGUxRlFmelFXWmxqdjRh' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'grant_type=client_credentials'")

if echo "$TOKEN_RESPONSE" | grep -q "access_token"; then
    echo "   ✓ Token obtained successfully"
    TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:50}..."
else
    echo "   ✗ Token request failed"
    echo "   Response: $TOKEN_RESPONSE"
    exit 1
fi

echo ""
echo "2. Testing STK Push via Server API..."
STK_RESPONSE=$(sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
    "curl -s -k -X POST https://157.245.34.218/api/coopbank/stkpush \
    -H 'Content-Type: application/json' \
    -d '{
      \"MobileNumber\": \"$TEST_PHONE\",
      \"Amount\": 1,
      \"Narration\": \"Test STK Push\"
    }'")

echo "$STK_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STK_RESPONSE"

if echo "$STK_RESPONSE" | grep -q "success.*true\|MessageReference\|ResponseCode.*00"; then
    echo ""
    echo "   ✓ STK Push initiated successfully!"
    MESSAGE_REF=$(echo "$STK_RESPONSE" | grep -o '"MessageReference":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$MESSAGE_REF" ]; then
        echo "   Message Reference: $MESSAGE_REF"
    fi
else
    echo ""
    echo "   ⚠ STK Push response needs review"
    echo "   Check the response above for details"
fi

echo ""
echo "3. Checking application logs..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
    "pm2 logs floralgifts --lines 10 --nostream 2>&1 | grep -i 'stk\|coop\|error' | tail -10 || echo 'No relevant logs found'"

echo ""
echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo ""
echo "If STK Push was successful:"
echo "- Check your phone ($TEST_PHONE) for M-Pesa prompt"
echo "- Enter your PIN to complete payment"
echo "- Callback will be sent to: https://157.245.34.218/api/coopbank/callback"
echo ""

