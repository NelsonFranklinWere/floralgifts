-- Migration: Add cards category to products table
-- This migration adds 'cards' to the allowed categories for products

-- Update products category constraint to include 'cards'
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN ('flowers', 'hampers', 'teddy', 'wines', 'chocolates', 'cards'));

-- Add comment to document the constraint
COMMENT ON CONSTRAINT products_category_check ON products IS 'Valid product categories including gift cards';
