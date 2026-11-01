import { Metadata } from "next";
import ChocolatesPageClient from "./ChocolatesPageClient";
import { getProducts } from "@/lib/db";
import { CHOCOLATE_PRODUCTS, getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Chocolates Nairobi | Ferrero Rocher | Floral Whispers",
  description:
    "Ferrero Rocher, Lindt and gift chocolates delivered same day in Nairobi. Add them to a bouquet or hamper, or send them alone with a card.",
  alternates: {
    canonical: `${baseUrl}/collections/chocolates`,
  },
  openGraph: {
    title: "Chocolates Nairobi | Ferrero Rocher | Floral Whispers",
    description: "Ferrero Rocher, Lindt and gift chocolates delivered same day in Nairobi. Add them to a bouquet or hamper, or send them alone with a card.",
    url: `${baseUrl}/collections/chocolates`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chocolates Nairobi | Ferrero Rocher | Floral Whispers",
    description: "Ferrero Rocher, Lindt and gift chocolates delivered same day in Nairobi. Add them to a bouquet or hamper, or send them alone with a card.",
  },
};

// Extract just the image URLs for backward compatibility
const CHOCOLATE_IMAGES = CHOCOLATE_PRODUCTS.map(p => p.image);

export default async function ChocolatesPage() {
  try {
    const dbProducts = await getProducts({ category: "chocolates" });
    const predefinedProducts = getPredefinedProducts("chocolates");
    const dbSlugs = new Set(dbProducts.map(p => p.slug));
    const uniquePredefined = predefinedProducts.filter(p => !dbSlugs.has(p.slug));
    const allProducts = [...dbProducts, ...uniquePredefined];
    return <ChocolatesPageClient products={allProducts} allChocolateImages={CHOCOLATE_IMAGES} chocolateProducts={CHOCOLATE_PRODUCTS} />;
  } catch (error) {
    const predefinedProducts = getPredefinedProducts("chocolates");
    return <ChocolatesPageClient products={predefinedProducts} allChocolateImages={CHOCOLATE_IMAGES} chocolateProducts={CHOCOLATE_PRODUCTS} />;
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

