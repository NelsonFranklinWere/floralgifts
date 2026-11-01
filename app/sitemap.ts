import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";

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
    staticPage("/corporate-gift-hampers-nairobi", 0.8),
    staticPage("/send-gifts-to-kenya", 0.8),
    staticPage("/period-care-package-kenya", 0.8),
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
      .filter((p: { slug: string }) => /^[A-Za-z0-9-]+$/.test(p.slug))
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

