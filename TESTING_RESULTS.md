# Co-op Bank STK Push - Testing Results

## ✅ Deployment Status: SUCCESS

**Date:** December 11, 2025  
**Server IP:** 157.245.34.218  
**Callback URL:** https://157.245.34.218/api/coopbank/callback

---

## Configuration Summary

### Environment Variables (Configured)
```
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a
COOP_BANK_CALLBACK_URL=https://157.245.34.218/api/coopbank/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
```

### Server Status
- ✅ Application running (PM2)
- ✅ Environment variables loaded
- ✅ Token endpoint working
- ✅ STK Push endpoint working
- ✅ Callback endpoint accessible

---

## Test Results

### Test 1: Token Endpoint ✅
**Status:** PASSED  
**Result:** Successfully obtained access token from Co-op Bank API

### Test 2: STK Push Initiation ✅
**Status:** PASSED  
**Test Phone:** 254743869564  
**Amount:** 1 KES  
**Result:**
```json
{
    "success": true,
    "data": {
        "MessageReference": "FLORAL-1765432547832",
        "MessageDateTime": "2025-12-11T08:12:48",
        "MessageCode": "0",
        "MessageDescription": "REQUEST ACCEPTED FOR PROCESSING"
    }
}
```

**Interpretation:**
- ✅ Request accepted by Co-op Bank
- ✅ M-Pesa prompt should be sent to phone 254743869564
- ⏳ Waiting for user to complete payment on phone
- ⏳ Callback will be received when payment is completed/cancelled

### Test 3: Callback Endpoint ✅
**Status:** PASSED  
**Test:** Manual callback test  
**Result:** Endpoint responding correctly
```json
{"success":true,"message":"Callback received and processed"}
```

---

## Next Steps

### For Testing:
1. **Check Phone (254743869564)**
   - Look for M-Pesa prompt/Push notification
   - Enter PIN if prompt appears
   - Payment will be processed

2. **Monitor Callback**
   - Callback will be sent to: `https://157.245.34.218/api/coopbank/callback`
   - Check server logs: `pm2 logs floralgifts`
   - Verify order status updates in database

3. **Check Payment Status** (Optional)
   ```bash
   curl -X POST https://157.245.34.218/api/coopbank/status \
     -H "Content-Type: application/json" \
     -d '{"MessageReference":"FLORAL-1765432547832","UserID":"FLORALWHISPERS"}'
   ```

### For Production:
1. ✅ Configuration complete
2. ✅ Server IP whitelisted (157.245.34.218)
3. ✅ Callback URL configured
4. ⚠️ Update callback URL to domain when ready: `https://floralwhispersgifts.co.ke/api/coopbank/callback`
5. ⚠️ Test with real payments before going live

---

## Troubleshooting

### If STK Push doesn't work:
1. Check phone number format (must start with 254)
2. Verify Co-op Bank has whitelisted your IP
3. Check server logs: `pm2 logs floralgifts`
4. Verify environment variables are loaded

### If callback is not received:
1. Check server firewall allows port 443
2. Verify SSL certificate is valid
3. Check Nginx configuration
4. Monitor logs: `pm2 logs floralgifts --lines 50`

### If token fails:
1. Verify Consumer Key and Secret are correct
2. Check Co-op Bank API is accessible
3. Verify credentials are not expired

---

## API Endpoints

### Co-op Bank API:
- **Token:** `https://openapi.co-opbank.co.ke/token`
- **STK Push:** `https://openapi.co-opbank.co.ke/FT/stk/1.0.0`
- **Status Check:** `https://openapi.co-opbank.co.ke/Enquiry/STK/1.0.0/`

### Your Server:
- **STK Push:** `https://157.245.34.218/api/coopbank/stkpush`
- **Callback:** `https://157.245.34.218/api/coopbank/callback`
- **Status:** `https://157.245.34.218/api/coopbank/status`

---

## Test Scripts

Run these scripts for testing:

1. **Deploy Configuration:**
   ```bash
   ./scripts/deploy-coopbank.sh
   ```

2. **Test STK Push:**
   ```bash
   ./scripts/test-stk-push.sh
   ```

3. **Manual Test:**
   ```bash
   ssh floral@157.245.34.218
   curl -X POST https://157.245.34.218/api/coopbank/stkpush \
     -H "Content-Type: application/json" \
     -d '{"MobileNumber":"254743869564","Amount":1,"Narration":"Test"}'
   ```

---

**Status:** ✅ Ready for Production Testing

