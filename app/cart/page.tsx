"use client";

import { useCartStore } from "@/lib/store/cart";
import CheckoutForm from "@/components/CheckoutForm";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const subtotal = getTotal();

  if (items.length === 0) {
    return (
      <div className="py-12 bg-white min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-brand-gray-600 mb-8">
            Start shopping to add items to your cart
          </p>
          <Link href="/collections" className="btn-primary inline-block">
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-12 bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-brand-gray-900 mb-8 sm:mb-12">
          Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-0 border-b border-brand-gray-200">
              {items.map((item, index) => {
                const itemKey = `${item.id}-${JSON.stringify(item.options || {})}`;
                return (
                  <div key={itemKey} className="py-6 border-t border-brand-gray-200 first:border-t-0">
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-md bg-brand-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 96px, 128px"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-medium text-base sm:text-lg text-brand-gray-900 hover:text-brand-gray-700 transition-colors block mb-3"
                        >
                          {item.name}
                        </Link>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2 border border-brand-gray-300 rounded">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.options)}
                              className="p-2 hover:bg-brand-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <MinusIcon className="h-4 w-4 text-brand-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.options)}
                              className="p-2 hover:bg-brand-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <PlusIcon className="h-4 w-4 text-brand-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Link */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id, item.options)}
                          className="text-sm text-brand-gray-600 hover:text-brand-red transition-colors underline"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-right">
                        <p className="font-medium text-base sm:text-lg text-brand-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Checkout Form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <CheckoutForm />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs sm:text-sm text-brand-gray-500 mt-8 text-center">
          Shipping, taxes, and discount codes calculated at checkout.
        </p>
      </div>
    </div>
  );
}
