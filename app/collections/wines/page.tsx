import { Metadata } from "next";
import WinesPageClient from "./WinesPageClient";
import { getProducts } from "@/lib/db";
import { WINE_PRODUCTS, getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Wine Gifts Nairobi | Floral Whispers",
  description:
    "Wine gifts delivered same day in Nairobi. Red, sparkling and non-alcoholic bottles to send alone or with flowers and a hamper.",
  alternates: {
    canonical: `${baseUrl}/collections/wines`,
  },
  openGraph: {
    title: "Wine Gifts Nairobi | Floral Whispers",
    description: "Wine gifts delivered same day in Nairobi. Red, sparkling and non-alcoholic bottles to send alone or with flowers and a hamper.",
    url: `${baseUrl}/collections/wines`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wine Gifts Nairobi | Floral Whispers",
    description: "Wine gifts delivered same day in Nairobi. Red, sparkling and non-alcoholic bottles to send alone or with flowers and a hamper.",
  },
};

// Extract just the image URLs for backward compatibility
const WINE_IMAGES = WINE_PRODUCTS.map(p => p.image);

export default async function WinesPage() {
  try {
    const dbProducts = await getProducts({ category: "wines" });
    const predefinedProducts = getPredefinedProducts("wines");
    const dbSlugs = new Set(dbProducts.map(p => p.slug));
    const uniquePredefined = predefinedProducts.filter(p => !dbSlugs.has(p.slug));
    const allProducts = [...dbProducts, ...uniquePredefined];
    return <WinesPageClient products={allProducts} allWineImages={WINE_IMAGES} wineProducts={WINE_PRODUCTS} />;
  } catch (error) {
    const predefinedProducts = getPredefinedProducts("wines");
    return <WinesPageClient products={predefinedProducts} allWineImages={WINE_IMAGES} wineProducts={WINE_PRODUCTS} />;
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

