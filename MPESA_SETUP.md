# M-Pesa STK Push Setup Guide

This guide explains everything you need to set up M-Pesa STK Push payment integration for Floral Whispers Gifts.

## Prerequisites

1. **M-Pesa Daraja API Account**
   - Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
   - Create an app to get Consumer Key and Consumer Secret
   - Request STK Push access from Safaricom
   - **Apply for Online PayBill** - Required for STK Push functionality

2. **Business Shortcode (Till Number or Paybill)**
   - You need a registered M-Pesa Business Shortcode
   - This is your Till Number or Paybill Number
   - **Your PayBill:** `400200`
   - **Your Account Number:** `4004055549` (used as AccountReference)

3. **Passkey**
   - Generated from your Safaricom Developer Portal
   - Used to encrypt STK Push requests
   - **You need to apply for Online PayBill to get this**

## Required Environment Variables

Add these to your `.env.local` file (for development) or your hosting platform's environment variables (for production):

```env
# M-Pesa Configuration
MPESA_ENV=sandbox                    # Use "sandbox" for testing, "production" for live
MPESA_CONSUMER_KEY=your_consumer_key_here      # Get from Safaricom Developer Portal after applying for Online PayBill
MPESA_CONSUMER_SECRET=your_consumer_secret_here # Get from Safaricom Developer Portal after applying for Online PayBill
MPESA_SHORTCODE=400200               # Your PayBill Number
MPESA_PASSKEY=your_passkey_here      # Get from Safaricom Developer Portal after applying for Online PayBill
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

## Step-by-Step Setup

### 1. Apply for Online PayBill and Get M-Pesa Daraja API Credentials

**Important:** You need to apply for Online PayBill to enable STK Push functionality.

1. **Apply for Online PayBill:**
   - Contact Safaricom to apply for Online PayBill
   - Provide your business registration documents
   - Your PayBill: `400200`
   - Your Account Number: `4004055549`
   - Request STK Push access

2. **Get M-Pesa Daraja API Credentials:**
   - Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
   - Sign up/Login
   - Create a new app (or use existing)
   - Copy your **Consumer Key** and **Consumer Secret**
   - Your **Business Shortcode (PayBill):** `400200`
   - Generate your **Passkey** from the portal (available after Online PayBill approval)

### 2. Set Up Callback URL

The callback URL is where M-Pesa sends payment confirmation after a customer completes payment.

**For Production:**
```
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

**For Local Development (Testing):**
1. Install ngrok: `npm install -g ngrok` or download from [ngrok.com](https://ngrok.com)
2. Start your Next.js app: `npm run dev`
3. In another terminal, run: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Set: `MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/mpesa/callback`

**Important:** 
- The callback URL must be HTTPS (even for testing with ngrok)
- The callback URL must be publicly accessible (M-Pesa servers need to reach it)
- Update the callback URL in your Safaricom Developer Portal app settings

### 3. Configure Environment Variables

**For Local Development:**
Create a `.env.local` file in the project root:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# M-Pesa Configuration
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/mpesa/callback

# JWT Secret (for admin authentication)
JWT_SECRET=your_jwt_secret_key
```

**For Production (Vercel/Netlify/etc):**
1. Go to your hosting platform's dashboard
2. Navigate to Settings → Environment Variables
3. Add all the variables above
4. Make sure `MPESA_ENV=production`
5. Update `MPESA_CALLBACK_URL` to your production domain

### 4. Test with M-Pesa Sandbox

**Sandbox Test Credentials (Your Current Setup):**
- Consumer Key: `gQE0zykwt3dXyXGemkfSdAGS1G6qGjGxjF5bwCBdGAsSHf0S`
- Consumer Secret: `Hy6TP0ln3i4HoeH84OzVBvtmnRU9bSu0hpfXKQTITXn4uWOvjkL5fTPPkdyLMyMe`
- Shortcode: `174379` (Safaricom test shortcode)
- Passkey: Get from your Safaricom Developer Portal app settings
- Test Phone: Use any number starting with `2547` (e.g., `254712345678`)
- Test Amount: Any amount (sandbox doesn't charge real money)

**Sandbox Test Steps:**
1. ✅ Set `MPESA_ENV=sandbox` (already configured)
2. ✅ Use sandbox Consumer Key and Secret (already in .env.local)
3. ✅ Use shortcode `174379` (already configured)
4. ⚠️ Get your Passkey from Safaricom Developer Portal → Your App → STK Push → Copy Passkey
5. Set callback URL to your ngrok URL (for local testing) or production URL
6. Test a payment - you'll receive a prompt on your test phone

**Getting Your Sandbox Passkey:**
1. Log into [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Go to your app dashboard
3. Navigate to STK Push section
4. Copy the Passkey value
5. Add it to `.env.local` as `MPESA_PASSKEY=your_passkey_here`

### 5. Go Live (Production)

1. **Request Production Access:**
   - Contact Safaricom to move from sandbox to production
   - Provide business registration documents
   - Get approval for production credentials

2. **Update Environment Variables:**
   - Set `MPESA_ENV=production`
   - Use production Consumer Key and Secret
   - Use your actual Business Shortcode
   - Use production Passkey
   - Set callback URL to your production domain

3. **Configure Callback URL in Safaricom Portal:**
   - Log into Safaricom Developer Portal
   - Go to your app settings
   - Add your production callback URL: `https://yourdomain.com/api/mpesa/callback`
   - Save changes

## How It Works

1. **Customer clicks "Pay with M-Pesa"**
   - Order is created in database
   - STK Push is initiated via `/api/mpesa/stkpush`

2. **M-Pesa sends prompt to customer's phone**
   - Customer enters M-Pesa PIN
   - Payment is processed

3. **M-Pesa sends callback to your server**
   - Callback received at `/api/mpesa/callback`
   - Order status updated to "paid" or "failed"
   - Receipt number saved

4. **Customer is redirected to success page**
   - System polls for payment status
   - Redirects to `/order/success` when confirmed

## Troubleshooting

### "MPESA_CALLBACK_URL not configured"
- Make sure `MPESA_CALLBACK_URL` is set in your environment variables
- Restart your development server after adding it

### "Failed to fetch MPESA token"
- Check your Consumer Key and Consumer Secret
- Make sure they're correct and not expired
- Verify you have STK Push permissions

### "STK Push failed"
- Check your Shortcode is correct
- Verify Passkey is correct
- Ensure callback URL is HTTPS and publicly accessible
- Check phone number format (must start with 254)

### Callback not received
- Verify callback URL is accessible from internet (use ngrok for local)
- Check callback URL is registered in Safaricom Developer Portal
- Ensure callback URL uses HTTPS
- Check server logs for callback attempts

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit `.env.local` to Git** - It's already in `.gitignore`
2. **Use strong JWT_SECRET** - Generate a random string for production
3. **Keep service role keys secret** - Never expose in client-side code
4. **Use HTTPS in production** - Required for M-Pesa callbacks
5. **Rate limiting** - Already implemented (5 requests per minute per IP)

## Testing Checklist

- [ ] Environment variables configured
- [ ] Callback URL is publicly accessible (HTTPS)
- [ ] Callback URL registered in Safaricom portal
- [ ] Test payment with sandbox credentials
- [ ] Verify callback is received and order status updates
- [ ] Test with different phone numbers
- [ ] Test payment failure scenarios
- [ ] Verify order notes include payment phone number

## Support

For M-Pesa API issues:
- [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
- [M-Pesa Daraja API Documentation](https://developer.safaricom.co.ke/docs)

For application issues:
- Check server logs for error messages
- Verify all environment variables are set correctly
- Test with sandbox credentials first before going live

