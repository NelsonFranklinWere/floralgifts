# Payment Methods Confirmation

## ✅ CONFIRMED: Only Card Payments Use Pesapal

### Payment Method Separation

#### 1. STK Push Payment (`paymentMethod === "stk"`)
**Location:** `app/checkout/page.tsx` lines 182-257

**Flow:**
- ✅ Uses `/api/coopbank/stkpush` - Co-op Bank API
- ✅ NO Pesapal API calls
- ✅ NO Pesapal redirects
- ✅ Redirects to `/order/success` page
- ✅ Uses Co-op Bank credentials

**Code:**
```typescript
if (paymentMethod === "stk") {
  // Calls Co-op Bank STK Push API
  const stkResponse = await axios.post("/api/coopbank/stkpush", {...});
  
  // Redirects to success page (NOT Pesapal)
  router.push(`/order/success?id=${orderId}&pending=true`);
}
```

---

#### 2. Card Payment (`paymentMethod === "pesapal"`)
**Location:** `app/checkout/page.tsx` lines 315-392

**Flow:**
- ✅ Uses `/api/pesapal/payment` - Pesapal API
- ✅ Redirects to Pesapal payment page
- ✅ Only for card payments

**Code:**
```typescript
if (paymentMethod === "pesapal") {
  // Calls Pesapal API
  const pesapalResponse = await axios.post("/api/pesapal/payment", {...});
  
  // Redirects to Pesapal payment page
  window.location.href = pesapalResponse.data.data.redirect_url;
}
```

---

## Payment Method Matrix

| Payment Method | API Endpoint | Redirects To | Uses Pesapal |
|---------------|--------------|--------------|--------------|
| **STK Push** (`stk`) | `/api/coopbank/stkpush` | `/order/success` | ❌ NO |
| **Card Payment** (`pesapal`) | `/api/pesapal/payment` | Pesapal payment page | ✅ YES |
| **Till Number** (`till`) | N/A | WhatsApp | ❌ NO |
| **Paybill** (`paybill`) | N/A | WhatsApp | ❌ NO |

---

## Code Verification

### STK Push Handler
- **File:** `app/checkout/page.tsx`
- **Lines:** 182-257
- **API:** `/api/coopbank/stkpush`
- **Pesapal calls:** 0
- **Pesapal redirects:** 0

### Card Payment Handler
- **File:** `app/checkout/page.tsx`
- **Lines:** 315-392
- **API:** `/api/pesapal/payment`
- **Pesapal calls:** 1
- **Pesapal redirects:** 1

---

## ✅ Final Confirmation

**STK Push:**
- ✅ Uses Co-op Bank API directly
- ✅ NO Pesapal involvement
- ✅ Standalone payment method

**Card Payments:**
- ✅ Uses Pesapal API
- ✅ Redirects to Pesapal payment page
- ✅ Only payment method that uses Pesapal

**Conclusion:** Only card payments (`paymentMethod === "pesapal"`) go through Pesapal. STK push is completely independent and uses Co-op Bank API directly.
