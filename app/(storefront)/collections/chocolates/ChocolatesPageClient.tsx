"use client";

import { useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";

interface ChocolateProduct {
  image: string;
  title: string;
  description: string;
  price: number;
  slug: string;
}

interface ChocolatesPageClientProps {
  products: Product[];
  allChocolateImages?: string[];
  chocolateProducts?: ChocolateProduct[];
}

export default function ChocolatesPageClient({ products, allChocolateImages = [], chocolateProducts = [] }: ChocolatesPageClientProps) {
  const allDisplayItems = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    
    const productImageUrls = new Set(
      safeProducts.flatMap(p => p.images || []).filter(Boolean)
    );
    
    const chocolateProductItems = chocolateProducts
      .filter(cp => !productImageUrls.has(cp.image))
      .map((cp) => ({
        id: `chocolate-${cp.slug}`,
        title: cp.title,
        price: cp.price,
        images: [cp.image],
        slug: cp.slug,
        short_description: cp.description,
        description: cp.description,
        category: "chocolates" as const,
        tags: [] as string[],
        subcategory: null,
      }));

    return [...safeProducts, ...chocolateProductItems];
  }, [products, chocolateProducts]);

  // Chocolates have no subcategories - just show all products

  // Track collection view
  useEffect(() => {
    Analytics.trackCollectionView("chocolates", allDisplayItems.length);
  }, [allDisplayItems.length]);

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            Premium Chocolate Collections
          </h1>
          <p className="text-brand-gray-600 text-lg max-w-3xl mx-auto mb-4">
            Indulge in our exquisite selection of premium chocolates, from luxurious Ferrero Rocher to artisanal truffles. Perfect for romantic gestures, celebrations, or simply treating yourself to something extraordinary.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-gray-500">
            <span className="bg-brand-gray-100 px-3 py-1 rounded-full">🍫 Luxury Brands</span>
            <span className="bg-brand-gray-100 px-3 py-1 rounded-full">🎁 Beautiful Packaging</span>
            <span className="bg-brand-gray-100 px-3 py-1 rounded-full">✨ Same-Day Delivery</span>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-brand-gray-500 text-sm">
            Showing {allDisplayItems.length} {allDisplayItems.length === 1 ? 'chocolate delight' : 'chocolate delights'}
          </p>
        </div>

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-brand-gray-50 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">🍫</div>
              <h3 className="font-heading font-semibold text-xl text-brand-gray-900 mb-2">
                Sweet Treats Coming Soon
              </h3>
              <p className="text-brand-gray-600 mb-6">
                Our premium chocolate collection is being refreshed with new delightful treats. Check back soon for irresistible indulgences perfect for any occasion.
              </p>
              <a
                href="https://wa.me/254721554393"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Contact for Chocolate Recommendations
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

