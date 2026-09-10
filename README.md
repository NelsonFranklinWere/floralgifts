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
- PostgreSQL (Database)
- Zustand (State Management)
- React Hook Form + Yup (Forms)
- Headless UI (Components)
- MPESA Daraja API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up the database (PostgreSQL):
   - The production database runs on the app server (`localhost:5432`, database `floralwhispersgifts`)
   - Schema history lives in `supabase/migrations/` (kept for reference)

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Fill in your database credentials:
- `PGHOST` / `PGPORT` / `PGDATABASE` / `PGUSER` / `PGPASSWORD` (or `DATABASE_URL`)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

The app talks to PostgreSQL through a drop-in adapter in `lib/supabase.ts`
(same fluent API surface as before, backed by the `pg` package).

For local development, tunnel to the production database first:

```bash
ssh -N -L 5433:127.0.0.1:5432 root@13.140.33.232
```

Then set in `.env.local`:

```
PGHOST=127.0.0.1
PGPORT=5433
PGDATABASE=floralwhispersgifts
PGUSER=floral
PGPASSWORD=<ask the team lead>
```

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
