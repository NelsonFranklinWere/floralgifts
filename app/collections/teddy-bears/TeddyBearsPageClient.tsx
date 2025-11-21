"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";

interface TeddyProduct {
  image: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  size: number;
  color: string | null;
}

interface TeddyBearsPageClientProps {
  products: Product[];
  allTeddyImages?: string[];
  teddyProducts?: TeddyProduct[];
}

export default function TeddyBearsPageClient({ products, allTeddyImages = [], teddyProducts = [] }: TeddyBearsPageClientProps) {
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  // Create display items from predefined teddy products
  const allDisplayItems = useMemo(() => {
    // Track all used images to prevent duplicates
    const usedImages = new Set<string>();
    const displayItems: Product[] = [];
    
    // First, add database products and track their images
    products.forEach(product => {
      const productImages = product.images || [];
      const hasNewImage = productImages.some(img => img && !usedImages.has(img));
      if (hasNewImage) {
        displayItems.push(product);
        productImages.forEach(img => {
          if (img) usedImages.add(img);
        });
      }
    });
    
    // Convert predefined teddy products to display format (only if image not already used)
    const teddyProductItems: Product[] = teddyProducts
      .filter(tp => !usedImages.has(tp.image))
      .map((tp, index) => {
        usedImages.add(tp.image);
        const now = new Date().toISOString();
        return {
          id: `teddy-product-${index}`,
          title: tp.title,
          price: tp.price,
          images: [tp.image],
          slug: tp.slug,
          description: tp.description + ". Available in brown, white, red, pink, and blue.",
          short_description: tp.description + ". Available in brown, white, red, pink, and blue.",
          category: "teddy" as const,
          tags: [] as string[],
          teddy_size: tp.size,
          teddy_color: tp.color,
          created_at: now,
          updated_at: now,
        };
      });
    
    displayItems.push(...teddyProductItems);

    // Create items for images that aren't in any product or predefined products
    const imageOnlyItems: Product[] = allTeddyImages
      .filter(img => img && !usedImages.has(img))
      .map((image, index) => {
        usedImages.add(image);
        const now = new Date().toISOString();
        return {
          id: `teddy-image-${index}`,
          title: `Cuddly Teddy Bear ${index + 1}`,
          price: 5000, // Default price
          images: [image],
          slug: `teddy-bear-${index + 1}`,
          description: "Cuddly teddy bear perfect for gifts. Available in brown, white, red, pink, and blue.",
          short_description: "Cuddly teddy bear perfect for gifts. Available in brown, white, red, pink, and blue.",
          category: "teddy" as const,
          tags: [] as string[],
          teddy_size: null,
          teddy_color: null,
          created_at: now,
          updated_at: now,
        };
      });

    displayItems.push(...imageOnlyItems);

    return displayItems;
  }, [products, allTeddyImages, teddyProducts]);

  // Track collection view
  useEffect(() => {
    Analytics.trackCollectionView("teddy", allDisplayItems.length);
  }, [allDisplayItems.length]);

  const filteredProducts = useMemo(() => {
    let filtered = allDisplayItems;

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(
        (product) => product.teddy_size && selectedSizes.includes(product.teddy_size)
      );
    }

    return filtered;
  }, [selectedSizes, allDisplayItems]);

  const clearFilters = () => {
    setSelectedSizes([]);
  };

  const hasActiveFilters = selectedSizes.length > 0;

  return (
    <div className="py-6 md:py-8 lg:py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2">
            Teddy Bears
          </h1>
          <p className="text-brand-gray-600 text-sm md:text-base">
            Cuddly teddy bears in various sizes. Available in brown, white, red, pink, and blue.
          </p>
          <p className="text-brand-gray-500 text-xs md:text-sm mt-1">
            {selectedSizes.length > 0 ? (
              <>
                Showing {filteredProducts.length} of {allDisplayItems.length} {allDisplayItems.length === 1 ? 'product' : 'products'}
              </>
            ) : (
              <>Showing {allDisplayItems.length} {allDisplayItems.length === 1 ? 'product' : 'products'}</>
            )}
          </p>
        </div>

        <FilterBar
          type="teddy"
          selectedSizes={selectedSizes}
          onSizeChange={setSelectedSizes}
        />

        {hasActiveFilters && (
          <div className="mb-6">
            <button type="button" onClick={clearFilters} className="btn-outline text-sm">
              Clear All Filters
            </button>
          </div>
        )}

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">No teddy bears available at the moment.</p>
            <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">
              No teddy bears found with selected filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-outline"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
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
                  hideDetailsButton={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

