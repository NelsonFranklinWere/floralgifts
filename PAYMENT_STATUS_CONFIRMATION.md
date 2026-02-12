# Payment Status Recording Confirmation

## ✅ Confirmed: Both Payment Methods Record Status Correctly

### STK Push Payment (M-Pesa via Co-op Bank)

**Status Updates:**
- ✅ **"paid"** - When payment is successful (ResponseCode === "00" or "0", TransactionStatus === "Success")
- ⚠️ **"pending"** - When payment fails (kept as pending to allow retry)
- ✅ **"failed"** - When M-Pesa direct callback returns error (resultCode !== "0")

**Database Fields Updated:**
- `status` → "paid" / "pending" / "failed"
- `mpesa_result_code` → Response code from payment gateway
- `mpesa_receipt_number` → M-Pesa receipt number
- `mpesa_checkout_request_id` → MessageReference or CheckoutRequestID
- `payment_method` → "mpesa" (set when order is created)

**Callback Handler:** `/api/mpesa/callback`
- Handles both M-Pesa direct and Co-op Bank STK push callbacks
- Sends email notification when status is set to "paid"

---

### PayPal/Card Payment (Pesapal)

**Status Updates:**
- ✅ **"paid"** - When payment is completed (statusCode === 1 or statusDesc === "COMPLETED")
- ✅ **"failed"** - When payment fails (statusCode === 2 or statusDesc === "FAILED")
- ⚠️ **"pending"** - When no payment status received (kept as pending)

**Database Fields Updated:**
- `status` → "paid" / "failed" / "pending"
- `pesapal_order_tracking_id` → Order tracking ID from Pesapal
- `pesapal_payment_method` → Payment method (e.g., "VISA", "MASTERCARD")
- `pesapal_confirmation_code` → Confirmation code from Pesapal
- `payment_method` → "card" (set when order is created)

**Callback Handler:** `/api/pesapal/callback`
- Fetches payment status from Pesapal API
- Sends email notification when status is set to "paid"

---

## Dashboard Display

### Admin Dashboard (`/admin/orders`)

**Status Filtering:**
- ✅ **All Orders** - Shows all orders regardless of status
- ✅ **Paid Orders** - Shows only orders with status = "paid"
- ✅ **Pending Orders** - Shows only orders with status = "pending"
- ✅ **Failed Orders** - Shows only orders with status = "failed"

**Status Display:**
- 🟢 **Paid** - Green badge (`bg-brand-green/10 text-brand-green`)
- 🟡 **Pending** - Pink badge (`bg-brand-pink/10 text-brand-pink`)
- 🔴 **Failed** - Red badge (`bg-brand-red/10 text-brand-red`)

**Order Information Displayed:**
- Order ID (first 8 characters)
- Customer name and phone
- Total amount
- **Status** (paid/pending/failed) with color coding
- **Payment method** (mpesa/card) with receipt numbers
- Created date/time
- Action buttons (Mark Paid/Mark Failed/Mark Shipped)

### Dashboard Stats (`/admin`)

**Statistics Calculated:**
- ✅ **Total Orders** - Count of all orders
- ✅ **Pending Orders** - Count of orders with status = "pending"
- ✅ **Paid Orders** - Count of orders with status = "paid"
- ✅ **Total Revenue** - Sum of `total_amount` for all orders with status = "paid"

---

## Payment Flow Summary

### STK Push Flow:
1. Order created → `status: "pending"`, `payment_method: "mpesa"`
2. STK push initiated → User receives prompt
3. Payment completed → Callback received
4. **Status updated to "paid"** ✅
5. Email sent to business ✅
6. Dashboard shows order as "paid" ✅

### PayPal/Card Flow:
1. Order created → `status: "pending"`, `payment_method: "card"`
2. Redirected to Pesapal → User completes payment
3. Payment callback received → Status fetched from Pesapal API
4. **Status updated to "paid"** ✅
5. Email sent to business ✅
6. Dashboard shows order as "paid" ✅

---

## ✅ Confirmation

**Both payment methods correctly:**
- ✅ Record order status in database (paid/pending/failed)
- ✅ Update status when payment is confirmed
- ✅ Display status in admin dashboard with proper filtering
- ✅ Show payment method and receipt numbers
- ✅ Calculate statistics correctly (pending/paid counts, revenue)
- ✅ Send email notifications when payment is confirmed

**Dashboard Features:**
- ✅ Filter orders by status (all/paid/pending/failed)
- ✅ Color-coded status badges
- ✅ Payment method display with receipt numbers
- ✅ Manual status update buttons for admins
- ✅ Real-time statistics on dashboard home page

---

## Note on Co-op Bank Failure Handling

Currently, Co-op Bank STK push failures keep the order as "pending" instead of "failed" to allow customers to retry payment. This is intentional behavior.

If you want failed payments to be marked as "failed" instead, we can update the callback handler.
