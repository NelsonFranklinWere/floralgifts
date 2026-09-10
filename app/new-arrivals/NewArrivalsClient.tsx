"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";

interface NewArrivalsClientProps {
  products: Product[];
}

export default function NewArrivalsClient({ products }: NewArrivalsClientProps) {
  return (
    <div className="min-h-screen bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10 text-center max-w-2xl mx-auto">
          <p className="font-body text-[11px] uppercase tracking-[0.18em] text-brand-gray-600 mb-2">
            Just in
          </p>
          <h1 className="font-playfair font-semibold text-xl sm:text-2xl md:text-3xl text-brand-gray-900 mb-2">
            New Arrivals
          </h1>
          <p className="font-body text-xs sm:text-sm text-brand-gray-600 leading-relaxed">
            Our latest flowers, hampers and gifts — shown newest first.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-brand-gray-500 py-16 text-sm">
            No new products right now. Check back soon.
          </p>
        ) : (
          <>
            <p className="text-center text-xs text-brand-gray-500 mb-6">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
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
          </>
        )}
      </div>
    </div>
  );
}
