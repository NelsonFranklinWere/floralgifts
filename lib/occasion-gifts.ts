import type { Product } from "@/lib/db";

export type GiftOccasion =
  | "graduation"
  | "wedding"
  | "valentines"
  | "corporate";

export const GIFT_OCCASIONS: {
  id: GiftOccasion;
  label: string;
  shortLabel: string;
  href: string;
  description: string;
}[] = [
  {
    id: "graduation",
    label: "Graduation Gifts",
    shortLabel: "Graduation",
    href: "/collections/graduation",
    description:
      "Celebrate Form Four results, university and college graduation with flowers, teddy bears and hampers.",
  },
  {
    id: "wedding",
    label: "Wedding Gifts",
    shortLabel: "Wedding",
    href: "/collections/wedding",
    description:
      "Wedding and bridal gifts — bouquets, hampers and premium wine sets for the couple.",
  },
  {
    id: "valentines",
    label: "Valentine's Gifts",
    shortLabel: "Valentines",
    href: "/collections/valentines",
    description:
      "Romantic Valentine's gifts — roses, teddy bears, chocolates and love-ready hampers for Nairobi.",
  },
  {
    id: "corporate",
    label: "Corporate Gifts",
    shortLabel: "Corporate",
    href: "/collections/corporate",
    description:
      "Office, client and colleague gifts — professional hampers, wine and floral sets for business.",
  },
];

const EXPLICIT: Record<GiftOccasion, string[]> = {
  graduation: [
    "graduation",
    "graduate",
    "graduates",
    "grad",
    "form four",
    "form 4",
    "form-four",
    "class of",
    "convocation",
    "degree",
    "alumni",
    "kcse",
  ],
  wedding: [
    "wedding",
    "weddings",
    "bridal",
    "bride",
    "groom",
    "nuptial",
    "marriage",
    "matrimony",
    "engagement",
    "engaged",
    "hen party",
    "bachelor",
  ],
  valentines: [
    "valentine",
    "valentines",
    "valentine's",
    "valentines day",
    "romantic",
    "romance",
    "love",
    "lover",
    "red rose",
    "red roses",
    "heart",
  ],
  corporate: [
    "corporate",
    "office",
    "company",
    "colleague",
    "colleagues",
    "business",
    "client",
    "clients",
    "executive",
    "boardroom",
    "staff",
    "workplace",
    "professional",
  ],
};

function productText(product: Product): string {
  const tags = (product.tags || []).join(" ");
  return [
    product.title || "",
    product.description || "",
    product.short_description || "",
    product.subcategory || "",
    product.category || "",
    tags,
  ]
    .join(" ")
    .toLowerCase();
}

function hasPhrase(text: string, phrase: string): boolean {
  if (phrase.includes(" ")) return text.includes(phrase);
  const re = new RegExp(
    `(^|[^a-z])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`,
    "i"
  );
  return re.test(text);
}

function explicitHit(text: string, occasion: GiftOccasion): boolean {
  return EXPLICIT[occasion].some((p) => hasPhrase(text, p));
}

/**
 * Product suitability for an occasion across all categories.
 * Explicit tags/title keywords win; otherwise category defaults keep listings full.
 */
export function productMatchesOccasion(
  product: Product,
  occasion: GiftOccasion
): boolean {
  const text = productText(product);
  const category = String(product.category || "").toLowerCase();

  const hits = {
    graduation: explicitHit(text, "graduation"),
    wedding: explicitHit(text, "wedding"),
    valentines: explicitHit(text, "valentines"),
    corporate: explicitHit(text, "corporate"),
  };
  const hasAny = Object.values(hits).some(Boolean);

  if (hasAny) {
    return hits[occasion];
  }

  // Soft category defaults when untagged
  switch (occasion) {
    case "graduation":
      return (
        category === "flowers" ||
        category === "teddy" ||
        category === "hampers" ||
        category === "chocolates" ||
        category === "cakes" ||
        category === "cards"
      );
    case "wedding":
      return (
        category === "flowers" ||
        category === "hampers" ||
        category === "wines" ||
        category === "chocolates" ||
        category === "cakes"
      );
    case "valentines":
      return (
        category === "flowers" ||
        category === "teddy" ||
        category === "chocolates" ||
        category === "cakes" ||
        category === "cards" ||
        category === "hampers" ||
        (category === "wines" &&
          (hasPhrase(text, "rose") || hasPhrase(text, "romantic")))
      );
    case "corporate":
      return (
        category === "hampers" ||
        category === "wines" ||
        category === "flowers" ||
        category === "chocolates"
      );
    default:
      return false;
  }
}

export function filterProductsByOccasion(
  products: Product[],
  occasion: GiftOccasion
): Product[] {
  return products.filter((p) => productMatchesOccasion(p, occasion));
}

export function detectOccasionFromQuery(q: string): GiftOccasion | null {
  const t = q.trim().toLowerCase();
  if (!t) return null;
  if (
    /\b(graduation|graduate|form\s*four|form\s*4|convocation)\b/.test(t) ||
    /\bgifts?\s+for\s+grad/.test(t)
  ) {
    return "graduation";
  }
  if (/\b(wedding|bridal|bride|groom|nuptial|marriage|engagement)\b/.test(t)) {
    return "wedding";
  }
  if (
    /\b(valentine|valentines|valentine'?s|romantic)\b/.test(t) ||
    t.includes("valentine")
  ) {
    return "valentines";
  }
  if (
    /\b(corporate|office|colleague|business|client|executive)\b/.test(t) ||
    t.includes("corporate gift")
  ) {
    return "corporate";
  }
  return null;
}

export function getOccasionMeta(id: GiftOccasion) {
  return GIFT_OCCASIONS.find((o) => o.id === id)!;
}
