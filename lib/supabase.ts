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

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_") || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your_")) {
  if (typeof window === "undefined") {
    console.warn("⚠️  Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  }
}

// Only create client if we have valid URLs
let supabase: ReturnType<typeof createClient>;
let supabaseAdmin: ReturnType<typeof createClient>;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your_") 
      ? process.env.SUPABASE_SERVICE_ROLE_KEY 
      : supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  // Create a dummy client that will fail gracefully
  supabase = createClient("https://placeholder.supabase.co", "placeholder-key");
  supabaseAdmin = createClient("https://placeholder.supabase.co", "placeholder-key");
}

export { supabase, supabaseAdmin };

