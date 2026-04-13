"use client";

import { useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";

interface WineProduct {
  image: string;
  title: string;
  description: string;
  price: number;
  slug: string;
}

interface WinesPageClientProps {
  products: Product[];
  allWineImages?: string[];
  wineProducts?: WineProduct[];
}

export default function WinesPageClient({ products, allWineImages = [], wineProducts = [] }: WinesPageClientProps) {
  const allDisplayItems = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    
    const productImageUrls = new Set(
      safeProducts.flatMap(p => p.images || []).filter(Boolean)
    );
    
    const wineProductItems = wineProducts
      .filter(wp => !productImageUrls.has(wp.image))
      .map((wp) => ({
        id: `wine-${wp.slug}`,
        title: wp.title,
        price: wp.price,
        images: [wp.image],
        slug: wp.slug,
        short_description: wp.description,
        description: wp.description,
        category: "wines" as const,
        tags: [] as string[],
        subcategory: null,
      }));

    return [...safeProducts, ...wineProductItems];
  }, [products, wineProducts]);

  // Wines have no subcategories - just show all products

  // Track collection view
  useEffect(() => {
    Analytics.trackCollectionView("wines", allDisplayItems.length);
  }, [allDisplayItems.length]);

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            Premium Wine Collections
          </h1>
          <p className="text-brand-gray-600 text-lg max-w-3xl mx-auto mb-4">
            Discover our curated selection of premium wines perfect for celebrations, romantic evenings, and special gifts. From elegant reds to sparkling whites, each bottle is carefully chosen for exceptional quality and taste.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-gray-500">
            <span className="bg-brand-gray-100 px-3 py-1 rounded-full">✨ Same-Day Delivery</span>
            <span className="bg-brand-gray-100 px-3 py-1 rounded-full">🎁 Gift Wrapped</span>
            <span className="bg-brand-gray-100 px-3 py-1 rounded-full">🍷 Premium Selection</span>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-brand-gray-500 text-sm">
            Showing {allDisplayItems.length} {allDisplayItems.length === 1 ? 'premium wine' : 'premium wines'}
          </p>
        </div>

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-brand-gray-50 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">🍷</div>
              <h3 className="font-heading font-semibold text-xl text-brand-gray-900 mb-2">
                Premium Wines Coming Soon
              </h3>
              <p className="text-brand-gray-600 mb-6">
                Our curated wine collection is being updated. Check back soon for exceptional wines perfect for your celebrations.
              </p>
              <a
                href="https://wa.me/254721554393"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Contact for Wine Recommendations
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {allDisplayItems.map((item) => {
              const imageUrl = item.images && item.images.length > 0 && item.images[0] 
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

