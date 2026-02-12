#!/bin/bash

# Test Co-op Bank STK Push on production server
# Usage: ./test-stk-local.sh

PHONE="254743869564"
AMOUNT=10000  # 100 KES in cents
BASE_URL="https://floralwhispersgifts.co.ke"

echo "=========================================="
echo "Testing Co-op Bank STK Push"
echo "=========================================="
echo "Phone: $PHONE"
echo "Amount: $AMOUNT cents (100 KES)"
echo "Endpoint: $BASE_URL/api/coopbank/stkpush"
echo ""

# Check if server is running
if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo "❌ Server is not running on $BASE_URL"
    echo "Please start the server with: npm run dev"
    exit 1
fi

echo "✅ Server is running"
echo ""
echo "Sending STK Push request..."
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/api/coopbank/stkpush" \
  -H "Content-Type: application/json" \
  -d "{
    \"MobileNumber\": \"$PHONE\",
    \"Amount\": $AMOUNT,
    \"Narration\": \"Test STK Push - 100 KES\"
  }")

echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

echo ""
echo "=========================================="

if echo "$RESPONSE" | grep -q "success.*true\|ResponseCode.*00"; then
    echo "✅ STK Push initiated successfully!"
    MESSAGE_REF=$(echo "$RESPONSE" | grep -o '"MessageReference":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$MESSAGE_REF" ]; then
        echo "Message Reference: $MESSAGE_REF"
    fi
    echo ""
    echo "Check your phone ($PHONE) for M-Pesa payment prompt!"
else
    echo "❌ STK Push failed"
    echo "Check the response above for error details"
fi

echo "=========================================="
