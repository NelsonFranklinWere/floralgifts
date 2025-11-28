-- Migration: Add subcategory column to products table
-- This migration adds a subcategory field to allow products to be organized by subcategories
-- within their main category (e.g., "Get Well Soon", "Graduation" for flowers)

-- Add subcategory column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE products ADD COLUMN subcategory TEXT;
    
    -- Add index for better query performance
    CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
    
    -- Add composite index for category + subcategory queries
    CREATE INDEX IF NOT EXISTS idx_products_category_subcategory ON products(category, subcategory);
  END IF;
END $$;

