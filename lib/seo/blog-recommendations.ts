import type { BlogPost } from "@/lib/blogData";

export interface BlogProductLink {
  slug: string;
  name: string;
  category: string;
  reason: string;
}

/** Tag/keyword → collection or product recommendations for informational posts. */
const TAG_LINK_RULES: {
  test: (post: BlogPost) => boolean;
  links: { slug: string; name: string; category: string; reason: string }[];
}[] = [
  {
    test: (p) =>
      /rose|flower|bouquet|floral/i.test(p.title + p.tags.join(" ")),
    links: [
      { slug: "", name: "Fresh Flower Bouquets", category: "flowers", reason: "Browse our rose & bouquet collection" },
    ],
  },
  {
    test: (p) => /hamper|gift basket|corporate/i.test(p.title + p.tags.join(" ")),
    links: [
      { slug: "", name: "Luxury Gift Hampers", category: "hampers", reason: "Shop curated gift hampers" },
    ],
  },
  {
    test: (p) => /wine|champagne|belaire/i.test(p.title + p.tags.join(" ")),
    links: [
      { slug: "", name: "Premium Wines", category: "wines", reason: "Pair your gift with fine wine" },
    ],
  },
  {
    test: (p) => /teddy|bear|cuddly/i.test(p.title + p.tags.join(" ")),
    links: [
      { slug: "", name: "Teddy Bears", category: "teddy", reason: "Add a cuddly teddy to your gift" },
    ],
  },
  {
    test: (p) => /chocolate|ferrero|sweet/i.test(p.title + p.tags.join(" ")),
    links: [
      { slug: "", name: "Premium Chocolates", category: "chocolates", reason: "Complete the gift with chocolates" },
    ],
  },
  {
    test: (p) => /same.?day|delivery|nairobi/i.test(p.title + p.tags.join(" ")),
    links: [
      { slug: "", name: "Same-Day Delivery Flowers", category: "flowers", reason: "Order for same-day Nairobi delivery" },
    ],
  },
];

const CATEGORY_HREF: Record<string, string> = {
  flowers: "/collections/flowers",
  hampers: "/collections/gift-hampers",
  teddy: "/collections/teddy-bears",
  wines: "/collections/wines",
  chocolates: "/collections/chocolates",
  cards: "/collections/cards",
  cakes: "/collections/cakes",
};

/**
 * Returns internal product/collection links relevant to an informational blog post.
 * De-duplicates and caps at 3 recommendations.
 */
export function getBlogInternalLinks(post: BlogPost): BlogProductLink[] {
  const seen = new Set<string>();
  const results: BlogProductLink[] = [];

  for (const rule of TAG_LINK_RULES) {
    if (!rule.test(post)) continue;
    for (const link of rule.links) {
      const href = link.slug ? `/product/${link.slug}` : CATEGORY_HREF[link.category] || "/collections";
      if (seen.has(href)) continue;
      seen.add(href);
      results.push({
        slug: link.slug || href,
        name: link.name,
        category: link.category,
        reason: link.reason,
      });
      if (results.length >= 3) return results;
    }
  }

  if (results.length === 0) {
    results.push({
      slug: "/collections/flowers",
      name: "Shop Fresh Flowers",
      category: "flowers",
      reason: "Explore our bestselling bouquets",
    });
  }

  return results;
}

export function linkHref(link: BlogProductLink): string {
  if (link.slug.startsWith("/")) return link.slug;
  if (link.slug) return `/product/${link.slug}`;
  return CATEGORY_HREF[link.category] || "/collections";
}
