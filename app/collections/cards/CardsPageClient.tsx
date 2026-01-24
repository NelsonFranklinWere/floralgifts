"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
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
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="card overflow-hidden group">
                <div className="relative aspect-square overflow-hidden bg-brand-gray-100">
                  <Image
                    src={product.images[0] || "/images/giftcards/card1.png"}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-2 group-hover:text-brand-green transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-brand-gray-600 text-sm mb-3 line-clamp-2">
                    {product.short_description}
                  </p>
                  <p className="font-mono font-bold text-xl text-brand-green">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
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