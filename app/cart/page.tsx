"use client";

import { useCartStore } from "@/lib/store/cart";
import CheckoutForm from "@/components/CheckoutForm";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const total = getTotal();

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
    <div className="py-12 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {items.map((item) => {
                const itemKey = `${item.id}-${JSON.stringify(item.options || {})}`;
                return (
                  <div key={itemKey} className="card p-3 lg:p-4">
                    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                      <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                        <div className="relative aspect-square w-full lg:w-32 h-32 overflow-hidden rounded-lg bg-brand-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 120px"
                          />
                        </div>
                      </Link>

                      <div className="flex-1">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-heading font-semibold text-base lg:text-lg text-brand-gray-900 hover:text-brand-green transition-colors block mb-1 lg:mb-2"
                        >
                          {item.name}
                        </Link>
                        {item.options && (
                          <p className="text-xs lg:text-sm text-brand-gray-600 mb-1 lg:mb-2">
                            {Object.entries(item.options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")}
                          </p>
                        )}
                        <p className="text-brand-green font-medium text-sm lg:text-base mb-2 lg:mb-4">
                          {formatCurrency(item.price)}
                        </p>

                        <div className="flex items-center gap-2 lg:gap-4">
                          <div className="flex items-center gap-2 border-2 border-brand-gray-200 rounded-lg">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.options)}
                              className="p-1.5 lg:p-2 hover:bg-brand-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <MinusIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                            </button>
                            <span className="w-6 lg:w-8 text-center font-medium text-sm lg:text-base">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.options)}
                              className="p-1.5 lg:p-2 hover:bg-brand-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <PlusIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id, item.options)}
                            className="text-brand-red hover:text-brand-red/80 flex items-center gap-1 text-xs lg:text-sm"
                            aria-label="Remove item"
                          >
                            <TrashIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-xl mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const itemKey = `${item.id}-${JSON.stringify(item.options || {})}`;
                  return (
                    <div key={itemKey} className="flex justify-between text-sm">
                      <span className="text-brand-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-brand-gray-200 pt-4 mb-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brand-gray-600">
                    <span>Delivery Fee:</span>
                    <span className="font-medium">Select location</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold border-t border-brand-gray-200 pt-4">
                  <span>Total:</span>
                  <span className="text-brand-green">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-brand-gray-500 mt-2">
                  * Delivery fee will be added based on selected location
                </p>
              </div>

              <CheckoutForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

