"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";
import { SUBCATEGORIES } from "@/lib/subcategories";

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
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
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
        subcategory: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

    // Combine database products with predefined flower products
    return [...safeProducts, ...flowerProductItems];
  }, [safeProducts, flowerProducts]);

  // Group products by subcategory
  const productsBySubcategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    const uncategorized: Product[] = [];

    allDisplayItems.forEach((product) => {
      const subcat = product.subcategory || "Uncategorized";
      if (subcat === "Uncategorized") {
        uncategorized.push(product);
      } else {
        if (!grouped[subcat]) {
          grouped[subcat] = [];
        }
        grouped[subcat].push(product);
      }
    });

    // Sort subcategories by the order in SUBCATEGORIES.flowers
    const orderedSubcategories = SUBCATEGORIES.flowers.filter(subcat => grouped[subcat]);
    const result: Array<{ subcategory: string; products: Product[] }> = [];
    
    orderedSubcategories.forEach(subcat => {
      result.push({ subcategory: subcat, products: grouped[subcat] });
    });

    // Add uncategorized at the end if any
    if (uncategorized.length > 0) {
      result.push({ subcategory: "Uncategorized", products: uncategorized });
    }

    return result;
  }, [allDisplayItems]);

  // Filter products by selected subcategory
  const filteredProductsBySubcategory = useMemo(() => {
    if (!selectedSubcategory) {
      return productsBySubcategory;
    }
    const filtered = productsBySubcategory.filter(({ subcategory }) => subcategory === selectedSubcategory);
    // If no products found for this subcategory, return empty array with the subcategory info
    if (filtered.length === 0) {
      return [{ subcategory: selectedSubcategory, products: [] }];
    }
    return filtered;
  }, [productsBySubcategory, selectedSubcategory]);

  // Track collection view
  useEffect(() => {
    Analytics.trackCollectionView("flowers", allDisplayItems.length);
  }, [allDisplayItems.length]);

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
            <span>
              {selectedSubcategory 
                ? `Showing ${filteredProductsBySubcategory.reduce((sum, { products }) => sum + products.length, 0)} of ${allDisplayItems.length} ${allDisplayItems.length === 1 ? 'product' : 'products'}`
                : `Showing ${allDisplayItems.length} ${allDisplayItems.length === 1 ? 'product' : 'products'}`
              }
            </span>
          </div>
        </div>

        {/* Subcategory Filter Bar */}
        {allDisplayItems.length > 0 && (
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 flex-nowrap">
              <button
                type="button"
                onClick={() => setSelectedSubcategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  selectedSubcategory === null
                    ? "bg-brand-green text-white border-2 border-brand-green"
                    : "bg-white text-brand-gray-900 border-2 border-brand-red hover:border-brand-green hover:bg-brand-green hover:text-white"
                }`}
              >
                All
              </button>
              {SUBCATEGORIES.flowers.map((subcat) => {
                const hasProducts = productsBySubcategory.some(({ subcategory }) => subcategory === subcat);
                return (
                  <button
                    key={subcat}
                    type="button"
                    onClick={() => setSelectedSubcategory(subcat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      selectedSubcategory === subcat
                        ? "bg-brand-green text-white border-2 border-brand-green"
                        : "bg-white text-brand-gray-900 border-2 border-brand-red hover:border-brand-green hover:bg-brand-green hover:text-white"
                    }`}
                  >
                    {subcat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">No flowers available at the moment.</p>
            <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredProductsBySubcategory.map(({ subcategory, products }) => (
              <div key={subcategory} className="space-y-4">
                <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-brand-gray-900 border-b border-brand-gray-200 pb-2">
                  {subcategory}
                </h2>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-brand-gray-600 text-base mb-2">No {subcategory.toLowerCase()} flowers available at the moment.</p>
                    <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => {
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

