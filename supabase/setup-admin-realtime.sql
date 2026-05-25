-- Paste this entire file once in Supabase → SQL Editor → Run
-- Enables live admin dashboard (orders + messages) and optional exec_sql helper

-- 1) Realtime publication (instant live updates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contact_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
  END IF;
END $$;

-- 2) Optional: run migrations from the app (npm run staff:realtime)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

REVOKE ALL ON FUNCTION public.exec_sql(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
