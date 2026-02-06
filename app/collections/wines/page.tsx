import { Metadata } from "next";
import WinesPageClient from "./WinesPageClient";
import { getProducts } from "@/lib/db";
import { WINE_PRODUCTS, getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Valentine's Wine Gifts Nairobi | Premium Wine Hampers & Romantic Celebration Wines for Wife, Husband | Same-Day Delivery",
  description:
    "Best Valentine's wine gifts Nairobi: premium Belaire brut, Robertson Red Wine, Rosso Nobile Red Wine hampers for your wife, husband, girlfriend. Romantic celebration wines, pre-Valentine's orders, same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
  keywords: [
    // Valentine's Wine Core Keywords
    "valentine's wine gifts Nairobi",
    "valentine's wine hampers Nairobi",
    "romantic valentine's wines Nairobi",
    "valentine's celebration wines Nairobi",
    "premium valentine's wine Nairobi",

    // Valentine's Wine Gifts
    "valentine's wine for wife Nairobi",
    "valentine's wine for husband Nairobi",
    "valentine's wine for girlfriend Nairobi",
    "romantic wine gifts valentine's Nairobi",
    "valentine's wine hampers Nairobi",

    // Valentine's Wine Types
    "valentine's belaire brut Nairobi",
    "valentine's robertson red wine Nairobi",
    "valentine's rosso nobile red wine Nairobi",
    "luxury valentine's wines Nairobi",
    "celebration wines valentine's Nairobi",

    // Valentine's Planning
    "pre valentine's wine gifts Nairobi",
    "valentine's wine delivery Nairobi",
    "early valentine's wine orders Nairobi",
    "plan valentine's wine surprise Nairobi",

    // Valentine's Delivery
    "same day valentine's wine Nairobi",
    "valentine's wine delivery CBD Nairobi",
    "valentine's wines Westlands",
    "valentine's wines Karen Nairobi",
    "valentine's wines Lavington",
    "valentine's wines Kilimani",

    // Valentine's AI Search
    "where to buy valentine's wine Nairobi",
    "best valentine's wine gifts Nairobi",
    "romantic wine hampers near me Nairobi",
    "how to surprise with valentine's wine Nairobi",

    // Valentine's Voice Search
    "order valentine's wine online Nairobi",
    "find premium wines near me Nairobi",
    "valentine's wine delivery near me",

    // Valentine's Long-tail
    "luxury valentine's wine collections Nairobi",
    "romantic valentine's wine hampers Nairobi",
    "personalized valentine's wine gifts Nairobi",
    "thoughtful valentine's celebration wines Nairobi",

    // Valentine's Seasonal
    "february valentine's wines Nairobi",
    "2025 valentine's wines Nairobi",
    "love month wines Nairobi Kenya",

    // Keeping traditional keywords
    "wines Nairobi",
    "wine gift hampers Kenya",
    "premium wines Nairobi",
    "celebration wines Kenya",
    "gift wines Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/wines`,
  },
  openGraph: {
    title: "Valentine's Wine Gifts Nairobi | Premium Wine Hampers & Romantic Celebration Wines for Wife, Husband",
    description: "Best Valentine's wine gifts Nairobi: premium Belaire brut, Robertson Red Wine, Rosso Nobile Red Wine hampers for your wife, husband, girlfriend. Romantic celebration wines, pre-Valentine's orders.",
    url: `${baseUrl}/collections/wines`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentine's Wine Gifts Nairobi | Premium Wine Hampers",
    description: "Best Valentine's wine gifts Nairobi: premium Belaire brut, Robertson Red Wine, Rosso Nobile Red Wine hampers for your wife, husband, girlfriend. Romantic celebration wines, pre-Valentine's orders.",
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

