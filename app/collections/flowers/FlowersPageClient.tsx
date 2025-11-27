"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";

interface FlowerProduct {
  image: string;
  title: string;
  description: string;
  price: number;
  slug: string;
}

interface FlowersPageClientProps {
  products: Product[];
  allFlowerImages?: string[];
  flowerProducts?: FlowerProduct[];
}

export default function FlowersPageClient({ products, allFlowerImages = [], flowerProducts = [] }: FlowersPageClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Create display items from all flower images
  // Combine database products with predefined flower products
  const allDisplayItems = useMemo(() => {
    const productImageUrls = new Set(
      safeProducts.flatMap(p => p.images || []).filter(Boolean)
    );
    
    // Create items from predefined flower products for images not in database
    const flowerProductItems = flowerProducts
      .filter(fp => !productImageUrls.has(fp.image))
      .map((fp) => ({
        id: `flower-${fp.slug}`,
        title: fp.title,
        price: fp.price,
        images: [fp.image],
        slug: fp.slug,
        short_description: fp.description,
        description: fp.description,
        category: "flowers" as const,
        tags: [] as string[],
      }));

    // Combine database products with predefined flower products
    return [...safeProducts, ...flowerProductItems];
  }, [safeProducts, flowerProducts]);

  // Track collection view
  useEffect(() => {
    Analytics.trackCollectionView("flowers", allDisplayItems.length);
  }, [allDisplayItems.length]);

  // Helper function to categorize product by name
  const getProductCategory = (productName: string): string[] => {
    const name = productName.toLowerCase();
    const categories: string[] = [];
    
    if (name.includes("birthday") || name.includes("bday")) {
      categories.push("birthday");
    }
    if (name.includes("anniversary") || name.includes("anniv")) {
      categories.push("anniversary");
    }
    if (name.includes("get well") || name.includes("well soon") || name.includes("recovery")) {
      categories.push("get well soon");
    }
    if (name.includes("funeral") || name.includes("condolence") || name.includes("sympathy") || name.includes("rip")) {
      categories.push("funeral");
    }
    if (name.includes("congrat") || name.includes("graduation") || name.includes("success")) {
      categories.push("congrats");
    }
    if (name.includes("wedding") || name.includes("bridal") || name.includes("bride")) {
      categories.push("wedding");
    }
    if (name.includes("valentine") || name.includes("romantic") || name.includes("love") || name.includes("rose")) {
      categories.push("valentine");
    }
    
    return categories;
  };

  const filteredProducts = useMemo(() => {
    if (selectedTags.length === 0) {
      return allDisplayItems;
    }
    return allDisplayItems.filter((product) => {
      // Check both tags and product name for categorization
      const productTags = product.tags || [];
      const nameCategories = getProductCategory(product.title || "");
      const allCategories = [...productTags, ...nameCategories];
      
      return selectedTags.some((tag) => 
        allCategories.some(cat => cat.toLowerCase() === tag.toLowerCase())
      );
    });
  }, [selectedTags, allDisplayItems]);

  return (
    <div className="py-6 md:py-8 lg:py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2">
            Flower Collections
          </h1>
          <p className="text-brand-gray-600 text-sm md:text-base">
            Beautiful bouquets for every occasion
          </p>
          <div className="text-brand-gray-500 text-xs md:text-sm mt-1">
            {selectedTags.length > 0 ? (
              <div>
                <span>Showing {filteredProducts.length} of {allDisplayItems.length} {allDisplayItems.length === 1 ? 'product' : 'products'}</span>
                {filteredProducts.length < allDisplayItems.length && (
                  <button
                    type="button"
                    onClick={() => setSelectedTags([])}
                    className="ml-2 text-brand-green hover:underline focus:outline-none focus:underline"
                    aria-label="Clear filter"
                  >
                    (Clear filter)
                  </button>
                )}
              </div>
            ) : (
              <span>Showing {allDisplayItems.length} {allDisplayItems.length === 1 ? 'product' : 'products'}</span>
            )}
          </div>
        </div>

        <FilterBar type="flowers" selectedTags={selectedTags} onTagChange={setSelectedTags} />

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">No flowers available at the moment.</p>
            <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">No flowers found with selected filters.</p>
            <button
              type="button"
              onClick={() => setSelectedTags([])}
              className="btn-outline"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => {
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

