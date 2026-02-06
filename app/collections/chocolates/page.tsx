import { Metadata } from "next";
import ChocolatesPageClient from "./ChocolatesPageClient";
import { getProducts } from "@/lib/db";
import { CHOCOLATE_PRODUCTS, getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Valentine's Chocolates Nairobi | Premium Ferrero Rocher Chocolate Hampers & Romantic Gifts for Wife, Girlfriend | Same-Day Delivery",
  description:
    "Best Valentine's chocolates Nairobi: premium Ferrero Rocher (8, 16, 24 pieces), romantic chocolate hampers for your wife, girlfriend, mom. Pre-Valentine's orders, same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
  keywords: [
    // Valentine's Chocolates Core Keywords
    "valentine's chocolates Nairobi",
    "valentine's chocolate hampers Nairobi",
    "romantic valentine's chocolates Nairobi",
    "valentine's ferrero rocher Nairobi",
    "premium valentine's chocolates Nairobi",

    // Valentine's Chocolate Gifts
    "valentine's chocolates for wife Nairobi",
    "valentine's chocolates for girlfriend Nairobi",
    "valentine's chocolates for mom Nairobi",
    "valentine's chocolates for husband Nairobi",
    "romantic chocolate gifts valentine's Nairobi",

    // Valentine's Chocolate Types
    "ferrero rocher valentine's Nairobi",
    "luxury valentine's chocolates Nairobi",
    "valentine's chocolate boxes Nairobi",
    "premium chocolate hampers valentine's Nairobi",

    // Valentine's Planning
    "pre valentine's chocolates Nairobi",
    "valentine's chocolate delivery Nairobi",
    "early valentine's chocolate orders Nairobi",
    "plan valentine's chocolate surprise Nairobi",

    // Valentine's Delivery
    "same day valentine's chocolates Nairobi",
    "valentine's chocolates CBD Nairobi",
    "valentine's chocolates Westlands",
    "valentine's chocolates Karen Nairobi",
    "valentine's chocolates Lavington",
    "valentine's chocolates Kilimani",

    // Valentine's AI Search
    "where to buy valentine's chocolates Nairobi",
    "best valentine's chocolate gifts Nairobi",
    "romantic chocolate hampers near me Nairobi",
    "how to surprise with valentine's chocolates Nairobi",

    // Valentine's Voice Search
    "order valentine's chocolates online Nairobi",
    "find premium chocolates near me Nairobi",
    "valentine's chocolate delivery near me",

    // Valentine's Long-tail
    "luxury ferrero rocher valentine's hampers Nairobi",
    "romantic valentine's chocolate collections Nairobi",
    "personalized valentine's chocolate gifts Nairobi",
    "thoughtful valentine's chocolate hampers Nairobi",

    // Valentine's Seasonal
    "february valentine's chocolates Nairobi",
    "2025 valentine's chocolates Nairobi",
    "love month chocolates Nairobi Kenya",

    // Keeping traditional keywords
    "chocolates Kenya",
    "chocolate gift hampers Nairobi",
    "Ferrero Rocher chocolates",
    "premium chocolates Kenya",
    "gift chocolates Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/chocolates`,
  },
  openGraph: {
    title: "Valentine's Chocolates Nairobi | Premium Ferrero Rocher Chocolate Hampers & Romantic Gifts for Wife, Girlfriend",
    description: "Best Valentine's chocolates Nairobi: premium Ferrero Rocher, romantic chocolate hampers for your wife, girlfriend, mom. Pre-Valentine's orders, same-day delivery across Nairobi.",
    url: `${baseUrl}/collections/chocolates`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentine's Chocolates Nairobi | Premium Ferrero Rocher Hampers",
    description: "Best Valentine's chocolates Nairobi: premium Ferrero Rocher, romantic chocolate hampers for your wife, girlfriend, mom. Pre-Valentine's orders, same-day delivery across Nairobi.",
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

