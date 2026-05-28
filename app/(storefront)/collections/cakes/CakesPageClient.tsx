"use client";

import { useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";

interface CakeProduct {
  image: string;
  title: string;
  description: string;
  price: number;
  slug: string;
}

interface CakesPageClientProps {
  products: Product[];
  allCakeImages?: string[];
  cakeProducts?: CakeProduct[];
}

export default function CakesPageClient({ products, allCakeImages = [], cakeProducts = [] }: CakesPageClientProps) {
  const allDisplayItems = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    const productImageUrls = new Set(
      safeProducts.flatMap((p) => p.images || []).filter(Boolean)
    );

    const cakeProductItems = cakeProducts
      .filter((cp) => !productImageUrls.has(cp.image))
      .map((cp) => ({
        id: `cake-${cp.slug}`,
        title: cp.title,
        price: cp.price,
        images: [cp.image],
        slug: cp.slug,
        short_description: cp.description,
        description: cp.description,
        category: "cakes" as const,
        tags: [] as string[],
        subcategory: null,
      }));

    return [...safeProducts, ...cakeProductItems];
  }, [products, cakeProducts]);

  useEffect(() => {
    Analytics.trackCollectionView("cakes", allDisplayItems.length);
  }, [allDisplayItems.length]);

  return (
    <div className="py-12 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-6">
            <span className="text-2xl">🎂</span>
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-5xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Delicious Cake Collections
          </h1>
          <p className="text-brand-gray-700 text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
            Indulge in our heavenly selection of freshly baked cakes perfect for every celebration. From rich chocolate fudge to elegant vanilla dreams, each cake is crafted with love and premium ingredients.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium hover:from-pink-200 hover:to-purple-200 transition-colors">🎂 Freshly Baked Daily</span>
            <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium hover:from-pink-200 hover:to-purple-200 transition-colors">🎁 Custom Designs</span>
            <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium hover:from-pink-200 hover:to-purple-200 transition-colors">✨ Same-Day Delivery</span>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-brand-gray-600 text-sm font-medium bg-white/60 backdrop-blur-sm inline-block px-4 py-2 rounded-full border border-purple-200">
            Discover {allDisplayItems.length} {allDisplayItems.length === 1 ? 'sweet creation' : 'sweet creations'}
          </p>
        </div>

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 max-w-md mx-auto border border-purple-200 shadow-lg">
              <div className="text-5xl mb-4">🧁</div>
              <h3 className="font-heading font-semibold text-xl text-purple-800 mb-3">
                Sweet Treats Coming Soon
              </h3>
              <p className="text-brand-gray-700 mb-6 leading-relaxed">
                Our bakery is busy preparing new delicious cakes for you. Check back soon for irresistible treats perfect for your special moments.
              </p>
              <a
                href="https://wa.me/254721554393"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <span>💬</span> Request Custom Cake
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {allDisplayItems.map((item) => {
              const imageUrl =
                item.images && item.images.length > 0 && item.images[0]
                  ? item.images[0]
                  : getCategoryFallbackImage(item.category);

              return (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.title}
                  price={item.price}
                  image={imageUrl}
                  slug={item.slug}
                  shortDescription={item.short_description}
                  category={item.category}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

