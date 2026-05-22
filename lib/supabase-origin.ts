/** Origin for Supabase storage — used in layout preconnect for faster image loads */
export function getSupabaseOrigin(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url?.startsWith("http")) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}
