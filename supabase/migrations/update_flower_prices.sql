-- ============================================
-- UPDATE FLOWER PRICES
-- ============================================
-- Update Sweet Whisper Bouquet and Pure Serenity Bouquet to 5500 KES
-- ============================================

-- Update Sweet Whisper Bouquet to 5500 KES (550000 cents)
UPDATE products 
SET price = 550000, updated_at = NOW()
WHERE slug = 'sweet-whisper-bouquet';

-- Update Pure Serenity Bouquet to 5500 KES (550000 cents)
UPDATE products 
SET price = 550000, updated_at = NOW()
WHERE slug = 'pure-serenity-bouquet';

-- Verify the updates
SELECT 
  slug, 
  title, 
  price, 
  price / 100 as price_kes
FROM products 
WHERE slug IN ('sweet-whisper-bouquet', 'pure-serenity-bouquet')
ORDER BY slug;

