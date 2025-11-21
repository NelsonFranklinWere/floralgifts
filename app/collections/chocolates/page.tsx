import { Metadata } from "next";
import ChocolatesPageClient from "./ChocolatesPageClient";
import { getProducts } from "@/lib/db";
import { CHOCOLATE_PRODUCTS, getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";

export const metadata: Metadata = {
  title: "Premium Chocolates Kenya | Chocolate Gift Hampers Nairobi | Ferrero Rocher Chocolates",
  description:
    "Premium chocolates Kenya: Ferrero Rocher chocolates (8 pieces, 16 pieces, 24 pieces). Chocolate gift hampers Nairobi. Perfect for gifts, celebrations, and sweet moments.",
  keywords: [
    "chocolates Kenya",
    "chocolate gift hampers Nairobi",
    "Ferrero Rocher chocolates",
    "premium chocolates Kenya",
    "chocolate gifts Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/chocolates`,
  },
  openGraph: {
    title: "Premium Chocolates Kenya | Chocolate Gift Hampers Nairobi",
    description: "Premium chocolates Kenya: Ferrero Rocher chocolates. Chocolate gift hampers. Perfect for gifts and celebrations.",
    url: `${baseUrl}/collections/chocolates`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Chocolates Kenya | Floral Whispers Gifts",
    description: "Premium chocolates Kenya: Ferrero Rocher chocolates. Chocolate gift hampers.",
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

