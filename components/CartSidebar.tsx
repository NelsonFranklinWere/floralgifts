"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import AddOns from "@/components/AddOns";

export default function CartSidebar() {
  const { cartOpen, setCartOpen } = useUIStore();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  return (
    <Transition show={cartOpen} as={Fragment}>
      <Dialog onClose={() => setCartOpen(false)} className="relative z-50">
        <Transition.Child
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          enter="transition duration-200 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition duration-200 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-brand-gray-200 px-6 py-4">
                <Dialog.Title className="font-heading font-semibold text-lg">
                  Shopping Cart
                </Dialog.Title>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-brand-gray-100 rounded-lg transition-colors"
                  aria-label="Close cart"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-brand-gray-600 mb-4">Your cart is empty</p>
                    <Link
                      href="/collections"
                      onClick={() => setCartOpen(false)}
                      className="btn-primary inline-block"
                    >
                      Browse Collections
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {items.map((item) => {
                        const itemKey = `${item.id}-${JSON.stringify(item.options || {})}`;
                        return (
                          <div key={itemKey} className="card p-3">
                            <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-gray-100 mb-2">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            </div>
                            <h4 className="font-medium text-sm text-brand-gray-900 mb-1 line-clamp-2">{item.name}</h4>
                            {item.options && (
                              <p className="text-xs text-brand-gray-600 mb-1">
                                {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}
                              </p>
                            )}
                            <p className="text-brand-green font-medium text-sm mb-2">
                              {formatCurrency(item.price)}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.options)}
                                className="p-1 hover:bg-brand-gray-100 rounded transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.options)}
                                className="p-1 hover:bg-brand-gray-100 rounded transition-colors"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id, item.options)}
                              className="text-brand-red text-xs hover:underline w-full"
                              aria-label="Remove item"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="pt-4 border-t border-brand-gray-200">
                      <div className="mb-3">
                        <AddOns 
                          excludeProductIds={items.map((item) => item.id)} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-brand-gray-200 px-6 py-4 space-y-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-brand-green">{formatCurrency(total)}</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="btn-primary w-full text-center block"
                  >
                    Place Order
                  </Link>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

