-- Migration: Add Pesapal payment fields to orders table
-- This migration adds fields to track Pesapal card payments

-- Add Pesapal-specific fields to orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS pesapal_order_tracking_id TEXT,
  ADD COLUMN IF NOT EXISTS pesapal_payment_method TEXT,
  ADD COLUMN IF NOT EXISTS pesapal_confirmation_code TEXT;

-- Add index for Pesapal order tracking ID for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_pesapal_tracking ON orders(pesapal_order_tracking_id);

-- Update payment_method constraint to include 'card' (if not already done)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check 
  CHECK (payment_method IN ('mpesa', 'mpesa_till', 'mpesa_paybill', 'whatsapp', 'card'));

-- Update delivery_address column name if it's still 'address'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'address'
  ) THEN
    ALTER TABLE orders RENAME COLUMN address TO delivery_address;
  END IF;
END $$;

-- Add comment to document the fields
COMMENT ON COLUMN orders.pesapal_order_tracking_id IS 'Pesapal unique order tracking identifier';
COMMENT ON COLUMN orders.pesapal_payment_method IS 'Payment method used via Pesapal (e.g., VISA, MASTERCARD)';
COMMENT ON COLUMN orders.pesapal_confirmation_code IS 'Pesapal payment confirmation code';

