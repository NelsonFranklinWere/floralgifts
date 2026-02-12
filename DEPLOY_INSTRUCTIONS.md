# Deployment Instructions for STK Push Fix

## Files Changed
1. `components/CheckoutForm.tsx` - Updated to use Co-op Bank STK push
2. `app/checkout/page.tsx` - Updated to use Co-op Bank STK push
3. `app/api/coopbank/stkpush/route.ts` - Changed callback URL to use M-Pesa callback
4. `app/api/mpesa/callback/route.ts` - Updated to handle Co-op Bank callbacks

## Manual Deployment Steps

### Option 1: Using Git (Recommended)
```bash
# On your local machine
git add .
git commit -m "Fix STK push to use Co-op Bank API directly with M-Pesa callback"
git push origin main

# On the server
ssh floral@157.245.34.218
cd /home/floral/floralgifts
git pull origin main
pm2 restart floralgifts
pm2 save
```

### Option 2: Using SCP
```bash
# Copy files to server
scp components/CheckoutForm.tsx floral@157.245.34.218:/home/floral/floralgifts/components/
scp app/checkout/page.tsx floral@157.245.34.218:/home/floral/floralgifts/app/checkout/
scp app/api/coopbank/stkpush/route.ts floral@157.245.34.218:/home/floral/floralgifts/app/api/coopbank/stkpush/
scp app/api/mpesa/callback/route.ts floral@157.245.34.218:/home/floral/floralgifts/app/api/mpesa/callback/

# Restart application
ssh floral@157.245.34.218
cd /home/floral/floralgifts
pm2 restart floralgifts
pm2 save
```

### Option 3: Using the deployment script
```bash
chmod +x deploy-stk-fix.sh
./deploy-stk-fix.sh
```

## Verify Environment Variables

Ensure these are set in `/home/floral/floralgifts/.env.local`:

```bash
COOP_BANK_CONSUMER_KEY=gF8Si3TsoRyLl9Pnpv8XYBtn04ca
COOP_BANK_CONSUMER_SECRET=ILYevkBdY_gHz0e1FQfzQWZljv4a
MPESA_CALLBACK_URL=https://floralwhispersgifts.co.ke/api/mpesa/callback
COOP_BANK_OPERATOR_CODE=FLORAL
COOP_BANK_USER_ID=FLORALWHISPERS
```

## Test After Deployment

```bash
./test-stk-payment.sh 254743869564 100
```

## What Changed

1. **STK Push Payment Flow**: Now uses Co-op Bank API directly instead of redirecting through Pesapal
2. **Callback URL**: Changed from `/api/coopbank/callback` to `/api/mpesa/callback`
3. **Callback Handler**: M-Pesa callback now handles both direct M-Pesa and Co-op Bank STK push callbacks
