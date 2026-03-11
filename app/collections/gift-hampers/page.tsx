import { Metadata } from "next";
import GiftHampersPageClient from "./GiftHampersPageClient";
import { getProducts } from "@/lib/db";
import { HAMPER_PRODUCTS } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Gift Hampers Nairobi — Luxury Hampers Delivered | Floral Whispers Gifts",
  description:
    "Luxury gift hampers delivered in Nairobi. Chocolate hampers, birthday hampers, women's day gifts. Same-day delivery available. Floral Whispers Gifts Nairobi.",
  keywords: [
    // Valentine's Gift Hampers Core Keywords
    "valentine's gift hampers Nairobi",
    "valentine's luxury hampers Nairobi",
    "romantic valentine's hampers Nairobi",
    "valentine's surprise hampers Nairobi",
    "premium valentine's gift hampers Nairobi",

    // Valentine's Hampers by Relationship
    "valentine's hamper for wife Nairobi",
    "valentine's hamper for husband Nairobi",
    "valentine's hamper for girlfriend Nairobi",
    "valentine's hamper for mom Nairobi",
    "valentine's hamper for dad Nairobi",
    "romantic hampers valentine's Nairobi",

    // Valentine's Hamper Contents
    "valentine's chocolate hamper Nairobi",
    "valentine's wine hamper Nairobi",
    "valentine's flower hamper Nairobi",
    "valentine's teddy bear hamper Nairobi",
    "valentine's luxury hamper Nairobi",

    // Valentine's Planning
    "pre valentine's hampers Nairobi",
    "valentine's hamper delivery Nairobi",
    "early valentine's hamper orders Nairobi",
    "plan valentine's surprise hamper Nairobi",

    // Valentine's Delivery
    "same day valentine's hampers Nairobi",
    "valentine's hampers CBD Nairobi",
    "valentine's hampers Westlands",
    "valentine's hampers Karen Nairobi",
    "valentine's hampers Lavington",
    "valentine's hampers Kilimani",

    // Valentine's AI Search
    "where to buy valentine's hampers Nairobi",
    "best valentine's gift hampers Nairobi",
    "luxury hampers near me Nairobi",
    "how to surprise with valentine's hamper Nairobi",

    // Valentine's Voice Search
    "order valentine's hampers online Nairobi",
    "find premium hampers near me Nairobi",
    "valentine's hamper delivery near me",

    // Valentine's Long-tail
    "luxury valentine's chocolate wine hampers Nairobi",
    "romantic valentine's flower teddy bear hampers Nairobi",
    "personalized valentine's luxury gift hampers Nairobi",
    "thoughtful valentine's surprise hampers Nairobi",

    // Valentine's Seasonal
    "february valentine's hampers Nairobi",
    "2025 valentine's hampers Nairobi",
    "love month luxury hampers Nairobi Kenya",

    // Valentine's Corporate
    "corporate valentine's hampers Nairobi",
    "office valentine's hampers Nairobi",
    "team valentine's gifts Nairobi",

    // Keeping traditional keywords
    "gift hampers Kenya",
    "luxury gift hampers Nairobi",
    "romantic gift hampers Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/gift-hampers`,
  },
  openGraph: {
    title: "Valentine's Gift Hampers Nairobi | Luxury Romantic Hampers for Wife, Husband, Girlfriend | Chocolate, Wine, Flowers",
    description: "Best Valentine's gift hampers Nairobi: luxury romantic hampers with flowers, chocolates, wine, teddy bears for your wife, husband, girlfriend. Pre-Valentine's orders, surprise hampers, same-day delivery.",
    url: `${baseUrl}/collections/gift-hampers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentine's Gift Hampers Nairobi | Luxury Romantic Hampers",
    description: "Best Valentine's gift hampers Nairobi: luxury romantic hampers with flowers, chocolates, wine, teddy bears for your wife, husband, girlfriend. Pre-Valentine's orders, surprise hampers.",
  },
};

// All available hamper images (including ones not mapped to products)
// Confirmed images in folder: giftamper.jpg, GiftAmper1.jpg, GiftAmper3.jpg, GiftAmper4.jpg, GiftAmper6.jpg, GiftAmper7.jpg, GiftAmper8.jpg, GiftAmper10.jpg
const HAMPER_IMAGES = [
  "/images/products/hampers/giftamper.jpg",
  "/images/products/hampers/GiftAmper1.jpg",
  "/images/products/hampers/GiftAmper3.jpg",
  "/images/products/hampers/GiftAmper4.jpg",
  "/images/products/hampers/GiftAmper6.jpg",
  "/images/products/hampers/GiftAmper7.jpg",
  "/images/products/hampers/GiftAmper8.jpg",
  "/images/products/hampers/GiftAmper10.jpg",
];

export default async function GiftHampersPage() {
  try {
    const products = await getProducts({ category: "hampers" });
    const safeProducts = Array.isArray(products) ? products : [];
    return <GiftHampersPageClient products={safeProducts} allHamperImages={HAMPER_IMAGES} hamperProducts={HAMPER_PRODUCTS} />;
  } catch (error) {
    return <GiftHampersPageClient products={[]} allHamperImages={HAMPER_IMAGES} hamperProducts={HAMPER_PRODUCTS} />;
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

