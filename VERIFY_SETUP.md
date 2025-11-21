# ✅ Verify Your Supabase Setup

## What You Should See in Supabase Dashboard

### ✅ Tables Created
- **products** - Should have 3 sample products
- **orders** - Empty (will fill when orders are placed)
- **admins** - Empty (or has admin account if you added one)

### ✅ RLS (Row Level Security) Status

**"Unrestricted" is OKAY for admins table!** 

Here's why:
- The `admins` table is only accessed server-side using the service role key
- It's never accessed from the client/browser
- So "unrestricted" is fine - it won't be exposed to public

**For other tables:**
- **products**: Should have a policy allowing public read access
- **orders**: Should have a policy for service role access

---

## ✅ Quick Verification Steps

### 1. Check Products Table Has Data
1. In Supabase Dashboard → **Table Editor**
2. Click on **products** table
3. You should see **3 rows**:
   - Beautiful Birthday Bouquet (flowers)
   - Luxury Gift Hamper (hampers)
   - Cuddly Brown Teddy Bear (teddy)

### 2. Test Your App Connection
1. Make sure dev server is running: `npm run dev`
2. Open http://localhost:3000
3. ✅ Homepage should show 3 featured products
4. ✅ Click "Collections" → Should show products by category

### 3. Test Admin Login
1. Go to http://localhost:3000/admin/login
2. Use credentials from `.env.local`:
   - Email: `admin@example.com`
   - Password: `admin123`
3. ✅ Should redirect to admin dashboard

---

## 🔍 If Products Don't Show

### Check Browser Console
1. Open http://localhost:3000
2. Press F12 → Console tab
3. Look for any red errors

### Common Issues:

**Error: "supabaseUrl is required"**
- ✅ Check `.env.local` exists
- ✅ Verify `NEXT_PUBLIC_SUPABASE_URL` is set
- ✅ Restart dev server after creating `.env.local`

**Error: "relation does not exist"**
- ✅ Run the SQL migration again in Supabase SQL Editor
- ✅ Verify tables exist in Table Editor

**No products showing but no errors**
- ✅ Check Supabase Table Editor → `products` table
- ✅ If empty, run the INSERT statement again:

```sql
INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('beautiful-bouquet-birthday', 'Beautiful Birthday Bouquet', 'A stunning bouquet perfect for birthdays', 'This beautiful bouquet features a mix of vibrant flowers arranged with care. Perfect for celebrating birthdays and special occasions.', 15000, 'flowers', ARRAY['birthday']::text[], ARRAY['/images/products/flowers/BouquetFlowers1.jpg']::text[], NULL, NULL),
('luxury-gift-hamper', 'Luxury Gift Hamper', 'A curated selection of premium items', 'This luxury hamper includes fine chocolates, premium wine, gourmet snacks, and more. Perfect for corporate gifting or special celebrations.', 25000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/giftamper.jpg']::text[], NULL, NULL),
('cuddly-brown-teddy-50cm', 'Cuddly Brown Teddy Bear - 50cm', 'A soft and cuddly teddy bear', 'This adorable teddy bear is perfect for children and adults alike. Made with premium materials for comfort and durability.', 5000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/Teddybear1.jpg']::text[], 50, 'brown')
ON CONFLICT (slug) DO NOTHING;
```

---

## ✅ Success Checklist

- [x] Tables created: products, orders, admins
- [ ] Products table has 3 sample products
- [ ] Homepage shows products (http://localhost:3000)
- [ ] Collections pages work
- [ ] Admin login works
- [ ] No errors in browser console

---

## 🎉 Next Steps After Verification

Once everything works:

1. **Add Real Products**: Use admin panel at `/admin/products/new`
2. **Test Order Flow**: Add to cart → Checkout → MPESA (or WhatsApp)
3. **Configure MPESA**: Add Daraja API credentials for payments
4. **Deploy**: Push to Vercel when ready

---

## Need Help?

If you see errors:
1. Check terminal/console output
2. Check Supabase Dashboard → Logs
3. Verify `.env.local` has correct credentials
4. Make sure dev server was restarted after creating `.env.local`

