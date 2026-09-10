"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";

interface SalePageClientProps {
  products: Product[];
}

export default function SalePageClient({ products }: SalePageClientProps) {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-brand-gray-50 border-b border-brand-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-3">
            Shop Our Catalog
          </h1>
          <p className="text-brand-gray-600 max-w-2xl mx-auto">
            A curated selection of our best flowers, hampers and gifts —
            delivered same day in Nairobi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {products.length === 0 ? (
          <div className="text-center py-20 text-brand-gray-500">
            No products available right now. Please check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price}
                image={
                  product.images?.[0] ||
                  getCategoryFallbackImage(product.category)
                }
                slug={product.slug}
                shortDescription={product.short_description}
                category={product.category}
                priority={index < 4}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
