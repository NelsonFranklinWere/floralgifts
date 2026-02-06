import { Metadata } from "next";
import GiftHampersPageClient from "./GiftHampersPageClient";
import { getProducts } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Valentine's Gift Hampers Nairobi | Luxury Romantic Hampers for Wife, Husband, Girlfriend | Chocolate, Wine, Flowers | Same-Day Delivery",
  description:
    "Best Valentine's gift hampers Nairobi: luxury romantic hampers with flowers, chocolates, wine, teddy bears for your wife, husband, girlfriend. Pre-Valentine's orders, surprise hampers, same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
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

// Gift hamper product details mapped to images
const HAMPER_PRODUCTS = [
  {
    image: "/images/products/hampers/GiftAmper1.jpg",
    title: "WarmHugs Gift Hamper",
    description: "100cm teddy bear, Pink Roses flower bouquet, 3 Piece Ferrero rocher chocolate, 4 Packets cuddburry chocolate, Customized gift Hamper",
    price: 1780000, // 17,800 KES in cents
    slug: "warmhugs-gift-hamper",
  },
  {
    image: "/images/products/hampers/giftamper.jpg",
    title: "Sweetheart Snuggler",
    description: "50cm teddy bear, Flower bouquet, Ferrero rocher chocolate, Bracelet",
    price: 1250000, // 12,500 KES in cents
    slug: "sweetheart-snuggler",
  },
  {
    image: "/images/products/hampers/GiftAmper3.jpg",
    title: "GentlePaw Hamper",
    description: "100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch",
    price: 2050000, // 20,500 KES in cents
    slug: "gentlepaw-hamper",
  },
  {
    image: "/images/products/hampers/GiftAmper6.jpg",
    title: "Signature Celebration Basket",
    description: "Luxury gift hamper with curated items",
    price: 1050000, // 10,500 KES in cents
    slug: "signature-celebration-basket",
  },
  {
    image: "/images/products/hampers/GiftAmper7.jpg",
    title: "Spoil Me Sweet Box",
    description: "Luxury gift hamper with curated items",
    price: 1450000, // 14,500 KES in cents
    slug: "spoil-me-sweet-box",
  },
  {
    image: "/images/products/hampers/GiftAmper8.jpg",
    title: "Aroma & Delight Hamper",
    description: "Luxury gift hamper with curated items",
    price: 980000, // 9,800 KES in cents
    slug: "aroma-delight-hamper",
  },
  {
    image: "/images/products/hampers/GiftAmper10.jpg",
    title: "Care Package Gift Hamper",
    description: "Luxury gift hamper with curated items",
    price: 850000, // 8,500 KES in cents
    slug: "care-package-gift-hamper",
  },
];

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

