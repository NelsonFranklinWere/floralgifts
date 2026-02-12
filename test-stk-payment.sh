#!/bin/bash

# Test Co-op Bank STK Push Payment
# Usage: ./test-stk-payment.sh [phone] [amount_in_kes]

PHONE="${1:-254743869564}"
AMOUNT_KES="${2:-100}"
AMOUNT_CENTS=$((AMOUNT_KES * 100))
BASE_URL="https://floralwhispersgifts.co.ke"

echo "=========================================="
echo "Testing Co-op Bank STK Push Payment"
echo "=========================================="
echo "Phone: $PHONE"
echo "Amount: $AMOUNT_CENTS cents ($AMOUNT_KES KES)"
echo "Endpoint: $BASE_URL/api/coopbank/stkpush"
echo "Callback URL: $BASE_URL/api/mpesa/callback"
echo ""

echo "Sending STK Push request..."
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/api/coopbank/stkpush" \
  -H "Content-Type: application/json" \
  -d "{
    \"MobileNumber\": \"$PHONE\",
    \"Amount\": $AMOUNT_CENTS,
    \"Narration\": \"Test STK Push - $AMOUNT_KES KES\"
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
    echo "📱 Check your phone ($PHONE) for M-Pesa payment prompt!"
    echo "   Enter your M-Pesa PIN to complete the payment."
    echo ""
    echo "The callback will be sent to: $BASE_URL/api/mpesa/callback"
elif echo "$RESPONSE" | grep -q "invalid_client\|Authentication failed"; then
    echo "❌ Authentication Error"
    echo ""
    echo "Co-op Bank credentials need to be configured on the production server."
    echo "Please ensure these environment variables are set:"
    echo "  - COOP_BANK_CONSUMER_KEY"
    echo "  - COOP_BANK_CONSUMER_SECRET"
    echo "  - MPESA_CALLBACK_URL"
else
    echo "❌ STK Push failed"
    echo "Check the response above for error details"
fi

echo "=========================================="
