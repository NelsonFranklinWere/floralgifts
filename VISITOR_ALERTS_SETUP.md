# Visitor Alerts & Live Tracking Setup

This app notifies the site owner when visitors are on any page, with **sounds and desktop alerts**.

## 1. In-app Live Visitors (built-in)

- **What it does:** Every page view sends a lightweight ping to the server. The admin dashboard can show recent activity and play a **sound** and **desktop notification** when a new visitor is detected.
- **How to use:**
  1. Log in to **Admin** → open **Live Visitors**.
  2. Enable **Sound alerts** (checked by default).
  3. Click **Enable desktop notifications** and allow the browser permission.
  4. Keep the Live Visitors page open; it polls every 3 seconds and plays a sound + shows a notification when someone visits any page on the site.

No extra configuration needed. Data is kept in memory (last 200 pings) and resets on server restart.

---

## 2. TraceMyIP (optional)

TraceMyIP gives you **IP tracking**, **email alerts**, and a **tracking console** for visitors.

### Setup

1. Sign up at [TraceMyIP](https://www.tracemyip.org/).
2. Add your website project and generate a **tracker code** (JavaScript).
3. From the code you get a script URL, e.g. `https://cdn.tracemyip.org/tracker?pid=YOUR_PROJECT_ID`.
4. In `.env.local` set **one** of:
   - `NEXT_PUBLIC_TRACEMYIP_TRACKER_URL=https://cdn.tracemyip.org/tracker?pid=YOUR_PROJECT_ID`  
     (paste the full `src` URL from your tracker code), **or**
   - `NEXT_PUBLIC_TRACEMYIP_PROJECT_ID=YOUR_PROJECT_ID`  
     (we build the URL for you).
5. Restart the dev server or rebuild. The script will load on all pages.
6. In the **TraceMyIP dashboard** enable **instant email alerts** and any console notifications you want.

---

## 3. Formilla (optional)

Formilla adds **live chat** and **visitor notifications** (sound, desktop, push) from their dashboard/app.

### Setup

1. Sign up at [Formilla](https://www.formilla.com/).
2. In Formilla: **Settings** → **Installation** → choose **“My platform isn’t listed”** and copy the **chat script** they provide.
3. If the script is a single URL (e.g. `https://...formilla.../embed.js?...`), set in `.env.local`:
   - `NEXT_PUBLIC_FORMILLA_SCRIPT_URL=https://...` (the full script `src` URL).
4. Restart or rebuild so the script loads on all pages.
5. In the **Formilla dashboard** enable **sound alerts** and **desktop notifications** (and mobile push if you use their app).

If Formilla gives you an inline snippet plus a script tag, you may need to add the inline part to `components/VisitorTracking.tsx` or your layout (e.g. via a separate `<Script>` with `dangerouslySetInnerHTML`).

---

## Summary

| Feature              | Where to enable sounds/alerts |
|----------------------|--------------------------------|
| **In-app Live Visitors** | Admin → Live Visitors (sound + desktop notifications) |
| **TraceMyIP**         | TraceMyIP dashboard (email + console)                |
| **Formilla**          | Formilla dashboard / app (sound + desktop + push)     |

The **Live Visitors** page gives you immediate sounds and alerts without any third-party accounts. Add TraceMyIP and/or Formilla for extra tracking and chat.
