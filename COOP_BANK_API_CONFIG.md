# Co-op Bank M-Pesa STK Push API Configuration

## Server Information for Co-op Bank

### Test Environment (Sandbox)

**Server IP Address:**
```
157.245.34.218
```

**Test Callback URL:**
```
https://157.245.34.218/api/mpesa/callback
```

**Port:**
```
443 (HTTPS)
```

**Note:** Currently using self-signed SSL certificate. For production, a valid SSL certificate from Let's Encrypt will be configured once domain DNS is set up.

**Endpoint Details:**
- **Method:** POST
- **Path:** `/api/mpesa/callback`
- **Content-Type:** application/json
- **Full URL:** `http://157.245.34.218/api/mpesa/callback`

---

### Production Environment

**Production Domain:**
```
whispersfloralgifts.co.ke
```

**Production Callback URL:**
```
https://whispersfloralgifts.co.ke/api/mpesa/callback
```

**Port:**
```
443 (HTTPS)
```

**Endpoint Details:**
- **Method:** POST
- **Path:** `/api/mpesa/callback`
- **Content-Type:** application/json
- **Full URL:** `https://whispersfloralgifts.co.ke/api/mpesa/callback`

---

## Business Information

**Business Shortcode (PayBill):**
```
400200
```

**Account Number:**
```
4004055549
```

**Business Name:**
```
Floral Whispers Gifts
```

---

## API Endpoints

### 1. STK Push Initiation
- **URL:** `http://157.245.34.218/api/mpesa/stkpush` (Test)
- **URL:** `https://whispersfloralgifts.co.ke/api/mpesa/stkpush` (Production)
- **Method:** POST
- **Purpose:** Initiates M-Pesa STK Push payment request

### 2. Callback Endpoint (Receives Payment Confirmation)
- **URL:** `http://157.245.34.218/api/mpesa/callback` (Test)
- **URL:** `https://whispersfloralgifts.co.ke/api/mpesa/callback` (Production)
- **Method:** POST
- **Purpose:** Receives payment confirmation from M-Pesa/Co-op Bank

---

## Network Configuration

**Server Details:**
- **IP Address:** 157.245.34.218
- **Hosting:** Digital Ocean
- **Web Server:** Nginx (reverse proxy)
- **Application Server:** Next.js on port 3000
- **Process Manager:** PM2

**Ports:**
- **HTTP:** 80 (redirects to HTTPS)
- **HTTPS:** 443 (SSL configured - self-signed for testing, will upgrade to Let's Encrypt)
- **Application:** 3000 (internal, not exposed)

---

## Callback URL Requirements

✅ **Callback URL must be:**
- Publicly accessible from the internet
- Accept POST requests
- Return HTTP 200 status on success
- Handle JSON payloads

✅ **Callback Payload Format:**
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "string",
      "CheckoutRequestID": "string",
      "ResultCode": 0,
      "ResultDesc": "string",
      "CallbackMetadata": {
        "Item": [
          {
            "Name": "Amount",
            "Value": 100
          },
          {
            "Name": "MpesaReceiptNumber",
            "Value": "string"
          },
          {
            "Name": "TransactionDate",
            "Value": 20250127120000
          },
          {
            "Name": "PhoneNumber",
            "Value": 254712345678
          }
        ]
      }
    }
  }
}
```

---

## Testing Information

**Test Phone Numbers:**
- Format: Must start with `254` (e.g., `254712345678`)
- Use any valid Kenyan mobile number for testing

**Test Amounts:**
- Any amount can be used for testing
- Sandbox environment doesn't charge real money

---

## Security Notes

⚠️ **Important:**
- Callback URL must be accessible from Co-op Bank/M-Pesa servers
- Server firewall must allow incoming connections on port 80/443
- HTTPS is recommended for production (requires SSL certificate)
- Callback endpoint validates and processes payment confirmations securely

---

## Contact Information

**For Co-op Bank API Team:**

Please configure the following:

1. **Test Environment:**
   - IP: `157.245.34.218`
   - Callback URL: `http://157.245.34.218/api/mpesa/callback`
   - Port: `80`

2. **Production Environment:**
   - Domain: `whispersfloralgifts.co.ke`
   - Callback URL: `https://whispersfloralgifts.co.ke/api/mpesa/callback`
   - Port: `443`

3. **Business Details:**
   - Shortcode: `400200`
   - Account Number: `4004055549`
   - Business Name: `Floral Whispers Gifts`

---

## Verification Steps

After Co-op Bank configures the callback:

1. ✅ Test callback URL is accessible: `curl -X POST http://157.245.34.218/api/mpesa/callback`
2. ✅ Verify server responds with HTTP 200
3. ✅ Test STK Push initiation
4. ✅ Verify callback is received and processed
5. ✅ Check order status updates in database

---

## Support

For technical issues:
- Check server logs: `pm2 logs floralgifts`
- Verify Nginx is running: `systemctl status nginx`
- Test callback endpoint manually
- Check firewall rules allow port 80/443

