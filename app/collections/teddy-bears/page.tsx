import { Metadata } from "next";
import TeddyBearsPageClient from "./TeddyBearsPageClient";
import { getProducts } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";

export const metadata: Metadata = {
  title: "Teddy Bears Kenya | Red, White, Brown, Pink, Blue Teddy Bears | Various Sizes 25cm-200cm",
  description:
    "Cuddly teddy bears Kenya in various sizes (25cm, 50cm, 100cm, 120cm, 160cm, 180cm, 200cm) and colors (red teddy bear, white teddy bear, brown teddy bear, blue teddy bear, pink teddy bear). Perfect for gifts and special occasions.",
  keywords: [
    "teddy bears Kenya",
    "red teddy bear",
    "white teddy bear",
    "brown teddy bear",
    "blue teddy bear",
    "pink teddy bear",
    "25cm teddy bear",
    "50cm teddy bear",
    "100cm teddy bear",
    "120cm teddy bear",
    "160cm teddy bear",
    "180cm teddy bear",
    "200cm teddy bear",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/teddy-bears`,
  },
  openGraph: {
    title: "Teddy Bears Kenya | Red, White, Brown, Pink, Blue Teddy Bears | Various Sizes",
    description: "Cuddly teddy bears Kenya in various sizes (25cm-200cm) and colors. Perfect for gifts and special occasions.",
    url: `${baseUrl}/collections/teddy-bears`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teddy Bears Kenya | Floral Whispers Gifts",
    description: "Cuddly teddy bears Kenya in various sizes and colors. Perfect for gifts and special occasions.",
  },
};

// Teddy bear product details mapped to images
const TEDDY_PRODUCTS = [
  {
    image: "/images/products/teddies/Teddybear1.jpg",
    title: "Dream Soft Teddy",
    description: "25cm pink teddy bear",
    price: 250000, // 2,500 KES in cents
    slug: "dream-soft-teddy",
    size: 25,
    color: "pink",
  },
  {
    image: "/images/products/teddies/TeddyBears1.jpg",
    title: "FluffyJoy Bear",
    description: "50cm teddy bear",
    price: 450000, // 4,500 KES in cents
    slug: "fluffyjoy-bear",
    size: 50,
    color: null,
  },
  {
    image: "/images/products/teddies/TeddyBears2.jpg",
    title: "BlissHug Teddy",
    description: "100cm teddy bear",
    price: 850000, // 8,500 KES in cents
    slug: "blisshug-teddy",
    size: 100,
    color: null,
  },
  {
    image: "/images/products/teddies/TeddyBears3.jpg",
    title: "Tender Heart Bear",
    description: "120cm teddy bear with customized Stanley mug",
    price: 1250000, // 12,500 KES in cents
    slug: "tender-heart-bear",
    size: 120,
    color: null,
  },
  {
    image: "/images/products/teddies/TeddyBears5.jpg",
    title: "RossyHugs Bear",
    description: "180cm brown teddy bear",
    price: 1750000, // 17,500 KES in cents
    slug: "rossyhugs-bear",
    size: 180,
    color: "brown",
  },
  {
    image: "/images/products/teddies/TeddyBears6.jpg",
    title: "MarshMallow Bear",
    description: "160cm teddy bear",
    price: 1550000, // 15,500 KES in cents
    slug: "marshmallow-bear",
    size: 160,
    color: null,
  },
  {
    image: "/images/products/teddies/TeddyBears7.jpg",
    title: "Moonlight Snuggle Bear",
    description: "200cm teddy bear",
    price: 1950000, // 19,500 KES in cents
    slug: "moonlight-snuggle-bear",
    size: 200,
    color: null,
  },
];

// Extract just the image URLs for backward compatibility
const TEDDY_IMAGES = TEDDY_PRODUCTS.map(p => p.image);

export default async function TeddyBearsPage() {
  try {
    const products = await getProducts({ category: "teddy" });
    const safeProducts = Array.isArray(products) ? products : [];
    return <TeddyBearsPageClient products={safeProducts} allTeddyImages={TEDDY_IMAGES} teddyProducts={TEDDY_PRODUCTS} />;
  } catch (error) {
    return <TeddyBearsPageClient products={[]} allTeddyImages={TEDDY_IMAGES} teddyProducts={TEDDY_PRODUCTS} />;
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

