import type { Product } from "@/lib/db";

export type GiftRecipient = "mens" | "womens" | "kids";

export const GIFT_RECIPIENTS: {
  id: GiftRecipient;
  label: string;
  shortLabel: string;
  href: string;
  description: string;
}[] = [
  {
    id: "mens",
    label: "Gifts for Men",
    shortLabel: "Men",
    href: "/collections/mens",
    description:
      "Thoughtful gifts for him — wines, hampers, and present sets for dads, husbands, boyfriends and colleagues.",
  },
  {
    id: "womens",
    label: "Gifts for Women",
    shortLabel: "Women",
    href: "/collections/womens",
    description:
      "Beautiful gifts for her — flowers, hampers, teddy bears and chocolate sets for moms, wives and girlfriends.",
  },
  {
    id: "kids",
    label: "Gifts for Kids",
    shortLabel: "Kids",
    href: "/collections/kids",
    description:
      "Fun, age-friendly gifts for children — teddy bears, sweet treats and celebratory sets.",
  },
];

/** Tags / phrases that mark a product as intended for a recipient (any category). */
const EXPLICIT: Record<GiftRecipient, string[]> = {
  mens: [
    "men",
    "mens",
    "men's",
    "for him",
    "for-him",
    "forhim",
    "him",
    "gentleman",
    "gentlemen",
    "dad",
    "daddy",
    "father",
    "husband",
    "boyfriend",
    "groom",
    "brother",
    "male",
    "man",
    "uncle",
  ],
  womens: [
    "women",
    "womens",
    "women's",
    "for her",
    "for-her",
    "forher",
    "her",
    "lady",
    "ladies",
    "mum",
    "mom",
    "mother",
    "wife",
    "girlfriend",
    "bride",
    "sister",
    "female",
    "woman",
    "aunt",
  ],
  kids: [
    "kids",
    "kid",
    "child",
    "children",
    "boy",
    "girl",
    "baby",
    "toddler",
    "teen",
    "for kids",
    "for-kids",
    "for kids",
    "son",
    "daughter",
    "nursery",
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
  // word-ish boundary so "man" doesn't match "romantic"
  const re = new RegExp(
    `(^|[^a-z])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`,
    "i"
  );
  return re.test(text);
}

function explicitHit(text: string, recipient: GiftRecipient): boolean {
  return EXPLICIT[recipient].some((p) => hasPhrase(text, p));
}

/**
 * Whether a product can be gifted to this recipient.
 * Explicit tags/titles win; otherwise category defaults apply so pages stay stocked.
 * A product may match more than one recipient.
 */
export function productMatchesRecipient(
  product: Product,
  recipient: GiftRecipient
): boolean {
  const text = productText(product);
  const category = String(product.category || "").toLowerCase();

  // Alcohol never under kids
  if (recipient === "kids" && (category === "wines" || hasPhrase(text, "wine") || hasPhrase(text, "alcohol") || hasPhrase(text, "champagne") || hasPhrase(text, "whisky") || hasPhrase(text, "whiskey") || hasPhrase(text, "beer"))) {
    return false;
  }

  const hitMens = explicitHit(text, "mens");
  const hitWomens = explicitHit(text, "womens");
  const hitKids = explicitHit(text, "kids");
  const hasAnyExplicit = hitMens || hitWomens || hitKids;

  if (hasAnyExplicit) {
    if (recipient === "mens") return hitMens;
    if (recipient === "womens") return hitWomens;
    return hitKids;
  }

  // No explicit recipient tags → category / gift-type defaults (cross all categories)
  switch (category) {
    case "wines":
      return recipient === "mens" || recipient === "womens";
    case "teddy":
      // Soft toys suit everyone, especially kids and women
      return true;
    case "chocolates":
      return true;
    case "cakes":
      return true;
    case "cards":
      return true;
    case "hampers":
      // Wine-oriented hampers still ok for adults
      if (recipient === "kids") {
        return !(hasPhrase(text, "wine") || hasPhrase(text, "alcohol"));
      }
      return true;
    case "flowers":
      // Flowers primarily for women; fine for men (apology/thank-you) — rare for kids
      if (recipient === "kids") return false;
      return true;
    default:
      // Unknown categories included for men/women; not auto for kids
      return recipient !== "kids";
  }
}

export function filterProductsByRecipient(
  products: Product[],
  recipient: GiftRecipient
): Product[] {
  return products.filter((p) => productMatchesRecipient(p, recipient));
}

/** Parse free-text search / nav queries into a recipient when obvious. */
export function detectRecipientFromQuery(q: string): GiftRecipient | null {
  const t = q.trim().toLowerCase();
  if (!t) return null;
  if (
    /^(mens?|men's|for\s*him|him|gentleman|dad|father|husband|boyfriend)$/.test(t) ||
    /\b(gifts?\s+for\s+(men|him|dad|father|husband|boyfriend)|mens?\s+gifts?)\b/.test(t)
  ) {
    return "mens";
  }
  if (
    /^(womens?|women's|for\s*her|her|lady|mum|mom|mother|wife|girlfriend)$/.test(t) ||
    /\b(gifts?\s+for\s+(women|her|mum|mom|mother|wife|girlfriend)|womens?\s+gifts?)\b/.test(t)
  ) {
    return "womens";
  }
  if (
    /^(kids?|children|child|boy|girl|baby|toddler)$/.test(t) ||
    /\b(gifts?\s+for\s+(kids?|children|child|boys?|girls?|bab(?:y|ies))|kids?\s+gifts?)\b/.test(t)
  ) {
    return "kids";
  }
  return null;
}

export function getRecipientMeta(id: GiftRecipient) {
  return GIFT_RECIPIENTS.find((r) => r.id === id)!;
}
