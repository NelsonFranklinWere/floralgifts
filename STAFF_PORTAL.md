# Staff Portal (`/staff`)

## Access

- **URL:** https://floralwhispersgifts.co.ke/staff/login
- **Footer link:** "Staff" in the site footer
- **Roles:** `super_admin` (full access) and `staff` (no delete, no financials)

## Setup

1. Run the Supabase migration:

   ```bash
   # Apply 011_staff_admin_panel.sql in Supabase SQL editor or CLI
   ```

2. Ensure env vars are set: `JWT_SECRET`, `RESEND_API_KEY` (for password reset & replies).

3. Default super admin: `floral@gmail.com` / `Admin@123` (override via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`).

4. Add staff users in **Settings → Staff accounts** (super admin only).

## Features

| Section | Path |
|---------|------|
| Dashboard | `/staff` |
| Products | `/staff/products` |
| Orders | `/staff/orders` |
| Customers | `/staff/customers` |
| Financials | `/staff/financials` (super admin) |
| Coupons | `/staff/coupons` |
| Delivery | `/staff/delivery` |
| Content | `/staff/content` |
| Messages | `/staff/messages` |
| Audit logs | `/staff/audit` |
| Settings | `/staff/settings` |

## Live updates (realtime)

The admin panel connects to **Server-Sent Events** at `/api/staff/stream` using your staff JWT. When a customer places an order or sends a contact message, you get:

- Toast notifications (top right)
- **Live** badge (bottom right)
- Auto-refresh on **Dashboard**, **Orders**, and **Messages**

**One-time Supabase setup** — open Supabase → SQL Editor, paste and run `supabase/setup-admin-realtime.sql` (enables instant live updates). Without this, the dashboard still auto-refreshes every 12 seconds via polling.

**CLI (if `exec_sql` exists after setup):** `npm run staff:realtime`  
**Admin login:** `npm run staff:admin` → `floral@gmail.com` / `Admin@123`

**Website catalog** — when you create, edit, or delete products in admin, the public store cache is cleared immediately (`products-catalog` tag) so the next page load shows current prices and stock.

## Security

- 30-minute session (JWT + inactivity logout in browser)
- Login audit (`staff_login_logs`)
- Action audit (`staff_audit_logs`)
- Password reset via email (`/staff/forgot-password`)

## Legacy admin

Core routes redirect to staff:

- `/admin` → `/staff`
- `/admin/login` → `/staff/login`
- `/admin/products` → `/staff/products`
- `/admin/orders` → `/staff/orders`

Blogs, reviews, case studies, and hero slides remain at `/admin/*`.

Staff login sets both `staff_token` and `admin_token` cookies; `/api/admin/upload` works from the staff product editor.
