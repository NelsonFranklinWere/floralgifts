import { Metadata } from "next";
import FlowersPageClient from "./FlowersPageClient";
import { getProducts } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Valentine's Flowers Nairobi | Romantic Roses, Money Bouquet & Surprise Gifts for Wife, Girlfriend | Same-Day Delivery",
  description:
    "Best Valentine's flowers Nairobi: romantic roses, money bouquets, surprise gifts for your wife, girlfriend, mom. Pre-Valentine's orders, same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Order Valentine's flowers online with M-Pesa.",
  keywords: [
    // Valentine's Flowers Core Keywords
    "valentine's flowers Nairobi",
    "valentine's roses Nairobi",
    "romantic valentine's flowers Nairobi",
    "valentine's bouquet Nairobi",
    "valentine's money bouquet Nairobi",
    "valentine's flower delivery Nairobi",

    // Valentine's Relationship Gifts
    "valentine's flowers for wife Nairobi",
    "valentine's flowers for girlfriend Nairobi",
    "valentine's flowers for husband Nairobi",
    "valentine's flowers for mom Nairobi",
    "valentine's flowers for dad Nairobi",
    "romantic flowers for valentine's Nairobi",

    // Valentine's Surprise Gifts
    "valentine's surprise flowers Nairobi",
    "surprise valentine's bouquet Nairobi",
    "valentine's gift flowers Nairobi",
    "romantic valentine's gifts Nairobi",

    // Valentine's Planning
    "pre valentine's flowers Nairobi",
    "early valentine's flower orders Nairobi",
    "valentine's flower arrangements Nairobi",
    "plan valentine's surprise flowers Nairobi",

    // Valentine's Flower Types
    "valentine's red roses Nairobi",
    "valentine's pink roses Nairobi",
    "valentine's white roses Nairobi",
    "valentine's mixed bouquet Nairobi",
    "luxury valentine's flowers Nairobi",

    // Valentine's Delivery
    "same day valentine's flowers Nairobi",
    "valentine's flower delivery CBD Nairobi",
    "valentine's flowers Westlands",
    "valentine's flowers Karen Nairobi",
    "valentine's flowers Lavington",
    "valentine's flowers Kilimani",

    // Valentine's AI Search
    "where to buy valentine's flowers Nairobi",
    "best valentine's florist Nairobi",
    "valentine's flower shop near me",
    "how to surprise with valentine's flowers Nairobi",
    "beautiful valentine's arrangements Nairobi",

    // Valentine's Voice Search
    "order valentine's flowers online Nairobi",
    "find romantic flowers near me Nairobi",
    "valentine's florist near me Kenya",

    // Valentine's Long-tail
    "personalized valentine's flower bouquets Nairobi",
    "romantic valentine's flower deliveries Nairobi",
    "luxury valentine's rose arrangements Nairobi",
    "thoughtful valentine's flower gifts Nairobi",

    // Valentine's Seasonal
    "february valentine's flowers Nairobi",
    "2025 valentine's flowers Nairobi",
    "love month flowers Nairobi Kenya",

    // Keeping some traditional keywords
    "money bouquet Nairobi",
    "romantic flowers Nairobi",
    "surprise flowers Nairobi",
    "flower delivery Nairobi",
    "roses Nairobi",
    "bouquet delivery Nairobi",
    "same-day flower delivery Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/flowers`,
  },
  openGraph: {
    title: "Valentine's Flowers Nairobi | Romantic Roses, Money Bouquet & Surprise Gifts for Wife, Girlfriend | Same-Day Delivery",
    description: "Best Valentine's flowers Nairobi: romantic roses, money bouquets, surprise gifts for your wife, girlfriend, mom. Pre-Valentine's orders, same-day delivery across Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
    url: `${baseUrl}/collections/flowers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentine's Flowers Nairobi | Romantic Roses, Money Bouquet & Surprise Gifts for Wife, Girlfriend",
    description: "Best Valentine's flowers Nairobi: romantic roses, money bouquets, surprise gifts for your wife, girlfriend, mom. Pre-Valentine's orders, same-day delivery across Nairobi.",
  },
};

// Flower product details mapped to images
const FLOWER_PRODUCTS = [
  {
    image: "/images/products/flowers/BouquetFlowers1.jpg",
    title: "Classic Rose Romance",
    description: "Mixed Roses with a touch of gypsophilia, Cuddburry Chocolate 80g",
    price: 550000, // 5,500 KES in cents
    slug: "classic-rose-romance",
  },
  {
    image: "/images/products/flowers/BouquetFlowers2.jpg",
    title: "Sweet Whisper Bouquet",
    description: "60 Roses with touch of gypsophilia, Ferrero rocher chocolate T8",
    price: 550000, // 5,500 KES in cents
    slug: "sweet-whisper-bouquet",
  },
  {
    image: "/images/products/flowers/BouquetFlowers4.jpg",
    title: "Blush and Bloom Dreams",
    description: "Baby Pink and white Roses with a touch of gypsophila, Cuddburry chocolate",
    price: 350000, // 3,500 KES in cents
    slug: "blush-and-bloom-dreams",
  },
  {
    image: "/images/products/flowers/BouquetFlowers5.jpg",
    title: "Pure Serenity Bouquet",
    description: "Yellow mumbs mixed with white and Red Roses, Ferrero rocher chocolate T8",
    price: 550000, // 5,500 KES in cents
    slug: "pure-serenity-bouquet",
  },
  {
    image: "/images/products/flowers/BouquetFlowers6.jpg",
    title: "Radiant Love Collection",
    description: "Pink and Red Roses mixed with a touch of gypsophila",
    price: 300000, // 3,000 KES in cents
    slug: "radiant-love-collection",
  },
  {
    image: "/images/products/flowers/BouquetFlowers7.jpg",
    title: "Midnight Bloom Surprises Bouquet",
    description: "Red Yellow, Pink, Roses mixed with white mumbs with touch of gypsophilla",
    price: 350000, // 3,500 KES in cents
    slug: "midnight-bloom-surprises-bouquet",
  },
  {
    image: "/images/products/flowers/BouquetFlowers8.jpg",
    title: "Sunset Romance Bouquet",
    description: "80 Roses of red Roses and white with a touch of gypsophilla",
    price: 450000, // 4,500 KES in cents
    slug: "sunset-romance-bouquet",
  },
  {
    image: "/images/products/flowers/BouquetFlowers9.jpg",
    title: "Blossom Harmony Bouquet",
    description: "60 Roses with gypsophilla, Cuddburry chocolate",
    price: 350000, // 3,500 KES in cents
    slug: "blossom-harmony-bouquet",
  },
];

// Extract just the image URLs for backward compatibility
const FLOWER_IMAGES = FLOWER_PRODUCTS.map(p => p.image);

export default async function FlowersPage() {
  try {
    const products = await getProducts({ category: "flowers" });
    const safeProducts = Array.isArray(products) ? products : [];
    return <FlowersPageClient products={safeProducts} allFlowerImages={FLOWER_IMAGES} flowerProducts={FLOWER_PRODUCTS} />;
  } catch (error) {
    return <FlowersPageClient products={[]} allFlowerImages={FLOWER_IMAGES} flowerProducts={FLOWER_PRODUCTS} />;
  }
}

// Enable static generation with revalidation for fast loading
export const revalidate = 60; // Revalidate every 60 seconds
