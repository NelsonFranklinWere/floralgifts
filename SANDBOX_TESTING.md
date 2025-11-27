# M-Pesa Sandbox Testing Guide

## Current Sandbox Credentials

Your sandbox credentials are configured in `.env.local`:

```env
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=gQE0zykwt3dXyXGemkfSdAGS1G6qGjGxjF5bwCBdGAsSHf0S
MPESA_CONSUMER_SECRET=Hy6TP0ln3i4HoeH84OzVBvtmnRU9bSu0hpfXKQTITXn4uWOvjkL5fTPPkdyLMyMe
MPESA_SHORTCODE=174379
MPESA_PASSKEY=YOUR_PASSKEY_HERE  # Get from Safaricom Developer Portal
MPESA_CALLBACK_URL=http://localhost:3000/api/mpesa/callback
```
# ============================================
# FLORAL WHISPERS GIFTS - API KEYS & SECRETS
# Store all sensitive credentials here
# IMPORTANT: Never commit this file to git!
# ============================================

# ============================================
# SUPABASE CONFIGURATION
# ============================================
SUPABASE_PROJECT_ID=sdculxvqvixpiairzukl
SUPABASE_PROJECT_URL=https://sdculxvqvixpiairzukl.supabase.co
SUPABASE_PUBLIC_KEY=sb_publishable_y5hnG3xeKqIOUQ7podcQYA_RV2xUHtQ
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkY3VseHZxdml4cGlhaXJ6dWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTg4NTUsImV4cCI6MjA3ODk5NDg1NX0.8c2ATXh6692Z3mTG7dsWwivB5uIasrtJeGfj9OLgf98
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkY3VseHZxdml4cGlhaXJ6dWtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQxODg1NSwiZXhwIjoyMDc4OTk0ODU1fQ.41RcYn4J5jxjlC9TRltgWgX7ZaH23h7ehGCu9knLa2g

# ============================================
# M-PESA CONFIGURATION
# ============================================
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=gQE0zykwt3dXyXGemkfSdAGS1G6qGjGxjF5bwCBdGAsSHf0S
MPESA_CONSUMER_SECRET=Hy6TP0ln3i4HoeH84OzVBvtmnRU9bSu0hpfXKQTITXn4uWOvjkL5fTPPkdyLMyMe
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_from_safaricom_portal
MPESA_CALLBACK_URL=http://localhost:3000/api/mpesa/callback

# ============================================
# ADMIN AUTHENTICATION
# ============================================
JWT_SECRET=your-secret-key-change-in-production-use-strong-random-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# ============================================
# EMAIL CONFIGURATION (Resend)
# ============================================
RESEND_API_KEY=re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR
RESEND_FROM_EMAIL=onboarding@resend.dev

# ============================================
# GOOGLE VERIFICATION (Optional)
# ============================================
GOOGLE_VERIFICATION=

# ============================================
# BASE URL
# ============================================
BASE_URL=https://whispersfloralgifts.co.ke


## Getting Your Passkey

1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Log in to your account
3. Navigate to your app
4. Go to **STK Push** section
5. Copy the **Passkey** value
6. Add it to `.env.local`:
   ```env
   MPESA_PASSKEY=your_passkey_from_portal
   ```

## Testing STK Push

### 1. Start Your Development Server

```bash
npm run dev
```

### 2. Set Up ngrok (for Callback URL)

For local testing, M-Pesa needs a publicly accessible callback URL:

```bash
# Install ngrok if you haven't
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and update `.env.local`:

```env
MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/mpesa/callback
```

### 3. Test Phone Numbers

Use any phone number starting with `2547` for testing:
- `254712345678`
- `254798765432`
- Any valid Kenyan format starting with `2547`

### 4. Test Payment Flow

1. Add products to cart
2. Go to checkout
3. Fill in the form
4. Select "Pay with M-Pesa"
5. Enter a test phone number (format: `254712345678`)
6. Click "Proceed to Pay"
7. You should receive an STK Push prompt on the test phone
8. Enter PIN `0000` (sandbox test PIN)
9. Payment should complete successfully

## Verifying Token Generation

The auth token should be generated successfully. You can test it by:

1. Check server logs when making a payment
2. Look for successful token generation
3. If token fails, check:
   - Consumer Key and Secret are correct
   - No extra spaces in `.env.local`
   - Server has been restarted after updating `.env.local`

## Expected Response

When STK Push is initiated successfully, you should see:

```json
{
  "ResponseCode": "0",
  "CustomerMessage": "Success. Request accepted for processing",
  "CheckoutRequestID": "...",
  "MerchantRequestID": "..."
}
```

## Troubleshooting

### "Failed to fetch MPESA token"
- Check Consumer Key and Secret are correct
- Verify no extra spaces in `.env.local`
- Restart development server after updating credentials

### "STK Push failed"
- Check Passkey is set correctly
- Verify shortcode is `174379` for sandbox
- Ensure callback URL is publicly accessible (use ngrok)

### Callback not received
- Verify ngrok is running
- Check callback URL in `.env.local` matches ngrok URL
- Ensure callback URL is registered in Safaricom Developer Portal

## Next Steps

Once sandbox testing is successful:
1. Apply for Online PayBill with Safaricom
2. Get production credentials
3. Update `.env.local` with production values:
   - `MPESA_ENV=production`
   - Production Consumer Key and Secret
   - Your actual PayBill number (`400200`)
   - Production Passkey
   - Production callback URL

