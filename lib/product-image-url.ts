/**
 * Supabase storage image URLs — sized WebP variants for fast storefront loads.
 * Served from Supabase CDN (not the DigitalOcean app) to keep the droplet CPU low.
 */

const SUPABASE_OBJECT_PREFIX = "/storage/v1/object/public/";
const SUPABASE_RENDER_PREFIX = "/storage/v1/render/image/public/";

export type ProductImageVariant = "card" | "thumb" | "cart" | "detail" | "zoom" | "hero";

/** Width/height tuned to actual UI slots — smaller payloads, faster loads. */
const VARIANT_PRESETS: Record<
  ProductImageVariant,
  { width: number; height?: number; quality: number; resize: "contain" | "cover" }
> = {
  thumb: { width: 96, height: 96, quality: 58, resize: "cover" },
  cart: { width: 128, height: 128, quality: 60, resize: "cover" },
  card: { width: 360, height: 360, quality: 65, resize: "cover" },
  detail: { width: 800, quality: 72, resize: "cover" },
  zoom: { width: 1200, quality: 78, resize: "contain" },
  hero: { width: 1200, quality: 75, resize: "cover" },
};

export function isSupabaseStorageUrl(url: string): boolean {
  if (!url?.trim()) return false;
  try {
    return new URL(url.trim()).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

/** Skip Next.js image optimizer — Supabase already resizes; avoids CPU + double fetch on DO. */
export function shouldBypassNextImageOptimizer(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return false;
  return isSupabaseStorageUrl(src);
}

export function toSupabaseObjectUrl(url: string): string {
  if (!url.includes(SUPABASE_RENDER_PREFIX)) return url;
  return url.replace(SUPABASE_RENDER_PREFIX, SUPABASE_OBJECT_PREFIX).split("?")[0] ?? url;
}

export function getOptimizedProductImageUrl(
  url: string | undefined | null,
  variant: ProductImageVariant = "card"
): string {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return trimmed;
  if (!isSupabaseStorageUrl(trimmed)) return trimmed;

  const { width, height, quality, resize } = VARIANT_PRESETS[variant];

  let renderBase = trimmed;
  if (trimmed.includes(SUPABASE_OBJECT_PREFIX)) {
    renderBase = trimmed.replace(SUPABASE_OBJECT_PREFIX, SUPABASE_RENDER_PREFIX);
  } else if (!trimmed.includes(SUPABASE_RENDER_PREFIX)) {
    return trimmed;
  }

  const pathOnly = renderBase.split("?")[0] ?? renderBase;
  const heightParam = height ? `&height=${height}` : "";
  return `${pathOnly}?width=${width}${heightParam}&quality=${quality}&resize=${resize}&format=webp`;
}

export function getProductThumbnailUrl(url: string | undefined | null): string {
  return getOptimizedProductImageUrl(url, "thumb");
}

export function getProductDetailImageUrl(url: string | undefined | null): string {
  return getOptimizedProductImageUrl(url, "detail");
}

export function mapProductImages(
  images: string[] | undefined | null,
  variant: ProductImageVariant
): string[] {
  if (!images?.length) return [];
  return images.map((img) => getOptimizedProductImageUrl(img, variant));
}
