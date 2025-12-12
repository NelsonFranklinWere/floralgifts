# Co-op Bank STK Push - Ready for Deployment

## ✅ Completed Configuration

All code changes are complete! The Co-op Bank STK Push integration is ready to be deployed to your DigitalOcean server.

### Changes Made:

1. ✅ **Frontend Integration** - CheckoutForm.tsx now uses Co-op Bank STK Push API
2. ✅ **Backend API** - Already implemented at `/api/coopbank/stkpush` and `/api/coopbank/callback`
3. ✅ **Configuration Script** - Created automated deployment script
4. ✅ **Documentation** - Complete setup guide created

## 🚀 Deployment Steps

### Step 1: Update Server Environment Variables

**Option A: Automated (Recommended)**

Run the deployment script:
```bash
cd /home/frank/Documents/Vs\ Code/floralgifts
./scripts/configure-coopbank-server.sh
```

**Option B: Manual SSH**

SSH into your server and add the environment variables:

```bash
ssh floral@157.245.34.218
# Password: Floral@254Floral

cd ~/floralgifts  # Adjust path if different

# Add to .env.local
cat >> .env.local << 'EOF'

# Co-op Bank M-Pesa STK Push Configuration
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a
COOP_BANK_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
EOF

# Restart application
pm2 restart floralgifts
```

### Step 2: Verify Configuration

Test the token endpoint:
```bash
curl -X POST https://openapi.co-opbank.co.ke/token \
  -H "Authorization: Basic Z0Y4U2kzVHNvUnlMbDlQbnB2OFhZQnRuMDRjYTpJTFlldmtCZFlfZ0h6MGUxRlFmelFXWmxqdjRh" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

### Step 3: Test STK Push

Test with the provided test phone number:
```bash
curl -X POST https://floralwhispersgifts.co.ke/api/coopbank/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "MobileNumber": "254743869564",
    "Amount": 1,
    "Narration": "Test Payment"
  }'
```

### Step 4: Verify Callback URL

Test that the callback endpoint is accessible:
```bash
curl -X POST https://floralwhispersgifts.co.ke/api/coopbank/callback \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 📋 Server Details

- **IP Address:** 157.245.34.218 (Whitelisted by Equity Bank)
- **Domain:** floralwhispersgifts.co.ke
- **SSH:** floral@157.245.34.218
- **Password:** Floral@254Floral

## 🔑 Credentials

From Postman collection:
- **Consumer Key:** `gF8Si3TsoRyLl9Pnpv8XYBtn04ca`
- **Consumer Secret:** `ILYevkBdY_gHz0e1FQfzQWZljv4a`
- **Operator Code:** `FLORAL`
- **User ID:** `FLORALWHISPERS`

## 📱 Test Phone Number

- **Local Format:** 0743869564
- **International Format:** 254743869564
- **Use this number to test STK push payments**

## 🔗 API Endpoints

### Co-op Bank API:
- **Token:** `https://openapi.co-opbank.co.ke/token`
- **STK Push:** `https://openapi.co-opbank.co.ke/FT/stk/1.0.0`
- **Status Check:** `https://openapi.co-opbank.co.ke/Enquiry/STK/1.0.0/`

### Your Server Endpoints:
- **STK Push:** `https://floralwhispersgifts.co.ke/api/coopbank/stkpush`
- **Callback:** `https://floralwhispersgifts.co.ke/api/coopbank/callback`
- **Status:** `https://floralwhispersgifts.co.ke/api/coopbank/status`

## 📝 How It Works

1. Customer selects "M-Pesa STK Push" on checkout
2. Enters their phone number (or uses contact phone)
3. Clicks "Place Order"
4. Order is created in database
5. STK Push request is sent to Co-op Bank API
6. Customer receives M-Pesa prompt on their phone
7. Customer enters PIN and confirms payment
8. Co-op Bank sends callback to your server
9. Order status is updated to "paid"
10. Customer is redirected to success page (with status polling)

## ⚠️ Important Notes

1. **Callback URL:** Must be publicly accessible via HTTPS
2. **Server IP:** 157.245.34.218 is whitelisted by Equity Bank
3. **Domain:** Use `floralwhispersgifts.co.ke` for production callbacks
4. **SSL:** Make sure SSL certificate is valid (Let's Encrypt recommended)

## 🐛 Troubleshooting

### If STK Push fails:

1. Check environment variables are set:
   ```bash
   ssh floral@157.245.34.218
   cat .env.local | grep COOP_BANK
   ```

2. Check application logs:
   ```bash
   pm2 logs floralgifts
   ```

3. Test token endpoint manually (should return access_token)

4. Verify callback URL is accessible from internet

### If callback is not received:

1. Check server firewall allows port 443
2. Verify Nginx is configured correctly
3. Check application is running: `pm2 status`
4. Test callback endpoint manually with curl

## ✅ Checklist

- [ ] Environment variables added to server `.env.local`
- [ ] Application restarted (PM2)
- [ ] Token endpoint tested successfully
- [ ] STK Push endpoint tested with test phone
- [ ] Callback URL verified accessible
- [ ] Test payment completed successfully
- [ ] Order status updates correctly in database

## 📞 Support

For issues:
1. Check `SERVER_COOPBANK_SETUP.md` for detailed instructions
2. Review server logs: `pm2 logs floralgifts`
3. Test endpoints manually with curl
4. Verify environment variables are correct

---

**Ready to deploy!** Just run the configuration script or manually add the environment variables to your server.

