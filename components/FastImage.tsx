/**
 * Drop-in native <img> for pages still importing next/image.
 * Supabase URLs are resized on CDN; local /images/* served as static files.
 */
export { default } from "./OptimizedImage";
