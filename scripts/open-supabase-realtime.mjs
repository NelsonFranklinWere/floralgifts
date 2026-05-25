/**
 * Opens Supabase publications page for enabling Realtime toggles.
 * Run: node scripts/open-supabase-realtime.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env");
const text = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
const urlMatch = text.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const url = urlMatch?.[1]?.trim();
const ref = url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!ref) {
  console.error("Could not read project ref from .env");
  process.exit(1);
}

const target = `https://supabase.com/dashboard/project/${ref}/database/publications`;
console.log("Opening:", target);
console.log("Toggle ON: orders, contact_messages under supabase_realtime");

const cmd =
  process.platform === "win32" ? `start "" "${target}"` : process.platform === "darwin" ? `open "${target}"` : `xdg-open "${target}"`;

exec(cmd);
