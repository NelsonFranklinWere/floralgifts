# Co-op Bank API Testing Guide

## Overview
This guide explains how to test the Co-op Bank STK Push API endpoints from your server (IP: `157.245.34.218`).

## Prerequisites

1. **Environment Variables Setup**
   Add these to your `.env.local` file:
   ```env
   COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
   COOP_BANK_CONSUMER_SECRET=your_consumer_secret_here
   COOP_BANK_CALLBACK_URL=https://157.245.34.218/api/coopbank/callback
   COOP_BANK_OPERATOR_CODE=FLORAL
   COOP_BANK_USER_ID=FLORALWHISPERS
   ```

2. **Server IP Whitelisted**
   - Your server IP `157.245.34.218` must be whitelisted in Co-op Bank's system
   - All API calls will originate from this IP

## API Endpoints Created

### 1. **Get Token** 
**Endpoint:** `POST /api/coopbank/token`

**Description:** Retrieves OAuth token from Co-op Bank (automatically cached)

**Request:**
```bash
curl -X POST http://157.245.34.218/api/coopbank/token
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJ4NXQiOiJOekUxTUdaaVpHTTVaRGd4TURWbE1qRmtObVZoT0dVMU9XVXpZVEJrWlRrMk5UWXpOVFEwT1RNME5EaGlNREU0WkRrM1lUaGhZekl4WmpnNVptUTNPUSIsImtpZCI6Ik56RTFNR1ppWkdNNVpEZ3hNRFZsTWpGa05tVmhPR1UxT1dVellUQmtaVGsyTlRZek5UUTBPVE0wTkRoaU1ERTRaRGszWVRoaFl6SXhaamc1Wm1RM09RX1JTMjU2IiwiYWxnIjoiUlMyNTYifQ...",
  "message": "Token retrieved successfully"
}
```

---

### 2. **STK Push**
**Endpoint:** `POST /api/coopbank/stkpush`

**Description:** Initiates STK Push payment request

**Request:**
```bash
curl -X POST http://157.245.34.218/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "MessageReference": "9071eqeaae9d5d",
    "CallBackUrl": "https://157.245.34.218/api/coopbank/callback",
    "OperatorCode": "FLORAL",
    "TransactionCurrency": "KES",
    "MobileNumber": "254707919065",
    "Narration": "Test FLORAL WHISPERS GIFTS",
    "Amount": 2,
    "MessageDateTime": "2025-11-26T09:22:25.420Z",
    "OtherDetails": [
      {
        "Name": "Floral Tests",
        "Value": "Coop_Tests"
      }
    ]
  }'
```

**Minimal Request (auto-generates missing fields):**
```json
{
  "MobileNumber": "254707919065",
  "Amount": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "MessageReference": "9071eqeaae9d5d",
    "ResponseCode": "0",
    "ResponseDescription": "Success",
    "RequestID": "12345-67890-12345"
  }
}
```

---

### 3. **Check Transaction Status**
**Endpoint:** `POST /api/coopbank/status`

**Description:** Checks the status of an STK Push transaction

**Request:**
```bash
curl -X POST http://157.245.34.218/api/coopbank/status \
  -H "Content-Type: application/json" \
  -d '{
    "MessageReference": "9071eqeaae9d5d",
    "UserID": "FLORALWHISPERS"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "MessageReference": "9071eqeaae9d5d",
    "ResponseCode": "0",
    "ResponseDescription": "Success",
    "TransactionStatus": "Completed"
  }
}
```

---

### 4. **Callback Endpoint**
**Endpoint:** `POST /api/coopbank/callback`

**Description:** Receives payment confirmation callbacks from Co-op Bank

**Note:** This endpoint is called by Co-op Bank servers, not directly by you.

**Callback URL:** `https://157.245.34.218/api/coopbank/callback`

---

## Testing with Postman

### Step 1: Import Collection
1. Open Postman
2. Create a new collection: "Co-op Bank API Tests"
3. Set collection variable: `base_url` = `http://157.245.34.218`

### Step 2: Test Token Endpoint
1. Create new request: **GET Token**
2. Method: `POST`
3. URL: `{{base_url}}/api/coopbank/token`
4. Click **Send**
5. Copy the `access_token` from response (if needed for manual testing)

### Step 3: Test STK Push
1. Create new request: **STK Push**
2. Method: `POST`
3. URL: `{{base_url}}/api/coopbank/stkpush`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "MessageReference": "TEST-001",
  "CallBackUrl": "https://157.245.34.218/api/coopbank/callback",
  "OperatorCode": "FLORAL",
  "TransactionCurrency": "KES",
  "MobileNumber": "254707919065",
  "Narration": "Test FLORAL WHISPERS GIFTS",
  "Amount": 10,
  "MessageDateTime": "2025-01-27T12:00:00.000Z",
  "OtherDetails": [
    {
      "Name": "OrderID",
      "Value": "ORDER-123"
    }
  ]
}
```
6. Click **Send**
7. Check response for `MessageReference` (save it for status check)

### Step 4: Test Status Check
1. Create new request: **Check Status**
2. Method: `POST`
3. URL: `{{base_url}}/api/coopbank/status`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "MessageReference": "TEST-001",
  "UserID": "FLORALWHISPERS"
}
```
6. Click **Send**
7. Check transaction status in response

---

## Testing Flow

### Complete Test Flow:
1. **Get Token** → Verify token is retrieved
2. **STK Push** → Initiate payment (customer receives prompt on phone)
3. **Customer completes payment** on their phone
4. **Co-op Bank sends callback** → Check server logs at `/api/coopbank/callback`
5. **Check Status** → Verify transaction status using `MessageReference`

---

## Server-Side Testing Benefits

✅ **IP Whitelisting:** All requests come from whitelisted server IP (`157.245.34.218`)  
✅ **No Device IP Issues:** No need to whitelist your local machine  
✅ **Production-Like:** Tests run in same environment as production  
✅ **Logging:** All requests/responses logged on server  
✅ **Secure:** Credentials never exposed to client  

---

## Troubleshooting

### Error: "COOP_BANK_CONSUMER_KEY and COOP_BANK_CONSUMER_SECRET must be configured"
- **Solution:** Add environment variables to `.env.local` and restart server

### Error: "CallBackUrl not provided and COOP_BANK_CALLBACK_URL not configured"
- **Solution:** Either provide `CallBackUrl` in request body or set `COOP_BANK_CALLBACK_URL` in `.env.local`

### Error: "Failed to fetch Co-op Bank token"
- **Solution:** 
  - Verify `COOP_BANK_CONSUMER_KEY` and `COOP_BANK_CONSUMER_SECRET` are correct
  - Check server can reach `https://openapi.co-opbank.co.ke`
  - Verify server IP is whitelisted

### Error: "Co-op Bank STK Push failed"
- **Solution:**
  - Check phone number format (must start with `254`)
  - Verify amount is valid (positive number)
  - Check server logs for detailed error message
  - Ensure callback URL is accessible from Co-op Bank servers

---

## Next Steps

1. ✅ **Set Environment Variables** - Add Co-op Bank credentials to `.env.local`
2. ✅ **Restart Server** - Restart Next.js server to load new environment variables
3. ✅ **Test Token Endpoint** - Verify token retrieval works
4. ✅ **Test STK Push** - Initiate a test payment
5. ✅ **Monitor Callbacks** - Check server logs for callback responses
6. ✅ **Integrate with Checkout** - Connect STK Push to your checkout flow

---

## Integration with Checkout

Once testing is successful, you can integrate Co-op Bank STK Push into your checkout flow by:

1. Updating `app/checkout/page.tsx` to use Co-op Bank API
2. Modifying `components/CheckoutForm.tsx` to call `/api/coopbank/stkpush`
3. Handling callbacks to update order status in database
4. Sending confirmation emails/SMS on successful payment

---

## Support

For issues:
- Check server logs: `pm2 logs floralgifts` (if using PM2)
- Check Next.js logs: `npm run dev` output
- Verify environment variables are set correctly
- Test endpoints individually to isolate issues

