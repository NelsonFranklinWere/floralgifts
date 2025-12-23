import { Metadata } from "next";
import FlowersPageClient from "./FlowersPageClient";
import { getProducts } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Christmas Flowers Nairobi | Flowers for Fiance, Husband & Mom on Christmas | Flower Delivery Nairobi",
  description:
    "Premium Christmas flowers Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Best flowers for your fiance, husband, and mom on Christmas. Christmas roses, holiday bouquets, December specials. Same-day Christmas flower delivery available. Order Christmas flowers online with M-Pesa. Fast flower delivery across Nairobi.",
  keywords: [
    "flower delivery Nairobi",
    "roses Nairobi",
    "birthday flowers Nairobi",
    "anniversary flowers Kenya",
    "get well soon flowers",
    "funeral wreaths Nairobi",
    "sympathy flowers Nairobi",
    "congratulatory flowers Kenya",
    "romantic flowers Nairobi",
    "bouquet delivery Nairobi",
    "flower delivery Nairobi CBD",
    "flower delivery Westlands",
    "flower delivery Karen",
    "flower delivery Lavington",
    "flower delivery Kilimani",
    "florist Nairobi",
    "online flower shop Nairobi",
    "M-Pesa flower delivery Nairobi",
    "fast flower delivery Nairobi",
    "Christmas flowers Nairobi",
    "holiday flowers Kenya",
    "December flowers Nairobi",
    "New Year flowers",
    "Christmas roses Nairobi",
    "holiday flower delivery",
    "December flower delivery",
    "Christmas flower delivery Nairobi",
    "holiday season flowers",
    "Christmas bouquets Nairobi",
    "New Year flower delivery",
    "flowers for my fiance on Christmas Nairobi",
    "flowers on Christmas Nairobi",
    "Christmas flowers for fiance Nairobi",
    "flowers for husband on Christmas Nairobi",
    "gift for mom on Christmas Nairobi",
    "Christmas flowers for mom Nairobi",
    "Christmas flowers for husband Nairobi",
    "best flowers for Christmas Nairobi",
    "best gifts on Christmas Nairobi",
    "Christmas gift ideas Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/flowers`,
  },
  openGraph: {
    title: "Christmas Flowers Nairobi | Flowers for Fiance, Husband & Mom on Christmas",
    description: "Premium Christmas flowers Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Best flowers for your fiance, husband, and mom on Christmas. Christmas roses, holiday bouquets. Same-day delivery available.",
    url: `${baseUrl}/collections/flowers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christmas Flowers Nairobi | Flowers for Fiance, Husband & Mom",
    description: "Premium Christmas flowers Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Best flowers for your fiance, husband, and mom on Christmas. Same-day delivery available.",
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
