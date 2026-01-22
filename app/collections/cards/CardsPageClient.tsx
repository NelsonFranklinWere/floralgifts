"use client";

import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/db";

export default function CardsPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?category=cards");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            Gift Cards
          </h1>
          <p className="text-brand-gray-600 text-lg max-w-2xl mx-auto">
            Perfect gift cards for any occasion. Let them choose their favorite flowers, teddy bears, and gifts from our collection.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
            <p className="mt-4 text-brand-gray-600">Loading gift cards...</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brand-gray-600 text-lg">
              Gift cards coming soon! Check back later for our digital and physical gift card options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}