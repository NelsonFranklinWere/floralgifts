/**
 * Upsert primary admin: floral@gmail.com / Admin@123
 * Run: node scripts/upsert-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env");

function loadEnv() {
  const vars = {};
  try {
    const text = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx < 1) continue;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      vars[key] = val;
    }
  } catch (e) {
    console.error("Could not read .env:", e.message);
    process.exit(1);
  }
  return vars;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const EMAIL = "floral@gmail.com";
const PASSWORD = "Admin@123";
const ROLE = "super_admin";

const supabase = createClient(url, key);

const { data: existing, error: fetchErr } = await supabase
  .from("admins")
  .select("id, email")
  .eq("email", EMAIL)
  .maybeSingle();

if (fetchErr) {
  console.error("Fetch error:", fetchErr.message);
  process.exit(1);
}

let result;
if (existing) {
  result = await supabase
    .from("admins")
    .update({ password_hash: PASSWORD, role: ROLE, updated_at: new Date().toISOString() })
    .eq("email", EMAIL)
    .select("id, email, role")
    .single();
} else {
  result = await supabase
    .from("admins")
    .insert({ email: EMAIL, password_hash: PASSWORD, role: ROLE })
    .select("id, email, role")
    .single();
}

if (result.error) {
  console.error("Upsert failed:", result.error.message);
  process.exit(1);
}

console.log("Admin ready:", result.data);
console.log("Login at /staff/login with", EMAIL);
