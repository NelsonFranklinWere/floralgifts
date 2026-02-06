"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/db";

interface AddOnsProps {
  excludeProductIds?: string[];
  onOpenChange?: (isOpen: boolean) => void;
}

export default function AddOns({ excludeProductIds = [], onOpenChange }: AddOnsProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [viewedProductIds, setViewedProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAddOns = async () => {
      setLoading(true);
      try {
        const categories = ["chocolates", "wines", "teddy", "cards"];
        const fetchedProducts: Product[] = [];

        for (const category of categories) {
          try {
            const response = await fetch(`/api/products?category=${category}`);
            if (response.ok) {
              const data = await response.json();
              console.log(`[AddOns] Fetched ${data.length} products for category: ${category}`, data);
              if (Array.isArray(data)) {
                fetchedProducts.push(...data);
              }
            } else {
              const errorData = await response.json().catch(() => ({}));
              console.error(`[AddOns] Error fetching ${category}:`, response.status, errorData);
            }
          } catch (error) {
            console.error(`[AddOns] Error fetching category ${category}:`, error);
          }
        }

        console.log(`[AddOns] Total fetched products: ${fetchedProducts.length}`);
        console.log(`[AddOns] Excluding product IDs:`, excludeProductIds);

        // Filter out products already in cart
        const filtered = fetchedProducts.filter(
          (p) => !excludeProductIds.includes(p.id)
        );

        console.log(`[AddOns] Products after filtering: ${filtered.length}`);

        // Shuffle all products
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setAllProducts(shuffled);
        
        // Show first 4 products (or all if less than 4)
        const initialProducts = shuffled.slice(0, Math.min(4, shuffled.length));
        console.log(`[AddOns] Setting initial products: ${initialProducts.length}`);
        setDisplayedProducts(initialProducts);
        setViewedProductIds(new Set(initialProducts.map(p => p.id)));
      } catch (error) {
        console.error("[AddOns] Error fetching add-ons:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && mounted) {
      fetchAddOns();
    } else if (!isOpen) {
      // Reset when closed
      setDisplayedProducts([]);
      setViewedProductIds(new Set());
      setAllProducts([]);
      onOpenChange?.(false);
    }
  }, [isOpen, excludeProductIds, mounted, onOpenChange]);

  const handleViewMore = () => {
    // Get products that haven't been viewed yet
    const remainingProducts = allProducts.filter(
      (p) => !viewedProductIds.has(p.id)
    );

    if (remainingProducts.length > 0) {
      // Get next 4 random products from remaining
      const nextProducts = remainingProducts.slice(0, 4);
      
      // Update displayed products (replace old ones with new ones)
      setDisplayedProducts(nextProducts);
      
      // Add new products to viewed set
      const newViewedIds = new Set(viewedProductIds);
      nextProducts.forEach(p => newViewedIds.add(p.id));
      setViewedProductIds(newViewedIds);
    }
  };

  const hasMoreProducts = allProducts.filter(
    (p) => !viewedProductIds.has(p.id)
  ).length > 0;

  if (!mounted) {
    return (
      <div>
        <button
          type="button"
          className="btn-primary w-full text-sm py-2"
          disabled
        >
          Add Ons
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
          onOpenChange?.(newState);
        }}
        className="btn-primary w-full text-sm py-2"
      >
        {isOpen ? "Hide Add Ons" : "Add Ons"}
      </button>

      {isOpen && (
        <div className="mt-3">
          {loading ? (
            <div className="text-center py-4 text-brand-gray-600 text-sm">
              Loading add-ons...
            </div>
          ) : displayedProducts.length === 0 && allProducts.length === 0 ? (
            <div className="text-center py-4 text-brand-gray-600 text-sm">
              No add-ons available at the moment.
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-4 text-brand-gray-600 text-sm">
              No more add-ons to display.
            </div>
          ) : (
            <div>
              <h3 className="font-heading font-semibold text-sm mb-3">
                Recommended Add-Ons
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {displayedProducts.map((product) => {
                  const handleAddToCart = () => {
                    addItem({
                      id: product.id,
                      name: product.title,
                      price: product.price,
                      image: product.images[0] || "/images/products/flowers/BouquetFlowers1.jpg",
                      slug: product.slug,
                    });
                  };

                  return (
                    <div key={product.id} className="card p-3">
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-gray-100 mb-2">
                        <Image
                          src={product.images[0] || "/images/products/flowers/BouquetFlowers1.jpg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <h4 className="font-heading font-semibold text-xs text-brand-gray-900 mb-1 line-clamp-2">
                        {product.title}
                      </h4>
                      <p className="font-mono font-semibold text-brand-green text-sm mb-2">
                        {formatCurrency(product.price)}
                      </p>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="btn-primary w-full flex items-center justify-center gap-1 text-xs py-1.5"
                        aria-label={`Add ${product.title} to cart`}
                      >
                        <ShoppingCartIcon className="h-3 w-3" />
                        Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
              {hasMoreProducts && (
                <button
                  type="button"
                  onClick={handleViewMore}
                  className="btn-outline w-full text-sm py-2 mt-3"
                >
                  View More
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

