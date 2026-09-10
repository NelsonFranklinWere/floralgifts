import type { Product } from "@/lib/db";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

const PREDEFINED_CATEGORIES = [
  "flowers",
  "wines",
  "chocolates",
  "hampers",
  "teddy",
  "cards",
  "cakes",
] as const;

/**
 * All catalog products (DB + predefined placeholders) de-duplicated by slug.
 * Used by search + recipient gift pages so every category is searchable.
 */
export async function getAllCatalogProducts(): Promise<Product[]> {
  const dbProducts = await getProducts({});
  const dbSlugs = new Set(dbProducts.map((p) => p.slug));

  const predefined: Product[] = [];
  for (const cat of PREDEFINED_CATEGORIES) {
    for (const p of getPredefinedProducts(cat)) {
      if (!dbSlugs.has(p.slug)) {
        predefined.push(p);
        dbSlugs.add(p.slug);
      }
    }
  }

  return [...dbProducts, ...predefined];
}
