import { Metadata } from "next";
import CakesPageClient from "./CakesPageClient";
import { getProducts } from "@/lib/db";
import { CAKE_PRODUCTS, getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Cakes Nairobi | Birthday Cakes, Anniversary Cakes & Celebration Cakes | Same-Day Delivery",
  description:
    "Order cakes in Nairobi: birthday cakes, anniversary cakes and celebration cakes. Pair cakes with flowers, wine and chocolates for the perfect gift. Same-day delivery available.",
  alternates: {
    canonical: `${baseUrl}/collections/cakes`,
  },
  openGraph: {
    title: "Cakes Nairobi | Birthday & Celebration Cakes",
    description: "Order cakes in Nairobi: birthday cakes, anniversary cakes and celebration cakes. Same-day delivery available.",
    url: `${baseUrl}/collections/cakes`,
    type: "website",
  },
};

// Extract just the image URLs for backward compatibility
const CAKE_IMAGES = CAKE_PRODUCTS.map((p) => p.image);

export default async function CakesPage() {
  try {
    const dbProducts = await getProducts({ category: "cakes" });
    const predefinedProducts = getPredefinedProducts("cakes");
    const dbSlugs = new Set(dbProducts.map((p) => p.slug));
    const uniquePredefined = predefinedProducts.filter((p) => !dbSlugs.has(p.slug));
    const allProducts = [...dbProducts, ...uniquePredefined];
    return <CakesPageClient products={allProducts} allCakeImages={CAKE_IMAGES} cakeProducts={CAKE_PRODUCTS} />;
  } catch {
    const predefinedProducts = getPredefinedProducts("cakes");
    return <CakesPageClient products={predefinedProducts} allCakeImages={CAKE_IMAGES} cakeProducts={CAKE_PRODUCTS} />;
  }
}

export const revalidate = 60;

