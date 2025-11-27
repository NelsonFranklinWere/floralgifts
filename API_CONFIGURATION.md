# API Configuration Checklist

This document lists all APIs and services you need to configure for the Floral Whispers Gifts app to work properly.

## ✅ REQUIRED APIs (Must Configure)

### 1. **Supabase** (Database, Storage, Authentication)
**Status:** ✅ Already Configured

- **NEXT_PUBLIC_SUPABASE_URL**: `https://sdculxvqvixpiairzukl.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: ✅ Configured
- **SUPABASE_SERVICE_ROLE_KEY**: ✅ Configured

**What it's used for:**
- Product database (products, orders, blogs)
- Image storage (product images)
- Admin authentication
- Real-time data

**Setup Steps:**
1. ✅ Project created: `sdculxvqvixpiairzukl`
2. ✅ Run database migrations in Supabase SQL Editor
3. ✅ Create `product-images` storage bucket (see STORAGE_SETUP.md)
4. ✅ Set up RLS policies

---

### 2. **M-Pesa Daraja API** (Payment Processing)
**Status:** ⚠️ Partially Configured - Need Passkey

**Required Variables:**
- **MPESA_ENV**: `sandbox` (for testing) or `production` (for live)
- **MPESA_CONSUMER_KEY**: ✅ Configured
- **MPESA_CONSUMER_SECRET**: ✅ Configured
- **MPESA_SHORTCODE**: `174379` (sandbox) or your PayBill number (production)
- **MPESA_PASSKEY**: ❌ **NEED TO GET FROM SAFARICOM** (Required for STK Push)
- **MPESA_CALLBACK_URL**: `https://whispersfloralgifts.co.ke/api/mpesa/callback` (production)

**What it's used for:**
- M-Pesa STK Push payments
- Payment verification

**Setup Steps:**
1. ✅ Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. ✅ Create app and get Consumer Key/Secret
3. ❌ **Apply for Online PayBill** (Required to get Passkey)
4. ❌ Get Passkey from Safaricom Developer Portal
5. Update `MPESA_PASSKEY` in `.env.local`
6. For production: Change `MPESA_ENV=production` and update `MPESA_SHORTCODE` to your PayBill number

**Documentation:** See `MPESA_SETUP.md` for detailed instructions

---

### 3. **Resend** (Email Service)
**Status:** ✅ Configured (Free tier: 3,000 emails/month)

**Required Variables:**
- **RESEND_API_KEY**: ✅ Configured
- **RESEND_FROM_EMAIL**: `onboarding@resend.dev` (default) or your verified domain email

**What it's used for:**
- Order confirmation emails
- Contact form emails
- Admin notifications

**Setup Steps:**
1. ✅ Sign up at [resend.com](https://resend.com)
2. ✅ Get API key from dashboard
3. ⚠️ **Optional for production:** Verify your domain and use custom email (e.g., `noreply@whispersfloralgifts.co.ke`)

**Note:** Free tier includes 3,000 emails/month - perfect for small to medium businesses.

---

### 4. **Admin Authentication** (JWT)
**Status:** ⚠️ Needs Strong Secret Key

**Required Variables:**
- **JWT_SECRET**: ❌ **CHANGE TO STRONG RANDOM STRING** (Currently using placeholder)
- **ADMIN_EMAIL**: `admin@example.com` (Change to your admin email)
- **ADMIN_PASSWORD**: `admin123` (Change to strong password)

**What it's used for:**
- Admin dashboard login
- Secure admin API routes

**Setup Steps:**
1. Generate a strong random string for `JWT_SECRET` (use: `openssl rand -base64 32`)
2. Update `ADMIN_EMAIL` to your admin email
3. Update `ADMIN_PASSWORD` to a strong password
4. **Important:** Never share these credentials publicly

---

## ⚠️ OPTIONAL APIs (Nice to Have)

### 5. **Google Search Console Verification** (SEO)
**Status:** Optional

**Required Variables:**
- **GOOGLE_VERIFICATION**: Your Google Search Console verification code

**What it's used for:**
- Google Search Console verification
- Better SEO tracking

**Setup Steps:**
1. Sign up for [Google Search Console](https://search.google.com/search-console)
2. Add your website
3. Get verification code
4. Add to `GOOGLE_VERIFICATION` in `.env.local`

---

## 📋 Configuration Summary

### Already Configured ✅
- ✅ Supabase (Database & Storage)
- ✅ Resend (Email Service)
- ✅ M-Pesa Consumer Key/Secret (Sandbox)

### Needs Configuration ⚠️
- ⚠️ **M-Pesa Passkey** (Required for STK Push to work)
- ⚠️ **JWT_SECRET** (Change from placeholder to strong random string)
- ⚠️ **ADMIN_EMAIL** (Change from example email)
- ⚠️ **ADMIN_PASSWORD** (Change from default password)

### Optional 🔵
- 🔵 Google Search Console Verification

---

## 🚀 Quick Setup Commands

### Generate Strong JWT Secret:
```bash
openssl rand -base64 32
```

### Check Current Configuration:
```bash
# View all configured variables (without values)
grep -E "^[A-Z]" .env.local | cut -d'=' -f1
```

---

## 📝 Environment Variables Template

Copy this to `.env.local` and fill in the values:

```env
# ============================================
# SUPABASE (Required)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://sdculxvqvixpiairzukl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ============================================
# M-PESA (Required)
# ============================================
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here  # ⚠️ REQUIRED - Get from Safaricom
MPESA_CALLBACK_URL=https://whispersfloralgifts.co.ke/api/mpesa/callback

# ============================================
# ADMIN AUTH (Required)
# ============================================
JWT_SECRET=generate-strong-random-string-here  # ⚠️ CHANGE THIS
ADMIN_EMAIL=your-admin@email.com  # ⚠️ CHANGE THIS
ADMIN_PASSWORD=your-strong-password  # ⚠️ CHANGE THIS

# ============================================
# EMAIL - RESEND (Required)
# ============================================
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev

# ============================================
# BASE URL
# ============================================
NEXT_PUBLIC_BASE_URL=https://whispersfloralgifts.co.ke

# ============================================
# GOOGLE VERIFICATION (Optional)
# ============================================
GOOGLE_VERIFICATION=
```

---

## 🔒 Security Notes

1. **Never commit `.env.local` or `.keys` to git** (already in `.gitignore`)
2. **JWT_SECRET** should be a strong random string (32+ characters)
3. **ADMIN_PASSWORD** should be strong and unique
4. **SUPABASE_SERVICE_ROLE_KEY** has full database access - keep secret
5. **M-Pesa Passkey** is sensitive - keep secure

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] All Supabase credentials are correct
- [ ] Database migrations have been run
- [ ] Storage bucket `product-images` is created and public
- [ ] M-Pesa Passkey is configured (for STK Push)
- [ ] JWT_SECRET is changed to strong random string
- [ ] ADMIN_EMAIL and ADMIN_PASSWORD are updated
- [ ] Resend API key is valid
- [ ] MPESA_CALLBACK_URL points to production URL
- [ ] All environment variables are set in production hosting (Vercel/Netlify)

---

## 📚 Additional Documentation

- **Supabase Setup**: See `STORAGE_SETUP.md`
- **M-Pesa Setup**: See `MPESA_SETUP.md`
- **Database Schema**: See `supabase/migrations/complete_schema.sql`
- **Testing**: See `SANDBOX_TESTING.md`

