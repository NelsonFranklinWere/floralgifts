# STK Push Payment Flow Analysis

## What Happens When STK Push Button is Clicked

### Step-by-Step Flow

1. **User Action**
   - User enters mobile number in STK phone input field
   - User clicks "Complete Payment" button
   - `handleSTKPush()` function is called

2. **Payment Method Validation**
   - Checks if `paymentMethod === "stk"` (default is now `"stk"`)
   - Logs payment method to console for debugging
   - Validates phone number format (must be 2547XXXXXXXX)

3. **Order Creation**
   - Creates order in database via `/api/orders` POST
   - Sets `payment_method: "mpesa"`
   - Stores order ID

4. **Co-op Bank STK Push API Call**
   - Calls `/api/coopbank/stkpush` with:
     - `MobileNumber`: User's phone number
     - `Amount`: Total in cents (API converts to KES)
     - `MessageReference`: Order ID reference
     - `Narration`: Order description
   - **NO Pesapal API call**
   - **NO PayPal redirect**

5. **Response Handling**
   - **Success Case** (`ResponseCode === "00"` or `success: true`):
     - Stores order in `sessionStorage`
     - Tracks analytics event
     - **Redirects to**: `/order/success?id={orderId}&pending=true`
     - Uses `router.push()` - **NO external redirect**
   
   - **Error Case**:
     - Shows error message to user
     - Sets `stkError` state
     - **NO redirect anywhere**
     - **NO fallback to Pesapal**

6. **Success Page Behavior**
   - Displays "Payment Pending" message
   - Polls `/api/orders/{orderId}` every 3 seconds
   - Waits for callback to update order status to "paid"
   - After payment confirmed, redirects to WhatsApp (after 15 seconds)

## Critical Guards Added

1. **Default Payment Method**: Set to `"stk"` so STK is pre-selected
2. **Explicit Returns**: Every STK block ends with `return` to prevent fallthrough
3. **Error Handling**: STK errors never trigger Pesapal flow
4. **Logging**: Console logs show exactly which payment method is used
5. **Response Validation**: Checks for success before redirecting

## What Should NOT Happen

- ❌ STK push should NEVER call `/api/pesapal/payment`
- ❌ STK push should NEVER redirect to PayPal/Pesapal payment page
- ❌ STK push should NEVER use `window.location.href` to external payment URLs
- ❌ Errors should NEVER fallback to Pesapal

## What SHOULD Happen

- ✅ STK push calls `/api/coopbank/stkpush` only
- ✅ Success redirects to `/order/success?id={orderId}&pending=true` (internal route)
- ✅ Errors show error message and stay on checkout page
- ✅ Only card payment (`paymentMethod === "pesapal"`) redirects to Pesapal/PayPal

## Debugging Checklist

If STK push still redirects to PayPal, check:

1. **Browser Console Logs**
   - Look for: `"🔍 Payment method check:"` - should show `isSTK: true, isPesapal: false`
   - Look for: `"✅ STK Push selected - using Co-op Bank API only"`
   - Look for: `"💳 Checkout: Co-op Bank STK Push response:"` - check response structure

2. **Network Tab**
   - Should see POST to `/api/coopbank/stkpush`
   - Should NOT see POST to `/api/pesapal/payment`
   - Should NOT see redirect to `pay.pesapal.com` or `paypal.com`

3. **Payment Method State**
   - Check if `paymentMethod` is actually `"stk"` when button is clicked
   - Verify radio button selection matches state

4. **Browser Cache**
   - Clear browser cache and hard refresh (Ctrl+Shift+R)
   - Check if old JavaScript bundle is cached

5. **Server Deployment**
   - Ensure latest code is deployed
   - Check server logs for which API is being called

## Files Modified

- `app/checkout/page.tsx`:
  - Default `paymentMethod` set to `"stk"`
  - Added explicit returns after STK block
  - Added logging for debugging
  - Improved error handling for STK-specific errors
  - Added guard comments and checks
