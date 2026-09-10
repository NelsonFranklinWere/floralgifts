import { getSaleProducts } from "@/lib/db";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke"
).replace(/\/$/, "");

const BRAND = "Floral Whispers Gifts";

function csvEscape(value: string): string {
  const cleaned = (value || "").replace(/\r?\n+/g, " ").trim();
  return `"${cleaned.replace(/"/g, '""')}"`;
}

function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function formatKes(amountCents: number): string {
  return `${(amountCents / 100).toFixed(2)} KES`;
}

/** Meta Catalog CSV — all products in the admin sale catalog (no 20-item cap). */
export async function buildMetaCatalogCsv(): Promise<string> {
  const products = await getSaleProducts();

  const header = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "sale_price",
    "link",
    "image_link",
    "brand",
    "item_group_id",
  ].join(",");

  const rows = products
    .filter((p) => p.images && p.images.length > 0)
    .map((p) => {
      const availability =
        p.stock !== null && p.stock !== undefined && p.stock <= 0
          ? "out of stock"
          : "in stock";
      const description = p.description || p.short_description || p.title;

      return [
        csvEscape(p.id),
        csvEscape(p.title),
        csvEscape(description),
        csvEscape(availability),
        csvEscape("new"),
        csvEscape(formatKes(p.price)),
        "", // sale_price — add when product has a promo price
        csvEscape(`${BASE_URL}/product/${p.slug}`),
        csvEscape(absoluteUrl(p.images[0])),
        csvEscape(BRAND),
        csvEscape(p.slug),
      ].join(",");
    });

  return [header, ...rows].join("\n");
}

export const META_CATALOG_FEED_HEADERS = {
  "Content-Type": "text/csv; charset=utf-8",
  "Content-Disposition": 'inline; filename="meta.csv"',
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};
