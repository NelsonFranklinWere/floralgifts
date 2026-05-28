import { createClient } from "@supabase/supabase-js";

// Get Supabase URL and validate it
const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.includes("your_") || url.includes("placeholder") || !url.startsWith("http")) {
    return "https://placeholder.supabase.co";
  }
  return url;
};

// Get Supabase anon key
const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key || key.includes("your_") || key.includes("placeholder")) {
    return "placeholder-key";
  }
  return key;
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

function isAdminKey(key: string | undefined): boolean {
  return !!key && (key.startsWith("eyJ") || key.startsWith("sb_secret_"));
}

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasValidServiceRole = isAdminKey(serviceRoleKey);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_") || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your_")) {
  if (typeof window === "undefined") {
    console.warn("⚠️  Supabase credentials not configured. Copy env_template.txt to .env.local and restart npm run dev.");
  }
}

if (typeof window === "undefined" && serviceRoleKey && !hasValidServiceRole) {
  console.warn(
    "⚠️  SUPABASE_SERVICE_ROLE_KEY must be the service_role key (JWT eyJ... or sb_secret_...) from Supabase Dashboard → Settings → API."
  );
}

type SupabaseClient = ReturnType<typeof createClient>;

const globalForSupabase = globalThis as typeof globalThis & {
  __floralSupabase?: SupabaseClient;
  __floralSupabaseAdmin?: SupabaseClient;
};

function createAnonClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}

function createAdminClient(): SupabaseClient {
  return createClient(
    supabaseUrl,
    hasValidServiceRole && serviceRoleKey && !serviceRoleKey.includes("your_")
      ? serviceRoleKey!
      : supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

let supabase: SupabaseClient;
let supabaseAdmin: SupabaseClient;

try {
  // Singleton — avoids GoTrue "Multiple instances" warnings during HMR.
  supabase = globalForSupabase.__floralSupabase ?? createAnonClient();
  globalForSupabase.__floralSupabase = supabase;

  // Service role client must never run in the browser bundle.
  if (typeof window === "undefined") {
    supabaseAdmin = globalForSupabase.__floralSupabaseAdmin ?? createAdminClient();
    globalForSupabase.__floralSupabaseAdmin = supabaseAdmin;
  } else {
    supabaseAdmin = supabase;
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  const placeholder = createClient("https://placeholder.supabase.co", "placeholder-key");
  supabase = placeholder;
  supabaseAdmin = placeholder;
}

export { supabase, supabaseAdmin };

