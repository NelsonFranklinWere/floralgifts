-- Staff Admin Panel schema extensions

-- Extend admins table for staff roles
ALTER TABLE admins ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS last_login_ip TEXT;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ;

-- Normalize roles: super_admin (full) | staff (limited)
UPDATE admins SET role = 'super_admin' WHERE role = 'admin' OR role IS NULL;

-- Staff audit logs
CREATE TABLE IF NOT EXISTS staff_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  staff_email TEXT NOT NULL,
  staff_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_audit_logs_created ON staff_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_audit_logs_staff ON staff_audit_logs(staff_email);

-- Login audit
CREATE TABLE IF NOT EXISTS staff_login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product extensions
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'published';
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;

-- Product variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  sku TEXT,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom categories (display names)
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO product_categories (slug, name, sort_order) VALUES
  ('flowers', 'Flower Bouquets', 1),
  ('teddy', 'Teddy Bears', 2),
  ('hampers', 'Gift Hampers', 3),
  ('chocolates', 'Chocolates', 4),
  ('wines', 'Wines', 5),
  ('cakes', 'Cakes', 6),
  ('cards', 'Cards', 7)
ON CONFLICT (slug) DO NOTHING;

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_delivery')),
  discount_value INTEGER NOT NULL DEFAULT 0,
  min_order_value INTEGER DEFAULT 0,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  total_discount_given INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery zones
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  fee INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO delivery_zones (name, fee, sort_order) VALUES
  ('CBD', 500, 1),
  ('Westlands', 600, 2),
  ('Karen', 800, 3),
  ('Lavington', 700, 4),
  ('Kilimani', 600, 5),
  ('Parklands', 600, 6),
  ('Runda', 900, 7),
  ('Kileleshwa', 700, 8)
ON CONFLICT DO NOTHING;

-- Delivery personnel
CREATE TABLE IF NOT EXISTS delivery_personnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order extensions for staff workflow
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES delivery_personnel(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_time TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS special_instructions TEXT;

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
  staff_reply TEXT,
  replied_at TIMESTAMPTZ,
  replied_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer notes (keyed by email)
CREATE TABLE IF NOT EXISTS customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,
  note TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocked_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT UNIQUE NOT NULL,
  reason TEXT,
  blocked_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp notification log
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Featured homepage sections
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  product_ids TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO homepage_sections (section_key, title) VALUES
  ('featured_flowers', 'Featured Flowers'),
  ('featured_hampers', 'Featured Gift Hampers'),
  ('featured_teddies', 'Featured Teddy Bears')
ON CONFLICT (section_key) DO NOTHING;
