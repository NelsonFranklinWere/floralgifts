import { Metadata } from "next";
import GiftHampersPageClient from "./GiftHampersPageClient";
import { getProducts } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";

export const metadata: Metadata = {
  title: "Gift Hampers Kenya | Chocolate Gift Hampers, Wine Gift Hampers, Corporate Gift Hampers Nairobi",
  description:
    "Luxury gift hampers Kenya: chocolate gift hampers, wine gift hampers Nairobi, corporate gift hampers Kenya, romantic gift hampers Nairobi. Premium curated items for celebrations and corporate gifts.",
  keywords: [
    "gift hampers Kenya",
    "chocolate gift hampers Kenya",
    "wine gift hampers Nairobi",
    "corporate gift hampers Kenya",
    "romantic gift hampers Nairobi",
    "luxury gift hampers Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/gift-hampers`,
  },
  openGraph: {
    title: "Gift Hampers Kenya | Chocolate, Wine, Corporate Gift Hampers Nairobi",
    description: "Luxury gift hampers Kenya: chocolate gift hampers, wine gift hampers, corporate gift hampers. Premium curated items for celebrations.",
    url: `${baseUrl}/collections/gift-hampers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Hampers Kenya | Floral Whispers Gifts",
    description: "Luxury gift hampers Kenya: chocolate gift hampers, wine gift hampers, corporate gift hampers.",
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

