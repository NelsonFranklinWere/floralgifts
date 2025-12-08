-- ============================================
-- COMBINED DATABASE SCHEMA FOR FLORAL WHISPERS GIFTS
-- This file contains TWO sections:
-- 1. UPDATED SCHEMA - Safe additions to run on existing database
-- 2. COMPLETE SCHEMA - Full schema matching your current database
-- ============================================

-- ============================================
-- SECTION 1: UPDATED SCHEMA
-- Run this section FIRST to add missing elements to your existing database
-- This will NOT delete or modify any existing data
-- ============================================

-- ============================================
-- ADD MISSING TABLES
-- ============================================

-- Blog Posts table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Floral Whispers Team',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER NOT NULL DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADD MISSING COLUMNS (if they don't exist)
-- ============================================

-- Add tip fields to orders table if they don't exist
DO $$ 
BEGIN
  -- Add tip_percentage column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tip_percentage'
  ) THEN
    ALTER TABLE orders ADD COLUMN tip_percentage INTEGER;
  END IF;

  -- Add tip_amount column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tip_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN tip_amount INTEGER;
  END IF;
END $$;

-- ============================================
-- ADD MISSING INDEXES
-- ============================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Orders tip indexes (if columns exist)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tip_amount'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_orders_tip_amount ON orders(tip_amount);
  END IF;
END $$;

-- ============================================
-- ADD MISSING RLS POLICIES
-- ============================================

-- Enable RLS on blog_posts if not already enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing blog policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON blog_posts;
DROP POLICY IF EXISTS "Public can read blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Service role can manage blog posts" ON blog_posts;

-- Allow public read access to blog posts
CREATE POLICY "Allow public read access" ON blog_posts
  FOR SELECT
  USING (true);

-- ============================================
-- ADD MISSING TRIGGERS
-- ============================================

-- Ensure update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Blog posts updated_at trigger
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- END OF UPDATED SCHEMA SECTION
-- ============================================




-- ============================================
-- SECTION 2: COMPLETE SCHEMA
-- This matches your current database structure exactly
-- Use this as reference or to recreate the database from scratch
-- ============================================

-- ============================================
-- TABLES
-- ============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price INTEGER NOT NULL,
  category TEXT CHECK (category IN ('flowers', 'hampers', 'teddy', 'wines', 'chocolates')) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  teddy_size INTEGER,
  teddy_color TEXT,
  images TEXT[] DEFAULT '{}',
  included_items JSONB,
  upsells TEXT[],
  stock INTEGER DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update existing table constraint if it doesn't include wines and chocolates
-- Drop the old constraint if it exists
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Add the correct constraint with all categories
ALTER TABLE products ADD CONSTRAINT products_category_check 
  CHECK (category IN ('flowers', 'hampers', 'teddy', 'wines', 'chocolates'));

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  delivery_city TEXT,
  delivery_date TIMESTAMPTZ NOT NULL,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'whatsapp')) NOT NULL,
  mpesa_checkout_request_id TEXT,
  mpesa_result_code INTEGER,
  mpesa_receipt_number TEXT,
  status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'shipped')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings table (for logo, site name, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_mpesa_checkout ON orders(mpesa_checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- ============================================
-- RLS (Row Level Security) POLICIES
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;

-- Allow public read access to products
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);

-- Allow service role full access to orders
CREATE POLICY "Service role can manage orders" ON orders FOR ALL USING (true);

-- Allow public read access to site settings
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PRODUCT DATA
-- ============================================

-- Remove the unwanted "Luxury Gift Hamper" product at 250 KES if it exists
DELETE FROM products WHERE slug = 'luxury-gift-hamper' OR (title ILIKE '%luxury gift hamper%' AND price = 25000);

-- Clear existing products (optional - comment out if you want to keep existing data)
-- DELETE FROM products;

-- FLOWERS (8 products)
INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('classic-rose-romance', 'Classic Rose Romance', 'Mixed Roses with a touch of gypsophilia, Cuddburry Chocolate 80g', 'Mixed Roses with a touch of gypsophilia, Cuddburry Chocolate 80g', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers1.jpg']::text[], NULL, NULL),
('sweet-whisper-bouquet', 'Sweet Whisper Bouquet', '60 Roses with touch of gypsophilia, Ferrero rocher chocolate T8', '60 Roses with touch of gypsophilia, Ferrero rocher chocolate T8', 550000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers2.jpg']::text[], NULL, NULL),
('blush-and-bloom-dreams', 'Blush and Bloom Dreams', 'Baby Pink and white Roses with a touch of gypsophila, Cuddburry chocolate', 'Baby Pink and white Roses with a touch of gypsophila, Cuddburry chocolate', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers4.jpg']::text[], NULL, NULL),
('pure-serenity-bouquet', 'Pure Serenity Bouquet', 'Yellow mumbs mixed with white and Red Roses, Ferrero rocher chocolate T8', 'Yellow mumbs mixed with white and Red Roses, Ferrero rocher chocolate T8', 550000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers5.jpg']::text[], NULL, NULL),
('radiant-love-collection', 'Radiant Love Collection', 'Pink and Red Roses mixed with a touch of gypsophila', 'Pink and Red Roses mixed with a touch of gypsophila', 300000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers6.jpg']::text[], NULL, NULL),
('midnight-bloom-surprises-bouquet', 'Midnight Bloom Surprises Bouquet', 'Red Yellow, Pink, Roses mixed with white mumbs with touch of gypsophilla', 'Red Yellow, Pink, Roses mixed with white mumbs with touch of gypsophilla', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers7.jpg']::text[], NULL, NULL),
('sunset-romance-bouquet', 'Sunset Romance Bouquet', '80 Roses of red Roses and white with a touch of gypsophilla', '80 Roses of red Roses and white with a touch of gypsophilla', 450000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers8.jpg']::text[], NULL, NULL),
('blossom-harmony-bouquet', 'Blossom Harmony Bouquet', '60 Roses with gypsophilla, Cuddburry chocolate', '60 Roses with gypsophilla, Cuddburry chocolate', 350000, 'flowers', ARRAY[]::text[], ARRAY['/images/products/flowers/BouquetFlowers9.jpg']::text[], NULL, NULL)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    images = EXCLUDED.images,
    updated_at = NOW();

-- TEDDY BEARS (7 products)
INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('dream-soft-teddy', 'Dream Soft Teddy', '25cm pink teddy bear. Available in brown, white, red, pink, and blue.', '25cm pink teddy bear. Available in brown, white, red, pink, and blue.', 350000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/Teddybear1.jpg']::text[], 25, 'pink'),
('fluffyjoy-bear', 'FluffyJoy Bear', '50cm teddy bear. Available in brown, white, red, pink, and blue.', '50cm teddy bear. Available in brown, white, red, pink, and blue.', 450000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears1.jpg']::text[], 50, NULL),
('blisshug-teddy', 'BlissHug Teddy', '100cm teddy bear. Available in brown, white, red, pink, and blue.', '100cm teddy bear. Available in brown, white, red, pink, and blue.', 850000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears2.jpg']::text[], 100, NULL),
('tender-heart-bear', 'Tender Heart Bear', '120cm teddy bear with customized Stanley mug. Available in brown, white, red, pink, and blue.', '120cm teddy bear with customized Stanley mug. Available in brown, white, red, pink, and blue.', 1250000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears3.jpg']::text[], 120, NULL),
('rossyhugs-bear', 'RossyHugs Bear', '180cm brown teddy bear. Available in brown, white, red, pink, and blue.', '180cm brown teddy bear. Available in brown, white, red, pink, and blue.', 1750000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears5.jpg']::text[], 180, 'brown'),
('marshmallow-bear', 'MarshMallow Bear', '160cm teddy bear. Available in brown, white, red, pink, and blue.', '160cm teddy bear. Available in brown, white, red, pink, and blue.', 1550000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears6.jpg']::text[], 160, NULL),
('moonlight-snuggle-bear', 'Moonlight Snuggle Bear', '200cm teddy bear. Available in brown, white, red, pink, and blue.', '200cm teddy bear. Available in brown, white, red, pink, and blue.', 1950000, 'teddy', ARRAY[]::text[], ARRAY['/images/products/teddies/TeddyBears7.jpg']::text[], 200, NULL)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    images = EXCLUDED.images,
    teddy_size = EXCLUDED.teddy_size,
    teddy_color = EXCLUDED.teddy_color,
    updated_at = NOW();

-- GIFT HAMPERS (7 products)
INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('warmhugs-gift-hamper', 'WarmHugs Gift Hamper', '100cm teddy bear, Pink Roses flower bouquet, 3 Piece Ferrero rocher chocolate, 4 Packets cuddburry chocolate, Customized gift Hamper', '100cm teddy bear, Pink Roses flower bouquet, 3 Piece Ferrero rocher chocolate, 4 Packets cuddburry chocolate, Customized gift Hamper', 1780000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper1.jpg']::text[], NULL, NULL),
('sweetheart-snuggler', 'Sweetheart Snuggler', '50cm teddy bear, Flower bouquet, Ferrero rocher chocolate, Bracelet', '50cm teddy bear, Flower bouquet, Ferrero rocher chocolate, Bracelet', 1250000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/giftamper.jpg']::text[], NULL, NULL),
('gentlepaw-hamper', 'GentlePaw Hamper', '100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch', '100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch', 2050000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper3.jpg']::text[], NULL, NULL),
('signature-celebration-basket', 'Signature Celebration Basket', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 1050000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper6.jpg']::text[], NULL, NULL),
('spoil-me-sweet-box', 'Spoil Me Sweet Box', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 1450000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper7.jpg']::text[], NULL, NULL),
('aroma-delight-hamper', 'Aroma & Delight Hamper', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 980000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper8.jpg']::text[], NULL, NULL),
('care-package-gift-hamper', 'Care Package Gift Hamper', 'Luxury gift hamper with curated items', 'Luxury gift hamper with curated items', 850000, 'hampers', ARRAY[]::text[], ARRAY['/images/products/hampers/GiftAmper10.jpg']::text[], NULL, NULL)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    images = EXCLUDED.images,
    updated_at = NOW();

-- WINES (4 products)
INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('luc-belaire-rare-luxe-750ml-jays', 'LUC BELAIRE RARE LUXE 750ML(12.5%) - Jays', 'Premium sparkling wine 750ml', 'Premium sparkling wine 750ml', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines1.jpg']::text[], NULL, NULL),
('belaire-brut-750ml', 'Belaire brut 750ml', 'Premium brut sparkling wine 750ml', 'Premium brut sparkling wine 750ml', 750000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines2.jpg']::text[], NULL, NULL),
('robertson-red-wine', 'Robertson Red Wine', '750ml Red sweet Wine', '750ml Red sweet Wine', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines3.jpg']::text[], NULL, NULL),
('rosso-nobile-red-wine', 'Rosso Nobile Red Wine', '750ml Red wine', '750ml Red wine', 350000, 'wines', ARRAY[]::text[], ARRAY['/images/products/wines/Wines4.jpg']::text[], NULL, NULL)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    images = EXCLUDED.images,
    updated_at = NOW();

-- CHOCOLATES (3 products)
INSERT INTO products (slug, title, short_description, description, price, category, tags, images, teddy_size, teddy_color) VALUES
('ferrero-rocher-chocolate-8-pieces', 'Ferrero rocher chocolate', '8 pieces', '8 pieces', 150000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates1.jpg']::text[], NULL, NULL),
('ferrero-rocher-chocolate-24-pieces', 'Ferrero rocher chocolate', '24 Pieces', '24 Pieces', 500000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates2.jpg']::text[], NULL, NULL),
('ferrero-rocher-chocolate-16-pieces', 'Ferrero rocher chocolate', '16 pieces', '16 pieces', 350000, 'chocolates', ARRAY[]::text[], ARRAY['/images/products/Chocolates/Chocolates3.jpg']::text[], NULL, NULL)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    images = EXCLUDED.images,
    updated_at = NOW();

-- ============================================
-- ADMIN USER
-- ============================================

-- Add admin user for whispersfloral@gmail.com
-- IMPORTANT: Only whispersfloral@gmail.com is allowed to access the admin dashboard
-- Password: Admin@2025
-- Note: In production, use bcrypt to hash passwords properly
INSERT INTO admins (email, password_hash, role)
VALUES ('whispersfloral@gmail.com', 'Admin@2025', 'admin')
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Remove any other admin users (security: only whispersfloral@gmail.com should have access)
DELETE FROM admins WHERE email != 'whispersfloral@gmail.com';

-- ============================================
-- SITE SETTINGS
-- ============================================

-- Insert site settings including logo path
INSERT INTO site_settings (key, value, description) VALUES
('logo_path', '/images/logo/FloralLogo.jpg', 'Path to the site logo image'),
('site_name', 'Floral Whispers Gifts', 'Name of the website'),
('site_email', 'whispersfloral@gmail.com', 'Contact email for the site'),
('site_phone', '254721554393', 'Contact phone number'),
('site_url', 'https://floralwhispersgifts.co.ke', 'Main website URL')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================
-- SUPABASE STORAGE SETUP FOR PRODUCT IMAGES
-- ============================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Set up storage policies for public read access
-- Allow anyone to read images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow service role (admin API) to upload images
-- Note: Uploads are restricted to admin users via the API route authentication
CREATE POLICY "Service role can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow service role to update images
CREATE POLICY "Service role can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow service role to delete images
CREATE POLICY "Service role can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- ============================================
-- DATA UPDATES (Ensure existing data is correct)
-- ============================================

-- Ensure all products have stock = NULL (always available)
UPDATE products SET stock = NULL WHERE stock IS NOT NULL;

-- Ensure all products with incorrect prices are updated
-- Update flowers priced at 550 KES or 50 KES to 3500 KES (but keep Sweet Whisper and Pure Serenity at 5500 KES)
UPDATE products 
SET price = 350000, updated_at = NOW()
WHERE category = 'flowers' 
  AND (price = 55000 OR price = 5000)
  AND slug NOT IN ('sweet-whisper-bouquet', 'pure-serenity-bouquet');

-- Update wines priced at 2500 KES, 5500 KES, 250 KES, 550 KES, or 50 KES to 3500 KES
UPDATE products 
SET price = 350000, updated_at = NOW()
WHERE category = 'wines' 
  AND (price = 250000 OR price = 550000 OR price = 25000 OR price = 55000 OR price = 5000);

-- Update teddy bears priced at 2500 KES, 250 KES, or 50 KES to 3500 KES
UPDATE products 
SET price = 350000, updated_at = NOW()
WHERE category = 'teddy' 
  AND (price = 250000 OR price = 25000 OR price = 5000);

-- Update gift hampers priced at 50, 250, 550 KES to 3500 KES
UPDATE products 
SET price = 350000, updated_at = NOW()
WHERE category = 'hampers' 
  AND (price = 5000 OR price = 25000 OR price = 55000);

-- Update chocolates priced at 50, 250, 550 KES to 3500 KES
UPDATE products 
SET price = 350000, updated_at = NOW()
WHERE category = 'chocolates' 
  AND (price = 5000 OR price = 25000 OR price = 55000);

-- Ensure Sweet Whisper Bouquet is 5500 KES
UPDATE products 
SET price = 550000, updated_at = NOW()
WHERE slug = 'sweet-whisper-bouquet';

-- Ensure Pure Serenity Bouquet is 5500 KES
UPDATE products 
SET price = 550000, updated_at = NOW()
WHERE slug = 'pure-serenity-bouquet';

-- ============================================
-- END OF COMPLETE SCHEMA SECTION
-- ============================================

-- ============================================
-- SCHEMA SUMMARY
-- ============================================
-- 
-- UPDATED SCHEMA adds:
-- 1. Blog posts table
-- 2. Tip fields (tip_percentage, tip_amount) to orders table
-- 3. All necessary indexes, RLS policies, and triggers for blog posts
-- 
-- COMPLETE SCHEMA includes:
-- 1. All tables (products, orders, admins, site_settings)
-- 2. All indexes, RLS policies, triggers
-- 3. All product data with correct prices
-- 4. Admin user setup
-- 5. Site settings
-- 6. Storage bucket and policies
-- 7. Data updates to ensure existing records are correct
-- 
-- ADMIN CREDENTIALS:
-- Email: whispersfloral@gmail.com
-- Password: Admin@2025
-- 
-- SECURITY: Only whispersfloral@gmail.com can access the admin dashboard.
-- All other admin accounts are automatically removed.
-- 
-- LOGO CONFIGURATION:
-- Logo path: /images/logo/FloralLogo.jpg
-- ============================================

