import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "./supabase";

export type HeroSlide = {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/images/products/flowers/BouquetFlowers1.jpg",
    title: "Flower Delivery Nairobi | Red, Pink & White Roses",
    subtitle:
      "Send red roses, pink roses and white bouquets across Nairobi — same-day delivery to CBD, Westlands, Karen, Lavington and more.",
    ctaText: "Shop Flowers",
    ctaLink: "/collections/flowers",
  },
  {
    id: 2,
    image: "/images/products/hampers/giftamper.jpg",
    title: "Gift Hampers Nairobi | Flowers, Chocolates & Wine",
    subtitle:
      "Luxury gift hampers with roses, chocolates and wine — perfect for birthdays, anniversaries and thank-you gifts in Nairobi.",
    ctaText: "Shop Gift Hampers",
    ctaLink: "/collections/gift-hampers",
  },
  {
    id: 3,
    image: "/images/products/teddies/Teddybear1.jpg",
    title: "Teddy Bears Nairobi | Cuddly Gifts in Red, Pink & White",
    subtitle:
      "Soft teddy bears from 25cm–200cm in romantic red, pink, white and brown. Pair with flowers for unforgettable Nairobi surprises.",
    ctaText: "Shop Teddy Bears",
    ctaLink: "/collections/teddy-bears",
  },
  {
    id: 4,
    image: "/images/products/Chocolates/Chocolates1.jpg",
    title: "Chocolates & Sweet Gifts Nairobi",
    subtitle:
      "Ferrero Rocher and premium chocolates that match your red roses, pink and white bouquets and hampers — delivered same day in Nairobi.",
    ctaText: "Shop Chocolates",
    ctaLink: "/collections/chocolates",
  },
];

function mapDbSlide(row: Record<string, unknown>, index: number): HeroSlide | null {
  const image = row.image as string | undefined;
  const title = row.title as string | undefined;
  const ctaText = (row.cta_text ?? row.ctaText) as string | undefined;
  const ctaLink = (row.cta_link ?? row.ctaLink) as string | undefined;
  if (!image || !title || !ctaText || !ctaLink) return null;
  return {
    id: (row.id as string | number) ?? index,
    image,
    title,
    subtitle: (row.subtitle as string) || undefined,
    ctaText,
    ctaLink,
  };
}

const fetchHeroSlidesFromDb = unstable_cache(
  async (): Promise<HeroSlide[]> => {
    try {
      const { data, error } = await (supabaseAdmin.from("hero_slides") as any)
        .select("id, image, title, subtitle, cta_text, cta_link, position")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });

      if (error || !data?.length) return DEFAULT_HERO_SLIDES;

      const mapped = data
        .map((row: Record<string, unknown>, i: number) => mapDbSlide(row, i))
        .filter((s: HeroSlide | null): s is HeroSlide => s !== null);

      return mapped.length > 0 ? mapped : DEFAULT_HERO_SLIDES;
    } catch {
      return DEFAULT_HERO_SLIDES;
    }
  },
  ["hero-slides"],
  { revalidate: 300, tags: ["hero-slides"] }
);

/** Server-only: cached hero slides for LCP (no client-side API round-trip). */
export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => {
  return fetchHeroSlidesFromDb();
});
