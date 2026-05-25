-- Primary admin login: floral@gmail.com / Admin@123
INSERT INTO admins (email, password_hash, role)
VALUES ('floral@gmail.com', 'Admin@123', 'super_admin')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Optional columns from 011_staff_admin_panel.sql
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admins' AND column_name = 'is_active'
  ) THEN
    UPDATE admins SET is_active = true, name = COALESCE(name, 'Floral Admin')
    WHERE email = 'floral@gmail.com';
  END IF;
END $$;
