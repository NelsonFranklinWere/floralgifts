/**
 * Enable Supabase Realtime for staff admin (orders + contact_messages).
 * Run: node scripts/enable-realtime.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env");

function loadEnv() {
  const vars = {};
  const text = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx < 1) continue;
    vars[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return vars;
}

const SQL = `
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
`;

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

console.log("Enabling Supabase Realtime for orders + contact_messages...");

const { error } = await supabase.rpc("exec_sql", { sql: SQL });

if (error) {
  console.error("exec_sql failed:", error.message);
  console.log("\nRun this SQL manually in Supabase → SQL Editor:\n");
  console.log(SQL);
  process.exit(1);
}

console.log("Realtime enabled successfully.");
console.log("Staff dashboard will now receive live order and message updates.");
