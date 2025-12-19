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

  // Create display items from all flower images
  // Combine database products with predefined flower products
  const allDisplayItems = useMemo(() => {
    // Ensure products is always an array
    const safeProducts = Array.isArray(products) ? products : [];
    
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
  }, [products, flowerProducts]);

  // Show all subcategories on frontend (all active)
  const validSubcategories = useMemo(() => {
    return SUBCATEGORIES.flowers;
  }, []);

  // Group products by subcategory - support multiple subcategories via tags
  const productsBySubcategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};

    allDisplayItems.forEach((product) => {
      // Get subcategories from tags (for multiple subcategories) or single subcategory field
      const subcatsFromTags = (product.tags || []).filter(tag => 
        SUBCATEGORIES.flowers.includes(tag as any)
      ) as string[];
      const singleSubcat = product.subcategory && SUBCATEGORIES.flowers.includes(product.subcategory as any) 
        ? [product.subcategory] 
        : [];
      const allSubcats = [...new Set([...subcatsFromTags, ...singleSubcat])];

      // Add product to each of its subcategories
      allSubcats.forEach(subcat => {
        if (!grouped[subcat]) {
          grouped[subcat] = [];
        }
        // Avoid duplicates
        if (!grouped[subcat].some(p => p.id === product.id)) {
          grouped[subcat].push(product);
        }
      });
    });

    return grouped;
  }, [allDisplayItems]);

  // Get filtered products based on selected subcategory
  const filteredProducts = useMemo(() => {
    if (!selectedSubcategory) {
      // Show all products from all subcategories AND products without subcategories (that have images)
      const productsWithSubcats = Object.values(productsBySubcategory).flat();
      const productsWithoutSubcats = allDisplayItems.filter(product => {
        const hasImage = product.images && product.images.length > 0 && product.images[0];
        const hasSubcat = product.subcategory || (product.tags && product.tags.some(tag => SUBCATEGORIES.flowers.includes(tag as any)));
        return hasImage && !hasSubcat;
      });
      // Remove duplicates
      const allProducts = [...productsWithSubcats, ...productsWithoutSubcats];
      const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
      return uniqueProducts;
    }
    // Show only products from selected subcategory
    return productsBySubcategory[selectedSubcategory] || [];
  }, [productsBySubcategory, selectedSubcategory, allDisplayItems]);

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
                ? `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} in ${selectedSubcategory}`
                : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`
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
              {validSubcategories.map((subcat) => {
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

        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">
              {selectedSubcategory 
                ? `No ${selectedSubcategory} flowers available at the moment.`
                : "No flowers available at the moment."
              }
            </p>
            <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
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

