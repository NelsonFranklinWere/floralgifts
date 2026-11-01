/** Canonical site URL: the non-www host. proxy.ts redirects www pages here. */
export const SEO_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const SEO_BRAND = "Floral Whispers Gifts";
export const SEO_BRAND_SUFFIX = "Floral Whispers";
/** Pages supply complete titles, so the template adds nothing. */
export const SEO_TITLE_TEMPLATE = "%s";

const SEO_TITLE_MAX = 60;
const BRAND_TAIL = /\s*[|–—-]\s*(?:Whispers Floral|Floral Whispers)[^|]*$/i;

/** Build absolute canonical URL from a pathname (e.g. `/collections/flowers`). */
export function canonicalUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const clean = normalized.replace(/\/+$/, "") || "/";
  return clean === "/" ? SEO_BASE_URL : `${SEO_BASE_URL}${clean}`;
}

/** Cut at a natural break where possible, otherwise at a word. */
function shortenSeoTitle(name: string): string {
  const head = name.split(/\s+[|–—]\s+|:\s+/)[0].trim();
  if (head.length >= 20 && head.length <= SEO_TITLE_MAX) return head;
  return name
    .slice(0, SEO_TITLE_MAX + 1)
    .replace(/\s+\S*$/, "")
    .replace(/[\s,&|–—-]+$/, "");
}

/** Build `[Name] | Floral Whispers`, dropping the brand when the name needs the room. */
export function formatSeoTitle(pageName: string): string {
  let name = pageName.trim();
  while (BRAND_TAIL.test(name)) name = name.replace(BRAND_TAIL, "").trim();
  const withBrand = (value: string) => `${value} | ${SEO_BRAND_SUFFIX}`;
  if (withBrand(name).length <= SEO_TITLE_MAX) return withBrand(name);
  if (name.length <= SEO_TITLE_MAX) return name;
  const short = shortenSeoTitle(name);
  return withBrand(short).length <= SEO_TITLE_MAX ? withBrand(short) : short;
}
