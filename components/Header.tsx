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
  { name: "Collections", href: "/collections" },
  { name: "Services", href: "/services" },
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
                <span className="font-heading font-bold text-xl md:text-2xl">
                  <span className="bg-gradient-to-r from-brand-green via-brand-pink to-brand-green bg-clip-text text-transparent">
                    Floral Whispers
                  </span>
                  <span className="text-brand-gray-900 ml-1.5 font-semibold italic">
                    Gifts
                  </span>
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
              enter="transition-opacity duration-300 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            </Transition.Child>
            <Transition.Child
              enter="transition-transform duration-300 ease-out"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition-transform duration-200 ease-in"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-b from-white to-brand-gray-50 shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-gray-200">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/images/logo.jpg"
                      alt="Logo"
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-brand-green/20"
                    />
                    <div>
                      <span className="font-heading font-bold text-lg">
                        <span className="bg-gradient-to-r from-brand-green via-brand-pink to-brand-green bg-clip-text text-transparent">
                          Floral Whispers
                        </span>
                        <span className="text-brand-gray-900 ml-1 font-semibold italic">
                          Gifts
                        </span>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-brand-gray-100 transition-colors group"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6 text-brand-gray-600 group-hover:text-brand-gray-900 transition-colors" />
                  </button>
                </div>
                <nav className="flex flex-col space-y-2">
                  {navigation.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group relative px-4 py-3 rounded-lg text-brand-gray-900 hover:text-brand-green hover:bg-white hover:shadow-md transition-all duration-200 font-medium text-lg"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-between">
                        <span>{item.name}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-green">
                          →
                        </span>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-brand-green/5 to-brand-pink/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-brand-gray-200">
                  <div className="flex items-center justify-center space-x-4">
                    <a
                      href="https://www.instagram.com/floral_whispers_gifts?utm_source=qr&igsh=MTdqenRmbWxqMnNxcg=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-brand-gray-100 hover:bg-brand-green hover:text-white transition-all duration-200"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.facebook.com/share/1C6Wc4PVDK/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-brand-gray-100 hover:bg-brand-green hover:text-white transition-all duration-200"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </header>
      <CartSidebar />
    </>
  );
}

