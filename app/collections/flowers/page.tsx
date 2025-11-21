import { Metadata } from "next";
import FlowersPageClient from "./FlowersPageClient";
import { getProducts } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";

export const metadata: Metadata = {
  title: "Flower Delivery Nairobi | Birthday Flowers, Anniversary Flowers, Roses Nairobi | Floral Whispers Gifts",
  description:
    "Premium flower delivery Nairobi. Birthday flowers Nairobi, anniversary flowers Kenya, get well soon flowers, funeral wreaths Nairobi, congratulatory flowers Kenya, roses Nairobi. Same-day delivery available.",
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
  ],
  alternates: {
    canonical: `${baseUrl}/collections/flowers`,
  },
  openGraph: {
    title: "Flower Delivery Nairobi | Birthday Flowers, Anniversary Flowers, Roses Nairobi",
    description: "Premium flower delivery Nairobi. Birthday flowers, anniversary flowers, get well soon flowers, funeral wreaths, roses. Same-day delivery available.",
    url: `${baseUrl}/collections/flowers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flower Delivery Nairobi | Floral Whispers Gifts",
    description: "Premium flower delivery Nairobi. Birthday flowers, anniversary flowers, get well soon flowers, funeral wreaths, roses.",
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
