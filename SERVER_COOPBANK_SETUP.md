# Co-op Bank STK Push Server Configuration

## Server Information

- **IP Address:** 157.245.34.218
- **SSH User:** floral
- **Domain:** floralwhispersgifts.co.ke
- **Callback URL:** https://floralwhispersgifts.co.ke/api/coopbank/callback

## Credentials from Equity Bank (via Co-op Bank API)

These credentials are from the Postman collection provided:

- **Consumer Key:** `gF8Si3TsoRyLl9Pnpv8XYBtn04ca`
- **Consumer Secret:** `ILYevkBdY_gHz0e1FQfzQWZljv4a`
- **Operator Code:** `FLORAL`
- **User ID:** `FLORALWHISPERS`
- **API Base URL:** `https://openapi.co-opbank.co.ke`

## Quick Configuration

### Option 1: Automated Script (Recommended)

Run the configuration script:

```bash
./scripts/configure-coopbank-server.sh
```

This script will:
1. SSH into the server
2. Update environment variables in `.env.local`
3. Restart the application
4. Test the configuration

**Note:** You may need to install `sshpass` first:
```bash
sudo apt-get install sshpass
```

### Option 2: Manual Configuration

SSH into the server and update environment variables:

```bash
ssh floral@157.245.34.218
# Password: Floral@254Floral

cd ~/floralgifts  # or wherever your app is located

# Backup existing .env.local
cp .env.local .env.local.backup

# Add Co-op Bank variables
cat >> .env.local << EOF

# Co-op Bank M-Pesa STK Push Configuration
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a
COOP_BANK_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
EOF

# Restart the application
pm2 restart floralgifts
# or
pm2 restart all
```

## Verify Configuration

### 1. Check Environment Variables

```bash
ssh floral@157.245.34.218
cat .env.local | grep COOP_BANK
```

Should show:
```
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a
COOP_BANK_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
```

### 2. Test Token Endpoint

```bash
curl -X POST https://openapi.co-opbank.co.ke/token \
  -H "Authorization: Basic Z0Y4U2kzVHNvUnlMbDlQbnB2OFhZQnRuMDRjYTpJTFlldmtCZFlfZ0h6MGUxRlFmelFXWmxqdjRh" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

Should return a JSON response with `access_token`.

### 3. Test STK Push Endpoint

```bash
curl -X POST https://floralwhispersgifts.co.ke/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "MobileNumber": "254743869564",
    "Amount": 1,
    "Narration": "Test Payment"
  }'
```

### 4. Test Callback URL

```bash
curl -X POST https://floralwhispersgifts.co.ke/api/coopbank/callback \
  -H "Content-Type: application/json" \
  -d '{"test": "true"}'
```

Should return a response (even if it's an error, it means the endpoint is accessible).

## API Endpoints

### Token Endpoint
- **URL:** `https://openapi.co-opbank.co.ke/token`
- **Method:** POST
- **Auth:** Basic Auth with Consumer Key:Secret

### STK Push Endpoint
- **URL:** `https://openapi.co-opbank.co.ke/FT/stk/1.0.0`
- **Method:** POST
- **Auth:** Bearer Token (from token endpoint)

### Status Check Endpoint
- **URL:** `https://openapi.co-opbank.co.ke/Enquiry/STK/1.0.0/`
- **Method:** POST
- **Auth:** Bearer Token

### Application Endpoints (Your Server)

- **STK Push:** `https://floralwhispersgifts.co.ke/api/coopbank/stkpush`
- **Callback:** `https://floralwhispersgifts.co.ke/api/coopbank/callback`
- **Status Check:** `https://floralwhispersgifts.co.ke/api/coopbank/status`

## Test Phone Number

Use the test phone number provided:
- **Format:** `254743869564`
- **Local format:** `0743869564` (will be converted to 254 format automatically)

## Troubleshooting

### Application Not Restarting

If PM2 is not restarting:

```bash
# Check PM2 status
pm2 list

# Restart manually
pm2 restart floralgifts

# Or restart all
pm2 restart all

# View logs
pm2 logs floralgifts
```

### Environment Variables Not Loading

Make sure:
1. Variables are in `.env.local` (not just `.env`)
2. Application has been restarted after adding variables
3. No typos in variable names (they're case-sensitive)

### Callback Not Receiving

1. Verify callback URL is publicly accessible:
   ```bash
   curl -X POST https://floralwhispersgifts.co.ke/api/coopbank/callback \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

2. Check server logs:
   ```bash
   pm2 logs floralgifts
   # or
   tail -f /var/log/nginx/error.log
   ```

3. Verify firewall allows incoming connections on port 443

4. Check Nginx is configured correctly:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## Next Steps

1. ✅ Configure environment variables on server
2. ✅ Test token endpoint
3. ✅ Test STK push with test phone: 254743869564
4. ✅ Verify callback is received when payment is completed
5. ✅ Test order status updates in database
6. ✅ Update CheckoutForm to use Co-op Bank STK push (if not already done)

## Security Notes

- ✅ Server IP (157.245.34.218) is whitelisted by Equity Bank/Co-op Bank
- ✅ Using HTTPS for callback URL
- ✅ Credentials stored in environment variables (not in code)
- ⚠️ Make sure `.env.local` is not committed to Git (should be in `.gitignore`)

