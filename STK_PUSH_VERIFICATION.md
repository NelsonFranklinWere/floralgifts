# STK Push Payment Verification

## ✅ Confirmed: STK Push Uses Co-op Bank API Directly - NO Pesapal Redirect

### STK Push Payment Flow (app/checkout/page.tsx)

**Line 182-257:** STK Push handler
- ✅ Uses `/api/coopbank/stkpush` endpoint
- ✅ NO Pesapal API calls
- ✅ NO Pesapal redirects
- ✅ Direct Co-op Bank STK push
- ✅ Redirects to `/order/success` page (NOT Pesapal)

**Code Flow:**
```typescript
if (paymentMethod === "stk") {
  // Create order
  const orderResponse = await axios.post("/api/orders", {...});
  
  // Call Co-op Bank STK Push API directly
  const stkResponse = await axios.post("/api/coopbank/stkpush", {
    MobileNumber: stkPhone,
    Amount: total,
    MessageReference: `FL-${orderId.slice(0, 8)}`,
    Narration: `Floral Whispers Order #${orderId.slice(0, 8)}`,
  });
  
  // On success, redirect to success page
  router.push(`/order/success?id=${orderId}&pending=true`);
}
```

### Card Payment Flow (Separate - Uses Pesapal)

**Line 315-392:** Card payment handler
- ✅ Uses `/api/pesapal/payment` endpoint
- ✅ Redirects to Pesapal payment page
- ✅ Only for `paymentMethod === "pesapal"`

**Code Flow:**
```typescript
if (paymentMethod === "pesapal") {
  // Create order
  const orderResponse = await axios.post("/api/orders", {...});
  
  // Call Pesapal API
  const pesapalResponse = await axios.post("/api/pesapal/payment", {...});
  
  // Redirect to Pesapal payment page
  window.location.href = pesapalResponse.data.data.redirect_url;
}
```

---

## Verification Checklist

### ✅ STK Push (paymentMethod === "stk")
- [x] Uses `/api/coopbank/stkpush` - **CONFIRMED**
- [x] NO Pesapal API calls - **CONFIRMED**
- [x] NO Pesapal redirects - **CONFIRMED**
- [x] Redirects to `/order/success` page - **CONFIRMED**
- [x] Uses Co-op Bank credentials - **CONFIRMED**

### ✅ Card Payments (paymentMethod === "pesapal")
- [x] Uses `/api/pesapal/payment` - **CONFIRMED**
- [x] Redirects to Pesapal payment page - **CONFIRMED**
- [x] Separate from STK push - **CONFIRMED**

---

## If STK Push Still Redirects to Pesapal

**Possible causes:**
1. **Cached code on server** - Server needs to be restarted
2. **Browser cache** - Clear browser cache
3. **Old code deployed** - Check if latest code is deployed

**Solution:**
1. Deploy latest code to server
2. Restart PM2: `pm2 restart floralgifts`
3. Clear browser cache
4. Test in incognito/private window

---

## Files to Verify

1. `app/checkout/page.tsx` - Lines 182-257 (STK Push handler)
2. `components/CheckoutForm.tsx` - Lines 115-197 (STK Push handler)
3. `app/api/coopbank/stkpush/route.ts` - Co-op Bank STK Push API

All files confirm: **STK Push uses Co-op Bank API directly, NO Pesapal redirects**
