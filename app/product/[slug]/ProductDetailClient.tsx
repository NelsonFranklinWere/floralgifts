"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/db";
import { Analytics } from "@/lib/analytics";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    Analytics.trackProductView(
      product.id,
      product.title,
      product.category,
      product.price
    );
  }, [product.id, product.title, product.category, product.price]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0] || "",
        slug: product.slug,
      });
    }
    Analytics.trackAddToCart(
      product.id,
      product.title,
      product.price,
      quantity
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium text-brand-gray-900">
          Quantity:
        </label>
        <div className="flex items-center gap-2 border-2 border-brand-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-brand-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 hover:bg-brand-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex">
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn-primary w-full inline-flex items-center justify-center gap-2"
          aria-label={`Add ${quantity} ${product.title} to cart`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
