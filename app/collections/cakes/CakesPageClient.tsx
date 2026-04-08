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
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            Cake Collections
          </h1>
          <p className="text-brand-gray-600 text-lg">
            Cakes for birthdays, anniversaries and celebrations
          </p>
          <p className="text-brand-gray-500 text-sm mt-2">
            Showing {allDisplayItems.length} {allDisplayItems.length === 1 ? "product" : "products"}
          </p>
        </div>

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brand-gray-600 text-lg mb-4">No cakes available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
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

