/**
 * Strips location/SEO suffixes from product titles for clean H1 display.
 * Location intent belongs in meta descriptions, not visible headings.
 */

const TITLE_SUFFIX_PATTERNS = [
  /\s*\|\s*floral whispers gifts.*$/i,
  /\s*[-–—|]\s*(premium\s+)?flower delivery nairobi.*$/i,
  /\s*[-–—|]\s*(premium\s+)?gift delivery nairobi.*$/i,
  /\s*[-–—|]\s*pink roses?,?\s*red roses?,?\s*white flowers?.*$/i,
  /\s*[-–—|]\s*.*\bnairobi\b.*$/i,
  /\s*[-–—|]\s*same[- ]day delivery.*$/i,
  /\s*\(\s*nairobi\s*\)$/i,
];

export function cleanProductTitle(title: string): string {
  let result = title.trim();
  let prev = "";
  while (prev !== result) {
    prev = result;
    for (const pattern of TITLE_SUFFIX_PATTERNS) {
      result = result.replace(pattern, "").trim();
    }
  }
  return result || title.trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const CATEGORY_INTENT: Record<string, string> = {
  flowers: "Same-day flower delivery across Nairobi CBD, Westlands, Karen & Lavington.",
  teddy: "Cuddly teddy bear gifts with same-day Nairobi delivery.",
  hampers: "Luxury gift hampers delivered same-day across Nairobi.",
  wines: "Premium wine gifts with Nairobi same-day delivery.",
  chocolates: "Premium chocolates delivered same-day in Nairobi.",
  cards: "Gift cards for every occasion — Nairobi delivery available.",
  cakes: "Celebration cakes with same-day Nairobi delivery.",
};

/** Meta description: clean product copy + location intent (max ~160 chars). */
export function buildProductMetaDescription(product: {
  title: string;
  short_description?: string | null;
  description?: string | null;
  category?: string;
}): string {
  const name = cleanProductTitle(product.title);
  const body =
    product.short_description?.trim() ||
    stripHtml(product.description || "").slice(0, 100) ||
    name;
  const intent = CATEGORY_INTENT[product.category || ""] || CATEGORY_INTENT.flowers;
  const combined = `${body} ${intent}`;
  return combined.length > 160 ? `${combined.slice(0, 157)}…` : combined;
}

/** Strict SEO title: `[Clean Name] | Floral Whispers Gifts Nairobi` */
export function buildProductSeoTitle(title: string): string {
  return `${cleanProductTitle(title)} | Floral Whispers Gifts Nairobi`;
}
