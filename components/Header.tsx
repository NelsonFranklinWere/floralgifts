"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import CartSidebar from "./CartSidebar";
import Logo from "./Logo";
import { SHOP_INFO } from "@/lib/constants";

interface NavItem {
  name: string;
  href: string;
  children?: {
    title: string;
    items: { name: string; href: string }[];
  }[];
}

const navigation: NavItem[] = [
  {
    name: "Flower Bouquets",
    href: "/collections/flowers",
    children: [
      {
        title: "By Occasion",
        items: [
          { name: "View all", href: "/collections/flowers" },
          { name: "Anniversary Flowers", href: "/collections/flowers?tags=anniversary" },
          { name: "Birthday Flowers", href: "/collections/flowers?tags=birthday" },
          { name: "Romantic Flowers", href: "/collections/flowers?tags=romantic" },
          { name: "I'm Sorry Flowers", href: "/collections/flowers?tags=sorry" },
          { name: "Get Well Soon Flowers", href: "/collections/flowers?tags=get well soon" },
          { name: "Condolence Flowers", href: "/collections/flowers?tags=funeral" },
        ],
      },
      {
        title: "Flower Arrangements",
        items: [
          { name: "View all", href: "/collections/flowers" },
          { name: "Heart Box Arrangements", href: "/collections/flowers" },
          { name: "Vase Flowers", href: "/collections/flowers" },
          { name: "Flower Baskets", href: "/collections/flowers" },
          { name: "Hat Box Arrangements", href: "/collections/flowers" },
          { name: "Hand-tied Bouquets", href: "/collections/flowers" },
          { name: "Envelope Arrangements", href: "/collections/flowers" },
          { name: "Square Box Arrangements", href: "/collections/flowers" },
        ],
      },
      {
        title: "By Type",
        items: [
          { name: "Carnations", href: "/collections/flowers" },
          { name: "Roses", href: "/collections/flowers" },
          { name: "Gerberas", href: "/collections/flowers" },
          { name: "Sunflowers", href: "/collections/flowers" },
          { name: "Lilies", href: "/collections/flowers" },
          { name: "Chrysanthemums", href: "/collections/flowers" },
        ],
      },
    ],
  },
  {
    name: "Flower Hampers",
    href: "/collections/gift-hampers",
    children: [
      {
        title: "Flower Hampers",
        items: [
          { name: "View all", href: "/collections/gift-hampers" },
          { name: "Chocolate Flower Hampers", href: "/collections/gift-hampers" },
          { name: "Wine Flower Hampers", href: "/collections/gift-hampers" },
          { name: "Cake Flower Hampers", href: "/collections/gift-hampers" },
          { name: "Fruits Baskets", href: "/collections/gift-hampers" },
          { name: "Flower Hampers & Teddy Bears", href: "/collections/gift-hampers" },
        ],
      },
    ],
  },
  {
    name: "Gift Hampers",
    href: "/collections/gift-hampers",
    children: [
      {
        title: "Gift Hampers",
        items: [
          { name: "View all", href: "/collections/gift-hampers" },
          { name: "Gift Baskets", href: "/collections/gift-hampers" },
          { name: "Fruit Baskets", href: "/collections/gift-hampers" },
        ],
      },
    ],
  },
  {
    name: "Cards",
    href: "/collections",
    children: [
      {
        title: "Occasions",
        items: [
          { name: "View all", href: "/collections" },
          { name: "Birthdays", href: "/collections" },
          { name: "Graduations", href: "/collections" },
          { name: "Anniversaries", href: "/collections" },
        ],
      },
      {
        title: "Sentiment",
        items: [
          { name: "Congrats", href: "/collections" },
          { name: "Sympathy", href: "/collections" },
          { name: "Good Luck", href: "/collections" },
        ],
      },
    ],
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<{ [key: string]: boolean }>({});
  const [mounted, setMounted] = useState(false);
  const { cartOpen, setCartOpen } = useUIStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = (itemName: string) => {
    if (navigation.find((item) => item.name === itemName)?.children) {
      setActiveDropdown(itemName);
    }
  };

  const handleMouseLeave = (itemName: string) => {
    setTimeout(() => {
      const dropdown = dropdownRefs.current[itemName];
      if (dropdown && !dropdown.matches(":hover")) {
        setActiveDropdown(null);
      }
    }, 100);
  };

  return (
    <>
      <header className="bg-white border-b border-brand-gray-200 sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Logo className="h-12 md:h-16 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={() => handleMouseLeave(item.name)}
                >
                  <Link
                    href={item.href}
                    className="text-brand-gray-900 hover:text-brand-red transition-colors font-medium text-sm xl:text-base flex items-center gap-1 group"
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.children && activeDropdown === item.name && (
                    <div
                      ref={(el) => {
                        dropdownRefs.current[item.name] = el;
                      }}
                      className="absolute top-full left-0 mt-2 bg-white border border-brand-gray-200 rounded-lg shadow-lg p-6 z-[100]"
                      style={{
                        width: item.children.length === 3 ? "900px" : item.children.length === 2 ? "600px" : "400px",
                      }}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="grid grid-cols-3 gap-8">
                        {item.children.map((section, sectionIndex) => (
                          <div key={sectionIndex}>
                            <h3 className="font-semibold text-brand-gray-900 mb-3 text-sm uppercase tracking-wide">
                              {section.title}
                            </h3>
                            <ul className="space-y-2">
                              {section.items.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    className="text-brand-gray-700 hover:text-brand-red transition-colors text-sm block py-1"
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-brand-gray-700 hover:text-brand-red transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-brand-gray-700 hover:text-brand-red transition-colors"
                aria-label="Open shopping cart"
              >
                <ShoppingCartIcon className="h-5 w-5 md:h-6 md:w-6" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-brand-gray-900"
                aria-label="Open menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="border-t border-brand-gray-200 py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400" />
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <Transition show={mobileMenuOpen}>
          <Dialog onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
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
              <Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-gray-200">
                  <div className="flex items-center">
                    <Logo className="h-10 w-auto" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-brand-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6 text-brand-gray-600" />
                  </button>
                </div>
                <nav className="flex flex-col space-y-1">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      {item.children ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileExpanded({
                                ...mobileExpanded,
                                [item.name]: !mobileExpanded[item.name],
                              })
                            }
                            className="w-full px-4 py-3 rounded-lg text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50 transition-all font-medium flex items-center justify-between"
                          >
                            <span>{item.name}</span>
                            <ChevronDownIcon
                              className={`h-4 w-4 transition-transform ${mobileExpanded[item.name] ? "rotate-180" : ""}`}
                            />
                          </button>
                          {mobileExpanded[item.name] && (
                            <div className="pl-4 mt-2 space-y-1">
                              {item.children.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="mb-4">
                                  <h4 className="font-semibold text-brand-gray-900 mb-2 text-sm uppercase">
                                    {section.title}
                                  </h4>
                                  <ul className="space-y-1">
                                    {section.items.map((subItem) => (
                                      <li key={subItem.name}>
                                        <Link
                                          href={subItem.href}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="px-4 py-2 rounded-lg text-brand-gray-700 hover:text-brand-red hover:bg-brand-gray-50 transition-all text-sm block"
                                        >
                                          {subItem.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-3 rounded-lg text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50 transition-all font-medium"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50 transition-all font-medium"
                  >
                    Contact
                  </Link>
                </nav>
                <div className="mt-8 pt-6 border-t border-brand-gray-200">
                  <div className="flex items-center justify-center space-x-4">
                    <a
                      href="https://www.instagram.com/floral_whispers_gifts?utm_source=qr&igsh=MTdqenRmbWxqMnNxcg=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-brand-gray-100 hover:bg-brand-red hover:text-white transition-all"
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
                      className="p-2 rounded-full bg-brand-gray-100 hover:bg-brand-red hover:text-white transition-all"
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
