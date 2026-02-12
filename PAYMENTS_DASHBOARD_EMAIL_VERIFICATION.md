# Payments, Dashboard & Email Verification

## 1. Why STK Push Might Have Redirected to PayPal (and fixes)

**Possible causes:**
- **Payment method state:** If `paymentMethod` was not set to `"stk"` when the user clicked Pay (e.g. null or `"pesapal"`), the handler would run the card block and redirect to Pesapal/PayPal.
- **Co-op Bank failure:** If the Co-op Bank STK API failed (e.g. 500, invalid credentials), the frontend should show an error and stay on checkout. There is no code that falls back to Pesapal on STK failure.

**Fixes applied:**
- **Default payment method** is now `"stk"` so M-Pesa STK is pre-selected.
- **Hard guard before Pesapal redirect:** Right before `window.location.href = redirect_url`, we check `if (paymentMethod !== "pesapal")` and abort with an error so we never redirect to PayPal unless the user explicitly chose card.
- **Explicit returns** after the STK block so execution never falls through to the Pesapal block.
- **STK errors** are handled in the catch block with `setStkError` and `return`; no redirect.

**If it still happens:** Check browser console for `"🔍 Payment method check:"` and `"✅ STK Push selected"`. If you see `"💳 Checkout: Initiating Pesapal card payment"` when you chose STK, the UI state is wrong (e.g. wrong radio selected). Clear cache and ensure the latest bundle is deployed.

---

## 2. Payments Recorded on Dashboard

**Dashboard data source:** `/api/admin/stats` and `/api/admin/orders` use `getOrders()` from `lib/db.ts`, which reads from the `orders` table and filters by `status`.

**How status is set:**

| Flow              | When status becomes "paid" / "pending" / "failed" | Where |
|-------------------|---------------------------------------------------|--------|
| **STK (Co-op Bank)** | Callback from Co-op Bank/M-Pesa hits `/api/mpesa/callback`. It finds the order by `MessageReference` (or `mpesa_checkout_request_id`). On success it calls `updateOrder(order.id, { status: "paid", mpesa_receipt_number, ... })`. On failure it sets `status: "failed"` or leaves "pending". | `app/api/mpesa/callback/route.ts` |
| **Card (Pesapal)**   | Pesapal redirects to `/api/pesapal/callback`. Callback fetches status from Pesapal API and calls `updateOrder(orderId, { status: "paid" \| "failed", pesapal_* })`. | `app/api/pesapal/callback/route.ts` |

**Reliable STK order lookup:** When STK is initiated, we now pass `OrderId` to `/api/coopbank/stkpush`. The route stores `MessageReference` on the order as `mpesa_checkout_request_id`. When the M-Pesa callback runs, it finds the order by `mpesa_checkout_request_id === messageReference`, so the same order is updated and appears correctly on the dashboard (paid/pending/failed).

**Dashboard UI:** Admin Dashboard shows Total Orders, Pending, Paid, Total Revenue. Admin Orders page filters by All / Pending / Paid / Failed / Shipped. So both STK and card payments are reflected once the callback has run and updated the order.

---

## 3. Emails Sent

**When:** After a payment is confirmed (status set to "paid") in the callback.

| Flow    | Where email is sent | Recipient |
|---------|----------------------|-----------|
| **STK (M-Pesa / Co-op Bank)** | In `/api/mpesa/callback/route.ts`, after `updateOrder(..., status: "paid")`, the code sends an email via Resend. | `process.env.ADMIN_EMAIL` or fallback `whispersfloral@gmail.com` |
| **Card (Pesapal)**           | In `/api/pesapal/callback/route.ts`, when `newStatus === "paid"`, it sends an email via Resend. | Same as above |

**Email content:** Subject like "✅ Payment Confirmed - Order #...", with payment method, receipt/confirmation code, order details, items, total, and delivery info.

**Requirements:** `RESEND_API_KEY` and optionally `ADMIN_EMAIL` and `RESEND_FROM_EMAIL` must be set. If Resend fails, the callback still returns success and the order remains "paid"; the error is only logged.

---

## 4. Quick Checklist

- [ ] **STK never redirects to PayPal:** Default is STK; guard before Pesapal redirect; no fallback to Pesapal on STK failure.
- [ ] **STK payments on dashboard:** Order is found by `mpesa_checkout_request_id` (set when STK is initiated with `OrderId`); callback updates same order to paid/pending/failed.
- [ ] **Card payments on dashboard:** Pesapal callback updates order by `OrderMerchantReference` (order id).
- [ ] **Emails:** Both M-Pesa and Pesapal callbacks send a confirmation email to the admin when status is "paid".
