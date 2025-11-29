"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";
import { SUBCATEGORIES } from "@/lib/subcategories";

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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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
          subcategory: tp.size ? `${tp.size}cm` : null,
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
          subcategory: null,
          created_at: now,
          updated_at: now,
        };
      });

    displayItems.push(...imageOnlyItems);

    return displayItems;
  }, [products, allTeddyImages, teddyProducts]);

  // Group products by subcategory (size)
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

    // Sort subcategories by the order in SUBCATEGORIES.teddy
    const orderedSubcategories = SUBCATEGORIES.teddy.filter(subcat => grouped[subcat]);
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

  // Filter products by selected size
  const filteredProductsBySubcategory = useMemo(() => {
    if (!selectedSize) {
      return productsBySubcategory;
    }
    const filtered = productsBySubcategory.filter(({ subcategory }) => subcategory === selectedSize);
    // If no products found for this size, return empty array with the size info
    if (filtered.length === 0) {
      return [{ subcategory: selectedSize, products: [] }];
    }
    return filtered;
  }, [productsBySubcategory, selectedSize]);

  // Track collection view
  useEffect(() => {
    Analytics.trackCollectionView("teddy", allDisplayItems.length);
  }, [allDisplayItems.length]);


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
            <span>
              {selectedSize 
                ? `Showing ${filteredProductsBySubcategory.reduce((sum, { products }) => sum + products.length, 0)} of ${allDisplayItems.length} ${allDisplayItems.length === 1 ? 'product' : 'products'}`
                : `Showing ${allDisplayItems.length} ${allDisplayItems.length === 1 ? 'product' : 'products'}`
              }
            </span>
          </p>
        </div>

        {/* Size Filter Bar */}
        {allDisplayItems.length > 0 && (
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 flex-nowrap">
              <button
                type="button"
                onClick={() => setSelectedSize(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  selectedSize === null
                    ? "bg-brand-green text-white border-2 border-brand-green"
                    : "bg-white text-brand-gray-900 border-2 border-brand-red hover:border-brand-green hover:bg-brand-green hover:text-white"
                }`}
              >
                All
              </button>
              {SUBCATEGORIES.teddy.map((size) => {
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      selectedSize === size
                        ? "bg-brand-green text-white border-2 border-brand-green"
                        : "bg-white text-brand-gray-900 border-2 border-brand-red hover:border-brand-green hover:bg-brand-green hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">No teddy bears available at the moment.</p>
            <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredProductsBySubcategory.map(({ subcategory, products }) => (
              <div key={subcategory} className="space-y-4">
                <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-brand-gray-900 border-b border-brand-gray-200 pb-2">
                  {subcategory} Teddy Bears
                </h2>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-brand-gray-600 text-base mb-2">No {subcategory} teddy bears available at the moment.</p>
                    <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => {
                      const imageUrl = product.images && product.images.length > 0 && product.images[0] 
                        ? product.images[0] 
                        : getCategoryFallbackImage(product.category);
                      
                      // Build description with color info for teddy bears
                      let description = product.short_description || "";
                      if (product.teddy_color) {
                        const colorText = product.teddy_color.charAt(0).toUpperCase() + product.teddy_color.slice(1);
                        if (!description.toLowerCase().includes(colorText.toLowerCase())) {
                          description = description ? `${description} - ${colorText}` : colorText;
                        }
                      }
                      
                      return (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.title}
                          price={product.price}
                          image={imageUrl}
                          slug={product.slug}
                          shortDescription={description}
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

