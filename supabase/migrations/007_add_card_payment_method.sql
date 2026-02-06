-- ============================================
-- ADD CARD PAYMENT METHOD TO ORDERS TABLE
-- This migration updates the payment_method CHECK constraint
-- to include 'card' for Pesapal payments
-- ============================================

-- Step 1: Drop the existing CHECK constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;

-- Step 2: Add the new CHECK constraint with card payment method included
ALTER TABLE orders
ADD CONSTRAINT orders_payment_method_check
CHECK (payment_method IN ('mpesa', 'mpesa_till', 'mpesa_paybill', 'whatsapp', 'card'));

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
