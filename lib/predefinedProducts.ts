import type { Product } from "./db";

// Flower product details mapped to images
export const FLOWER_PRODUCTS = [
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

// Wine product details mapped to images
export const WINE_PRODUCTS = [
  {
    image: "/images/products/wines/Wines1.jpg",
    title: "LUC BELAIRE RARE LUXE 750ML(12.5%) - Jays",
    description: "Premium sparkling wine 750ml",
    price: 550000, // 5,500 KES in cents
    slug: "luc-belaire-rare-luxe-750ml-jays",
  },
  {
    image: "/images/products/wines/Wines2.jpg",
    title: "Belaire brut 750ml",
    description: "Premium brut sparkling wine 750ml",
    price: 750000, // 7,500 KES in cents
    slug: "belaire-brut-750ml",
  },
  {
    image: "/images/products/wines/Wines3.jpg",
    title: "Robertson Red Wine",
    description: "750ml Red sweet Wine",
    price: 250000, // 2,500 KES in cents
    slug: "robertson-red-wine",
  },
  {
    image: "/images/products/wines/Wines4.jpg",
    title: "Rosso Nobile Red Wine",
    description: "750ml Red wine",
    price: 250000, // 2,500 KES in cents
    slug: "rosso-nobile-red-wine",
  },
];

// Chocolate product details mapped to images
export const CHOCOLATE_PRODUCTS = [
  {
    image: "/images/products/Chocolates/Chocolates1.jpg",
    title: "Ferrero rocher chocolate",
    description: "8 pieces",
    price: 150000, // 1,500 KES in cents
    slug: "ferrero-rocher-chocolate-8-pieces",
  },
  {
    image: "/images/products/Chocolates/Chocolates2.jpg",
    title: "Ferrero rocher chocolate",
    description: "24 Pieces",
    price: 500000, // 5,000 KES in cents
    slug: "ferrero-rocher-chocolate-24-pieces",
  },
  {
    image: "/images/products/Chocolates/Chocolates3.jpg",
    title: "Ferrero rocher chocolate",
    description: "16 pieces",
    price: 350000, // 3,500 KES in cents
    slug: "ferrero-rocher-chocolate-16-pieces",
  },
];

// Convert predefined products to Product format
export function getPredefinedProducts(category: string): Product[] {
  const now = new Date().toISOString();
  
  if (category === "flowers") {
    return FLOWER_PRODUCTS.map((fp) => ({
      id: `flower-${fp.slug}`,
      title: fp.title,
      price: fp.price,
      images: [fp.image],
      slug: fp.slug,
      short_description: fp.description,
      description: fp.description,
      category: "flowers" as const,
      tags: [] as string[],
      created_at: now,
      updated_at: now,
    }));
  }
  
  if (category === "wines") {
    return WINE_PRODUCTS.map((wp) => ({
      id: `wine-${wp.slug}`,
      title: wp.title,
      price: wp.price,
      images: [wp.image],
      slug: wp.slug,
      short_description: wp.description,
      description: wp.description,
      category: "wines" as const,
      tags: [] as string[],
      created_at: now,
      updated_at: now,
    }));
  }
  
  if (category === "chocolates") {
    return CHOCOLATE_PRODUCTS.map((cp) => ({
      id: `chocolate-${cp.slug}`,
      title: cp.title,
      price: cp.price,
      images: [cp.image],
      slug: cp.slug,
      short_description: cp.description,
      description: cp.description,
      category: "chocolates" as const,
      tags: [] as string[],
      created_at: now,
      updated_at: now,
    }));
  }
  
  return [];
}

