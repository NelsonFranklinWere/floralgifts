"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";

interface Props {
  products: Product[];
  recipientLabel: string;
  emptyMessage?: string;
}

export default function RecipientGiftsClient({
  products,
  recipientLabel,
  emptyMessage,
}: Props) {
  if (!products.length) {
    return (
      <p className="text-center text-brand-gray-600 py-16">
        {emptyMessage || `No gifts for ${recipientLabel} right now. Check back soon.`}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id || product.slug}
          id={product.id}
          name={product.title}
          price={product.price}
          image={
            product.images?.[0] || getCategoryFallbackImage(product.category)
          }
          slug={product.slug}
          category={product.category}
        />
      ))}
    </div>
  );
}
