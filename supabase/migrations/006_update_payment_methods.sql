-- ============================================
-- UPDATE PAYMENT METHODS IN ORDERS TABLE
-- This migration updates the payment_method CHECK constraint
-- to support the new payment method values:
-- - 'mpesa' (STK Push)
-- - 'mpesa_till' (Till Number)
-- - 'mpesa_paybill' (Paybill)
-- - 'whatsapp' (existing)
-- ============================================

-- Step 1: Drop the existing CHECK constraint (try common constraint names)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;

-- Step 2: Drop any other CHECK constraints on payment_method using dynamic SQL
DO $$ 
DECLARE
  constraint_name_var TEXT;
BEGIN
  -- Find all CHECK constraints on the orders table that might be for payment_method
  FOR constraint_name_var IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'orders'::regclass
    AND contype = 'c'
    AND (
      conname LIKE '%payment_method%' 
      OR conname LIKE '%payment%check%'
      OR conname = 'orders_check'
    )
  LOOP
    EXECUTE format('ALTER TABLE orders DROP CONSTRAINT IF EXISTS %I', constraint_name_var);
    RAISE NOTICE 'Dropped constraint: %', constraint_name_var;
  END LOOP;
END $$;

-- Step 3: Add the new CHECK constraint with updated payment methods
ALTER TABLE orders 
ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN ('mpesa', 'mpesa_till', 'mpesa_paybill', 'whatsapp'));

-- ============================================
-- VERIFICATION QUERIES (Run these to verify)
-- ============================================
-- Check the constraint was created correctly:
-- SELECT constraint_name, check_clause 
-- FROM information_schema.check_constraints 
-- WHERE constraint_name LIKE '%payment_method%';

-- Check existing payment methods in your orders:
-- SELECT DISTINCT payment_method, COUNT(*) as count
-- FROM orders 
-- GROUP BY payment_method
-- ORDER BY count DESC;
