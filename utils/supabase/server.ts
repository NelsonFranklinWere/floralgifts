import { supabaseAdmin } from "@/lib/supabase";

// Simple wrapper so other modules can call createClient() as in the spec.
export function createClient() {
  return supabaseAdmin;
}

