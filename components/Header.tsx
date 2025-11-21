"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import CartSidebar from "./CartSidebar";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Collections", href: "/collections" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartOpen, setCartOpen } = useUIStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  // Only render cart count after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-brand-gray-200 sticky top-0 z-40">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/images/logo.jpg"
                  alt="Floral Whispers Gifts Logo"
                  width={48}
                  height={48}
                  className="rounded-full"
                  priority
                />
                <span className="font-heading font-bold text-xl text-brand-gray-900">
                  Floral Whispers
                </span>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-brand-gray-900 hover:text-brand-green transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-brand-gray-900 hover:text-brand-green transition-colors"
                aria-label="Open shopping cart"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-xs font-medium text-white">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-brand-gray-900"
                aria-label="Open menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>

        <Transition show={mobileMenuOpen}>
          <Dialog onClose={() => setMobileMenuOpen(false)} className="md:hidden">
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
              enter="transition duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="fixed inset-y-0 right-0 w-full bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <Image
                    src="/images/logo.jpg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-brand-gray-900 hover:text-brand-green transition-colors font-medium text-lg"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </header>
      <CartSidebar />
    </>
  );
}

