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
    
    // First, add ALL database products with images (track images to prevent duplicates)
    products.forEach(product => {
      const productImages = product.images || [];
      const hasImage = productImages.some(img => img && img.trim() !== '');
      if (hasImage) {
        // Only add if at least one image hasn't been used yet (prevent duplicates)
        const hasNewImage = productImages.some(img => img && !usedImages.has(img));
        if (hasNewImage) {
          displayItems.push(product);
          productImages.forEach(img => {
            if (img && img.trim() !== '') usedImages.add(img);
          });
        }
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

  // Always show all teddy bear sizes from admin subcategories (all 7 sizes)
  const validSubcategories = useMemo(() => {
    return SUBCATEGORIES.teddy; // Always show all sizes: 25cm, 50cm, 100cm, 120cm, 160cm, 180cm, 200cm
  }, []);

  // Group products by subcategory (size) - support multiple subcategories via tags, subcategory field, and teddy_size field
  const productsBySubcategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};

    allDisplayItems.forEach((product) => {
      // Get subcategories from multiple sources:
      // 1. Tags array (for multiple subcategories)
      const subcatsFromTags = (product.tags || []).filter(tag => 
        SUBCATEGORIES.teddy.includes(tag as any)
      ) as string[];
      
      // 2. Single subcategory field (string like "100cm")
      const singleSubcat = product.subcategory && SUBCATEGORIES.teddy.includes(product.subcategory as any) 
        ? [product.subcategory] 
        : [];
      
      // 3. teddy_size field (number like 100, 120) - convert to "100cm", "120cm" format
      const subcatFromSize = product.teddy_size 
        ? [`${product.teddy_size}cm`].filter(size => SUBCATEGORIES.teddy.includes(size as any))
        : [];
      
      // Combine all subcategories
      const allSubcats = [...new Set([...subcatsFromTags, ...singleSubcat, ...subcatFromSize])];

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

  // Get filtered products based on selected size
  const filteredProducts = useMemo(() => {
    if (!selectedSize) {
      // Show ALL products with images (from all sizes AND products without subcategories)
      const productsWithSubcats = Object.values(productsBySubcategory).flat();
      const productsWithoutSubcats = allDisplayItems.filter(product => {
        const hasImage = product.images && product.images.length > 0 && product.images[0];
        // Check if product has any size assigned (via tags, subcategory, or teddy_size)
        const hasSubcatFromTags = product.tags && product.tags.some(tag => SUBCATEGORIES.teddy.includes(tag as any));
        const hasSubcatFromField = product.subcategory && SUBCATEGORIES.teddy.includes(product.subcategory as any);
        const hasSubcatFromSize = product.teddy_size && SUBCATEGORIES.teddy.includes(`${product.teddy_size}cm` as any);
        const hasSubcat = hasSubcatFromTags || hasSubcatFromField || hasSubcatFromSize;
        return hasImage && !hasSubcat;
      });
      // Remove duplicates and ensure all products with images are shown
      const allProducts = [...productsWithSubcats, ...productsWithoutSubcats];
      const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
      return uniqueProducts;
    }
    // Show only products from selected size
    return productsBySubcategory[selectedSize] || [];
  }, [productsBySubcategory, selectedSize, allDisplayItems]);

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
                ? `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} in ${selectedSize}`
                : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`
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
              {validSubcategories.map((size) => {
                const hasProducts = productsBySubcategory[size] && productsBySubcategory[size].length > 0;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    disabled={!hasProducts}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      selectedSize === size
                        ? "bg-brand-green text-white border-2 border-brand-green"
                        : hasProducts
                        ? "bg-white text-brand-gray-900 border-2 border-brand-red hover:border-brand-green hover:bg-brand-green hover:text-white"
                        : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">
              {selectedSize 
                ? `No ${selectedSize} teddy bears available at the moment.`
                : "No teddy bears available at the moment."
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
    </div>
  );
}

