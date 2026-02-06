"use client";

import { useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";

interface HamperProduct {
  image: string;
  title: string;
  description: string;
  price: number;
  slug: string;
}

interface GiftHampersPageClientProps {
  products: Product[];
  allHamperImages?: string[];
  hamperProducts?: HamperProduct[];
}

export default function GiftHampersPageClient({ products, allHamperImages = [], hamperProducts = [] }: GiftHampersPageClientProps) {
  // Create display items from predefined hamper products
  const allDisplayItems = useMemo(() => {
    const productImageUrls = new Set(
      products.flatMap(p => p.images || []).filter(Boolean)
    );
    
    // Convert predefined hamper products to display format
    const hamperProductItems = hamperProducts.map((hp, index) => ({
      id: `hamper-product-${index}`,
      title: hp.title,
      price: hp.price,
      images: [hp.image],
      slug: hp.slug,
      short_description: hp.description,
      category: "hampers" as const,
      tags: [] as string[],
      subcategory: null,
    }));

    // Combine database products with predefined products only
    // Removed auto-generation of products from unmapped images
    return [...products, ...hamperProductItems];
  }, [products, hamperProducts]);

  // Gift hampers have no subcategories - just show all products

  // Track collection view
  useEffect(() => {
    Analytics.trackCollectionView("hampers", allDisplayItems.length);
  }, [allDisplayItems.length]);

  return (
    <div className="py-6 md:py-8 lg:py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2">
            Gift Hampers
          </h1>
          <p className="text-brand-gray-600 text-sm md:text-base">
            Luxury gift hampers filled with curated items
          </p>
          <p className="text-brand-gray-500 text-xs md:text-sm mt-1">
            Showing {allDisplayItems.length} {allDisplayItems.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">No gift hampers available at the moment.</p>
            <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {allDisplayItems.map((product) => {
              const imageUrl = product.images && product.images.length > 0 && product.images[0] 
                ? product.images[0] 
                : getCategoryFallbackImage(product.category);
              
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  image={imageUrl}
                  slug={product.slug}
                  shortDescription={product.short_description}
                  category={product.category}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

