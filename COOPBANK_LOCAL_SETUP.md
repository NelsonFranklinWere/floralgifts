# Co-op Bank Local Development Guide

## 🏠 Local Environment Setup

### 1. Run the Setup Script
```bash
cd /Users/airm1/Projects/floralgifts
chmod +x setup-local-coopbank.sh
./setup-local-coopbank.sh
```

### 2. Manual Setup (Alternative)

Create or update your `.env.local` file:

```bash
# Co-op Bank Configuration
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=your_consumer_secret_here
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS

# Local Development URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
COOP_BANK_CALLBACK_URL=http://localhost:3000/api/coopbank/callback
```

## 🔧 Where to Find Your Consumer Secret

### Co-op Bank Developer Portal:
1. Go to [https://openapi.co-opbank.co.ke](https://openapi.co-opbank.co.ke)
2. Log in with your credentials
3. Navigate to "Applications" or "API Keys"
4. Find your application for "Floral Whispers Gifts"
5. Copy the "Consumer Secret"

### What the Consumer Secret Looks Like:
- **Format**: Long alphanumeric string
- **Length**: Usually 20-40 characters
- **Example**: `aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890`

## 🌐 Local vs Production URLs

### Local Development:
- **Base URL**: `http://localhost:3000`
- **Callback URL**: `http://localhost:3000/api/coopbank/callback`

### Production:
- **Base URL**: `https://floralwhispersgifts.co.ke`
- **Callback URL**: `https://floralwhispersgifts.co.ke/api/coopbank/callback`

## 🧪 Testing Locally

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test STK Push Payment
1. Go to `http://localhost:3000/checkout`
2. Select "M-Pesa (Co-op Bank STK Push)"
3. Enter phone number and complete checkout
4. Check browser console for debugging

### 3. Monitor API Calls
Open browser dev tools → Network tab → Filter for "coopbank"

## 🚨 Common Local Issues

### 1. IP Blocking
If you get "Request Rejected":
- Your local IP may not be whitelisted
- Contact Co-op Bank support to whitelist your IP
- Or test from the server environment

### 2. Callback URL Issues
- Ensure Co-op Bank portal has correct callback URL
- For local: `http://localhost:3000/api/coopbank/callback`
- For production: `https://floralwhispersgifts.co.ke/api/coopbank/callback`

### 3. Invalid Credentials
- Double-check Consumer Secret for typos
- Ensure no extra spaces or characters
- Verify Consumer Key matches exactly

## 📱 Testing STK Push Flow

### Expected Flow:
1. User selects "M-Pesa (Co-op Bank STK Push)"
2. API call to `/api/coopbank/stkpush`
3. Co-op Bank sends STK prompt to user's phone
4. User enters PIN to complete payment
5. Co-op Bank sends callback to your local server
6. Order status updates to "paid"
7. User redirected to WhatsApp

### Debugging Steps:
1. Check browser console for errors
2. Monitor network requests in dev tools
3. Check local server logs
4. Verify callback endpoint receives requests

## 🔍 Debug Commands

### Test API Connection:
```bash
# Test token endpoint
curl -X POST "https://openapi.co-opbank.co.ke/token" \
  -H "Authorization: Basic $(echo -n "gF8Si3TsoRyLl9Pnpv8XYBtn04ca:YOUR_SECRET" | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

### Check Environment Variables:
```bash
# Verify .env.local file
cat .env.local | grep COOP_BANK
```

### Test Local Callback:
```bash
# Test if callback endpoint is accessible
curl http://localhost:3000/api/coopbank/callback
```

## 📞 Co-op Bank Support

If you encounter issues:
- **Email**: apisupport@co-opbank.co.ke
- **Phone**: +254 020 2770000
- **Portal**: https://openapi.co-opbank.co.ke

### What to Request:
1. IP whitelisting for your local/public IP
2. Callback URL configuration verification
3. API account status confirmation

## ✅ Success Indicators

When properly configured:
- ✅ Token request returns 200 status
- ✅ Access token generated successfully
- ✅ STK push initiates without errors
- ✅ User receives M-Pesa prompt
- ✅ Callbacks are received locally
- ✅ Order status updates correctly

## 🔄 Next Steps

After local testing works:
1. Deploy to production server
2. Update production environment variables
3. Test production STK push flow
4. Monitor payment success rates
5. Set up payment monitoring
