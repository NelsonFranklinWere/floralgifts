import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";

/** These posts now 301 to one page each; see redirects in next.config.js. */
const MERGED_BLOG_SLUGS = [
  "money-bouquet-nairobi",
  "luxury-money-bouquet-nairobi",
  "period-care-package",
  "period-care-package-self-care-box",
  "surprise-gifts-for-wife-nairobi",
  "nairobi-florist-shop",
  "florist-nairobi",
  "flower-shop-nairobi",
  "same-day-flower-delivery-nairobi",
  "same-day-flower-delivery-nairobi-cbd",
  "teddy-bears-perfect-gifts-for-every-occasion",
  "teddy-bear-delivery-nairobi",
  "giant-teddy-bears-nairobi",
  "funeral-flowers-nairobi",
  "fresh-fruit-basket",
  "fresh-fruit-basket-nairobi",
  "birthday-flowers-nairobi",
  "send-birthday-flowers-nairobi",
  "birthday-gifts-flowers-nairobi-kenya",
  "surprise-birthday-gifts-nairobi",
  "birthday-gift-shops-nairobi",
  "be-my-valentine-2026",
  "luxury-valentine-romance-package",
  "valentines-day-pre-orders-nairobi",
  "valentines-day-gifts-2026",
  "affordable-mothers-day-gifts-nairobi-kenya",
  "mothers-day-gifts-kenya",
  "easter-offers-nairobi",
  "easter-holiday-gifts-nairobi",
  "wine-shop-nairobi",
  "chocolates-shop-nairobi",
  "gift-hamper-delivery-nairobi",
  "send-flowers-nairobi",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

  const staticPage = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" | "yearly" = "weekly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${baseUrl}${path}`,
    changeFrequency,
    priority,
  });

  const staticUrls: MetadataRoute.Sitemap = [
    staticPage("", 1.0),
    staticPage("/collections", 0.9),
    staticPage("/collections/flowers", 0.9),
    staticPage("/collections/gift-hampers", 0.9),
    staticPage("/collections/teddy-bears", 0.9),
    staticPage("/collections/chocolates", 0.8),
    staticPage("/collections/wines", 0.8),
    staticPage("/collections/cakes", 0.7),
    staticPage("/collections/cards", 0.7),
    staticPage("/collections/corporate", 0.8),
    staticPage("/collections/graduation", 0.8),
    staticPage("/collections/wedding", 0.8),
    staticPage("/collections/mens", 0.7),
    staticPage("/collections/womens", 0.7),
    staticPage("/collections/kids", 0.7),
    staticPage("/collections/valentines", 0.6),
    staticPage("/flower-delivery-nairobi", 0.9),
    staticPage("/same-day-delivery-nairobi", 0.9),
    staticPage("/flower-hamper-wine-nairobi", 0.9),
    staticPage("/gift-hampers-nairobi", 0.9),
    staticPage("/corporate-gift-hampers-nairobi", 0.9),
    staticPage("/money-bouquet-nairobi", 0.9),
    staticPage("/funeral-wreaths-nairobi", 0.9),
    staticPage("/get-well-soon-gifts-nairobi", 0.9),
    staticPage("/period-care-package-kenya", 0.9),
    staticPage("/giant-teddy-bears-nairobi", 0.9),
    staticPage("/graduation-gifts-nairobi", 0.9),
    staticPage("/red-roses-nairobi", 0.9),
    staticPage("/send-gifts-to-kenya", 0.9),
    staticPage("/chocolate-gifts-nairobi", 0.8),
    staticPage("/wine-gifts-nairobi", 0.8),
    staticPage("/flower-boxes-nairobi", 0.8),
    staticPage("/new-baby-gifts-nairobi", 0.8),
    staticPage("/gifts-for-her-nairobi", 0.8),
    staticPage("/gifts-for-him-nairobi", 0.8),
    staticPage("/valentines-gifts-nairobi", 0.8),
    staticPage("/mothers-day-gifts-nairobi", 0.8),
    staticPage("/flower-delivery-kilimani-nairobi", 0.8),
    staticPage("/flower-delivery-nakuru", 0.8),
    staticPage("/flower-delivery-mombasa", 0.8),
    staticPage("/send-flowers-to-kenya-from-usa", 0.8),
    staticPage("/new-arrivals", 0.6),
    staticPage("/blog", 0.8),
    staticPage("/case-studies", 0.9),
    staticPage("/about", 0.7, "monthly"),
    staticPage("/services", 0.7, "monthly"),
    staticPage("/contact", 0.7, "monthly"),
    staticPage("/privacy", 0.3, "yearly"),
    staticPage("/terms", 0.3, "yearly"),
    staticPage("/returns", 0.3, "yearly"),
  ];

  try {
    const [{ data: products }, { data: posts }, { data: caseStudies }] =
      await Promise.all([
        (supabaseAdmin.from("products") as any).select("slug, updated_at"),
        (supabaseAdmin.from("blog_posts") as any).select("slug, updated_at"),
        (supabaseAdmin.from("case_studies") as any)
          .select("slug, updated_at, published")
          .eq("published", true),
      ]);

    const productUrls: MetadataRoute.Sitemap = (products ?? []).map(
      (p: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    );

    const blogUrls: MetadataRoute.Sitemap = (posts ?? [])
      .filter((p: { slug: string }) => /^[A-Za-z0-9-]+$/.test(p.slug) && !MERGED_BLOG_SLUGS.includes(p.slug))
      .map(
      (p: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    );

    const caseStudyUrls: MetadataRoute.Sitemap = (caseStudies ?? []).map(
      (p: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/case-studies/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: "monthly",
        priority: 0.8,
      }),
    );

    return [...staticUrls, ...productUrls, ...blogUrls, ...caseStudyUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticUrls;
  }
}

