export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
}

// Database interface (matches Supabase schema)
export interface BlogPostDB {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  image: string;
  category: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    slug: "flower-hamper-wine-nairobi-guide",
    title: "Flower Hamper + Wine in Nairobi: Complete Same-Day Gift Guide",
    excerpt:
      "How to choose the right flower hamper and wine gift in Nairobi for birthdays, anniversaries and romantic surprises.",
    content: `# Flower Hamper + Wine in Nairobi

If you want a premium same-day gift in Nairobi, start with a flower hamper and add a matching wine.

## Best occasions
- Birthdays
- Anniversaries
- Romantic surprises
- Congratulations gifts

## How to choose
1. Pick the mood (romantic, elegant, celebratory).
2. Choose flowers first, then pair wine.
3. Add chocolates or a teddy bear for a complete package.

## Delivery tips
- Share clear delivery location and phone number.
- Order early for faster same-day handling.
- Use WhatsApp for fastest confirmation.`,
    author: "Floral Whispers Team",
    publishedAt: new Date().toISOString(),
    image: "/images/products/hampers/giftamper.jpg",
    category: "Gift Ideas",
    tags: ["flower hamper wine nairobi", "same day delivery nairobi", "gift hampers nairobi"],
    readTime: 4,
    featured: true,
  },
  {
    slug: "period-care-package-kenya-guide",
    title: "Period Care Package Kenya: Thoughtful Gift Ideas in Nairobi",
    excerpt:
      "A practical guide to building meaningful period care packages in Kenya with flowers, comfort items and delivery support.",
    content: `# Period Care Package Kenya

Period care gifts should feel practical and comforting.

## What to include
- Comfort snacks and tea
- Gentle self-care products
- Fresh flowers for emotional support
- A kind handwritten note

## Who can send one
- Partners
- Friends
- Family members
- Workplace teams`,
    author: "Floral Whispers Team",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    image: "/images/products/hampers/GiftAmper10.jpg",
    category: "Gift Ideas",
    tags: ["period care package kenya", "nairobi gifts", "care package"],
    readTime: 4,
    featured: true,
  },
  {
    slug: "eid-corporate-gift-hampers-nairobi",
    title: "Eid Corporate Gift Hampers Nairobi: Bulk Gifting Guide",
    excerpt:
      "Plan Eid corporate hampers in Nairobi for clients and teams with practical bulk-order tips.",
    content: `# Eid Corporate Gift Hampers Nairobi

Corporate Eid gifting works best with early planning and clear recipient lists.

## Bulk gifting checklist
1. Group recipients by budget tier.
2. Pick hamper themes (premium, classic, essential).
3. Confirm delivery windows and contact persons.
4. Add personalized greeting notes.`,
    author: "Floral Whispers Team",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    image: "/images/products/hampers/GiftAmper6.jpg",
    category: "Corporate Gifts",
    tags: ["eid corporate gift hampers", "corporate gifts nairobi", "bulk gift hampers"],
    readTime: 4,
    featured: true,
  },
  {
    slug: "send-gifts-to-kenya-from-abroad",
    title: "How to Send Gifts to Kenya from Abroad (Fast Guide)",
    excerpt:
      "A simple guide for diaspora buyers in Canada, Australia, US and beyond to send gifts to Nairobi.",
    content: `# Send Gifts to Kenya from Abroad

Sending gifts to Nairobi from abroad is easier when you keep details clear.

## You need
- Recipient name and phone
- Accurate delivery location
- Occasion and gift preferences

## Best gift options
- Flower hampers
- Wine + flowers
- Teddy and chocolate bundles`,
    author: "Floral Whispers Team",
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    image: "/images/products/hampers/GiftAmper7.jpg",
    category: "Delivery Guide",
    tags: ["send gifts to kenya", "diaspora gifts nairobi", "gift delivery kenya"],
    readTime: 4,
    featured: true,
  },
  {
    slug: "same-day-romantic-gifts-nairobi",
    title: "Same-Day Romantic Gifts Nairobi: What to Order Today",
    excerpt:
      "Quick same-day romantic gift ideas in Nairobi including roses, hampers, wine and proposal bundles.",
    content: `# Same-Day Romantic Gifts Nairobi

Need a romantic gift delivered today in Nairobi? Start with flowers and build a complete bundle.

## Popular choices
- Red rose bouquet + Ferrero
- Flower hamper + wine
- Teddy + flowers + note

## Pro tip
Place the order early and share exact delivery instructions.`,
    author: "Floral Whispers Team",
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    image: "/images/products/flowers/BouquetFlowers2.jpg",
    category: "Occasions",
    tags: ["same day romantic gifts nairobi", "romantic flowers nairobi", "gift delivery nairobi"],
    readTime: 4,
    featured: true,
  },
];

// Convert DB format to app format
export function convertBlogPost(dbPost: BlogPostDB): BlogPost {
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    author: dbPost.author,
    publishedAt: dbPost.published_at,
    image: dbPost.image,
    category: dbPost.category,
    tags: dbPost.tags || [],
    readTime: dbPost.read_time,
    featured: dbPost.featured,
  };
}

// Server-side functions (for use in server components)
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TAG_BLOG } from "./cache-tags";
import { supabase } from "./supabase";

const BLOG_LIST_SELECT =
  "id,slug,title,excerpt,content,author,published_at,image,category,tags,read_time,featured";

const loadBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(BLOG_LIST_SELECT)
        .order("published_at", { ascending: false });

      if (error || !data) return FALLBACK_BLOG_POSTS;

      const dbPosts = data.map((post) => convertBlogPost(post as BlogPostDB));
      const dbSlugs = new Set(dbPosts.map((p) => p.slug));
      const missingFallback = FALLBACK_BLOG_POSTS.filter((p) => !dbSlugs.has(p.slug));
      return [...dbPosts, ...missingFallback];
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return FALLBACK_BLOG_POSTS;
    }
  },
  ["blog-posts"],
  { revalidate: 600, tags: [CACHE_TAG_BLOG] }
);

export const getBlogPosts = cache(async function getBlogPosts(filters?: {
  category?: string;
  tag?: string;
  featured?: boolean;
}): Promise<BlogPost[]> {
  let posts = await loadBlogPosts();
  if (filters?.category) {
    posts = posts.filter((p) => p.category === filters.category);
  }
  if (filters?.tag) {
    posts = posts.filter((p) => p.tags?.includes(filters.tag!));
  }
  if (filters?.featured !== undefined) {
    posts = posts.filter((p) => p.featured === filters.featured);
  }
  return posts;
});

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return FALLBACK_BLOG_POSTS.find((post) => post.slug === slug);
    }
    return convertBlogPost(data as BlogPostDB);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return FALLBACK_BLOG_POSTS.find((post) => post.slug === slug);
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const posts = await getBlogPosts();
    return Array.from(new Set(posts.map((post) => post.category)));
  } catch (error) {
    return [];
  }
}

export async function getBlogTags(): Promise<string[]> {
  try {
    const posts = await getBlogPosts();
    return Array.from(new Set(posts.flatMap((post) => post.tags)));
  } catch (error) {
    return [];
  }
}
