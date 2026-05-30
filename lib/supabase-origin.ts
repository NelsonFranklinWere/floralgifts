/** Supabase project origin for `<link rel="preconnect">` (CDN image loads). */
export function getSupabaseOrigin(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url || url.includes("your_") || url.includes("placeholder")) {
    return null;
  }
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}
