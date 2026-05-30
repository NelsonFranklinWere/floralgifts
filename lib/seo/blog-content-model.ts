/**
 * Headless CMS / markdown content model for informational blog posts.
 * Store in Supabase `blog_posts` or as MDX frontmatter.
 */
export interface BlogContentModel {
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown body — informational only, no keyword stuffing */
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  image: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  /** Must be "informational" for SEO hub posts */
  intent: "informational";
  /** Optional explicit product slugs for internal linking engine */
  relatedProducts?: string[];
  /** Optional collection paths e.g. `/collections/gift-hampers` */
  relatedCollections?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    noIndex?: boolean;
  };
}

/** Example frontmatter for MDX files */
export const BLOG_CONTENT_EXAMPLE: BlogContentModel = {
  slug: "how-to-keep-roses-fresh-in-nairobi",
  title: "How to Keep Roses Fresh in Nairobi's Climate",
  excerpt:
    "Practical tips to extend the life of cut roses in Nairobi — water, trimming, placement and humidity.",
  content: `# How to Keep Roses Fresh in Nairobi\n\n...`,
  author: "Floral Whispers Team",
  publishedAt: "2026-05-01T00:00:00.000Z",
  image: "/images/products/flowers/BouquetFlowers1.jpg",
  category: "Flower Care",
  tags: ["roses", "flower care", "nairobi", "fresh flowers"],
  readTime: 5,
  featured: false,
  intent: "informational",
  relatedCollections: ["/collections/flowers"],
};
