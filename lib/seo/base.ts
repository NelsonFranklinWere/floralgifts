/** Canonical site URL — always www. */
export const SEO_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const SEO_BRAND = "Floral Whispers Gifts";
export const SEO_BRAND_SUFFIX = "Floral Whispers Gifts Nairobi";
export const SEO_TITLE_TEMPLATE = `%s | ${SEO_BRAND_SUFFIX}`;

/** Build absolute canonical URL from a pathname (e.g. `/collections/flowers`). */
export function canonicalUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const clean = normalized.replace(/\/+$/, "") || "/";
  return clean === "/" ? SEO_BASE_URL : `${SEO_BASE_URL}${clean}`;
}

/** Enforce `[Name] | Floral Whispers Gifts Nairobi` title format. */
export function formatSeoTitle(pageName: string): string {
  const trimmed = pageName.trim();
  if (trimmed.includes("|")) return trimmed;
  return `${trimmed} | ${SEO_BRAND_SUFFIX}`;
}
