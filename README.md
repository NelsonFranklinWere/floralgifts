# Floral Whispers Gifts

Modern e-commerce website for Floral Whispers Gifts - premium flowers, gift hampers, and teddy bears in Nairobi.

## Features

- 🛍️ Full e-commerce functionality with shopping cart
- 💳 MPESA STK Push payment integration
- 📱 WhatsApp ordering
- 🎨 Modern, sleek, professional design
- 📱 Mobile-first responsive design
- 🔍 SEO optimized
- ♿ Accessible design
- 🎯 Filterable product collections

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database, Auth, Storage)
- Zustand (State Management)
- React Hook Form + Yup (Forms)
- Headless UI (Components)
- MPESA Daraja API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a Supabase project:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

3. Set up the database:
   - In Supabase Dashboard, go to SQL Editor
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`
   - This creates tables and sample data

4. Configure environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

1. In Supabase Dashboard → SQL Editor, run:
   ```sql
   -- Copy contents from supabase/migrations/001_initial_schema.sql
   ```

2. Or use Supabase CLI:
   ```bash
   supabase db push
   ```

3. To seed sample data (optional):
   - The migration includes sample products
   - Or insert manually via Supabase Dashboard → Table Editor

## MPESA Setup

1. Get your MPESA Daraja API credentials from Safaricom
2. Set environment variables:
   - `MPESA_CONSUMER_KEY`
   - `MPESA_CONSUMER_SECRET`
   - `MPESA_SHORTCODE`
   - `MPESA_PASSKEY`
   - `MPESA_CALLBACK_URL` (your production URL + `/api/mpesa/callback`)

3. For testing, use MPESA sandbox:
   - `MPESA_ENV=sandbox`
   - `MPESA_SHORTCODE=174379`
   - Use ngrok for local callback: `ngrok http 3000`

## Email Setup (Resend - Free Tier: 3,000 emails/month)

1. Sign up for a free Resend account at [resend.com](https://resend.com)
2. Get your API key from the Resend dashboard
3. Set environment variables:
   - `RESEND_API_KEY` - Your Resend API key (required)
   - `RESEND_FROM_EMAIL` - Your verified domain email (optional, defaults to onboarding@resend.dev for testing)
   
4. To verify your domain (recommended for production):
   - Add your domain in Resend dashboard
   - Add the DNS records provided by Resend
   - Once verified, set `RESEND_FROM_EMAIL` to use your domain (e.g., `noreply@yourdomain.com`)

5. If email is not configured, forms will still work but emails won't be sent (logged to console instead).

**Note:** Resend free tier includes 3,000 emails/month and 100 emails/day. Perfect for small to medium businesses.

## Deployment

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
/app
  /api          # API routes
  /collections  # Collection pages
  /product      # Product detail pages
  /cart         # Cart page
  /order        # Order pages
  /admin        # Admin dashboard
/components     # React components
/lib            # Utilities and helpers
/public         # Static assets
```

## License

Private - Floral Whispers Gifts

# floralgifts
