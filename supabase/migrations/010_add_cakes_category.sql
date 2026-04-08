-- Migration: Add cakes category to products table
-- This migration adds 'cakes' to the allowed categories for products

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN ('flowers', 'hampers', 'teddy', 'wines', 'chocolates', 'cards', 'cakes'));

COMMENT ON CONSTRAINT products_category_check ON products IS 'Valid product categories including gift cards and cakes';

