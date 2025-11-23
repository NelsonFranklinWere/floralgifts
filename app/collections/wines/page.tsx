import { Metadata } from "next";
import WinesPageClient from "./WinesPageClient";
import { getProducts } from "@/lib/db";
import { WINE_PRODUCTS, getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://whispersfloralgifts.co.ke";

export const metadata: Metadata = {
  title: "Premium Wines Nairobi | Wine Gift Hampers Kenya | Celebration Wines | Whispers Floral Gifts",
  description:
    "Premium wines Nairobi for every occasion. Wine gift hampers Kenya, celebration wines, Belaire brut, Robertson Red Wine, Rosso Nobile Red Wine. Perfect for gifts and special moments. Same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
  keywords: [
    "wines Nairobi",
    "wine gift hampers Kenya",
    "premium wines Nairobi",
    "celebration wines Kenya",
    "Belaire brut 750ml",
    "Robertson Red Wine",
    "Rosso Nobile Red Wine",
    "wines Nairobi CBD",
    "wines Westlands",
    "wines Karen",
    "wines Lavington",
    "wines Kilimani",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/wines`,
  },
  openGraph: {
    title: "Premium Wines Nairobi | Wine Gift Hampers Kenya",
    description: "Premium wines Nairobi for every occasion. Wine gift hampers, celebration wines. Perfect for gifts and special moments.",
    url: `${baseUrl}/collections/wines`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Wines Nairobi | Whispers Floral Gifts",
    description: "Premium wines Nairobi for every occasion. Wine gift hampers, celebration wines. Same-day delivery Nairobi.",
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

