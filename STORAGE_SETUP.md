# Supabase Storage Setup Guide

## Overview

The application uses **Supabase Storage** to store product images. This allows images to be uploaded from any device (phone, tablet, computer) and works in all hosting environments (Vercel, Netlify, etc.).

## Why Supabase Storage?

- ✅ Works in production hosting (Vercel, Netlify, etc.)
- ✅ Images persist across deployments
- ✅ Accessible from anywhere via public URLs
- ✅ Scales automatically
- ✅ No local filesystem needed

## Setup Instructions

### Option 1: Using SQL (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the storage setup SQL from `supabase/migrations/004_setup_storage.sql`
   - OR run the complete schema which includes storage setup: `supabase/migrations/complete_schema.sql`

### Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Storage**
3. Click **New bucket**
4. Set:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Enable (checked)
5. Click **Create bucket**
6. Go to **Policies** tab
7. Add policies for:
   - **SELECT**: Allow public read access
   - **INSERT**: Allow service role to upload (or restrict to authenticated users)
   - **UPDATE**: Allow service role to update
   - **DELETE**: Allow service role to delete

## Storage Structure

Images are organized by category:
```
product-images/
  ├── products/
  │   ├── flowers/
  │   ├── hampers/
  │   ├── teddy/
  │   ├── wines/
  │   └── chocolates/
```

## How It Works

1. Admin uploads image from phone/device
2. Image is sent to `/api/admin/upload` endpoint
3. Endpoint uploads to Supabase Storage bucket `product-images`
4. Supabase returns a public URL (e.g., `https://yourproject.supabase.co/storage/v1/object/public/product-images/products/flowers/1234567890-image.jpg`)
5. URL is saved in the database
6. Images are accessible from anywhere via the public URL

## Troubleshooting

### Error: "Bucket not found"
- Make sure you've created the `product-images` bucket in Supabase Storage
- Run the storage setup SQL migration

### Error: "Permission denied"
- Check that the bucket is set to **Public**
- Verify storage policies are set correctly
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment variables

### Images not displaying
- Check that the bucket is public
- Verify the image URLs in the database
- Check Next.js image configuration in `next.config.js` (should include `**.supabase.co`)

## Security Notes

- The upload endpoint requires admin authentication
- Storage policies can be further restricted if needed
- Images are publicly accessible (by design for product images)
- Consider adding image optimization/compression in the future

