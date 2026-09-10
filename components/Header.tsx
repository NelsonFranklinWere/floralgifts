"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import { Analytics } from "@/lib/analytics";
import CartSidebar from "./CartSidebar";
import Logo from "./Logo";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/db";

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
    name: "Flowers",
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
    name: "Teddy Bears",
    href: "/collections/teddy-bears",
    children: [
      {
        title: "By Size",
        items: [
          { name: "View all", href: "/collections/teddy-bears" },
          { name: "25cm Teddy Bears", href: "/collections/teddy-bears" },
          { name: "50cm Teddy Bears", href: "/collections/teddy-bears" },
          { name: "100cm Teddy Bears", href: "/collections/teddy-bears" },
          { name: "120cm Teddy Bears", href: "/collections/teddy-bears" },
          { name: "160cm Teddy Bears", href: "/collections/teddy-bears" },
          { name: "180cm Teddy Bears", href: "/collections/teddy-bears" },
          { name: "200cm Teddy Bears", href: "/collections/teddy-bears" },
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
    name: "Men",
    href: "/collections/mens",
  },
  {
    name: "Women",
    href: "/collections/womens",
  },
  {
    name: "Kids",
    href: "/collections/kids",
  },
  {
    name: "Graduation",
    href: "/collections/graduation",
  },
  {
    name: "Wedding",
    href: "/collections/wedding",
  },
  {
    name: "Valentines",
    href: "/collections/valentines",
  },
  {
    name: "Corporate",
    href: "/collections/corporate",
  },
  {
    name: "New Arrivals",
    href: "/new-arrivals",
  },
];

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<{ [key: string]: boolean }>({});
  const [mounted, setMounted] = useState(false);
  const [menuScrollY, setMenuScrollY] = useState(0);
  const { cartOpen, setCartOpen } = useUIStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const menuCloseButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lockBodyScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    const y = window.scrollY || window.pageYOffset || 0;
    setMenuScrollY(y);
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  }, []);

  const unlockBodyScroll = useCallback((toTop?: boolean) => {
    if (typeof document === "undefined") return;
    const lockedTop = document.body.style.top;
    const restoreY = toTop
      ? 0
      : lockedTop
        ? Math.abs(parseInt(lockedTop, 10) || 0)
        : menuScrollY;
    document.documentElement.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, restoreY);
  }, [menuScrollY]);

  const openMobileMenu = useCallback(() => {
    lockBodyScroll();
    setMobileMenuOpen(true);
  }, [lockBodyScroll]);

  const closeMobileMenu = useCallback(
    (opts?: { scrollTop?: boolean }) => {
      setMobileMenuOpen(false);
      unlockBodyScroll(!!opts?.scrollTop);
      if (opts?.scrollTop) {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        });
      }
    },
    [unlockBodyScroll]
  );

  // Safety: unlock body if component unmounts with menu open
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        Analytics.trackSearch(
          query,
          Array.isArray(results)
            ? results.slice(0, 10).map((p: Product) => p.id).filter(Boolean)
            : []
        );
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        // Don't close if clicking on the search results themselves
        if (!(event.target as Element).closest('[data-search-result]')) {
          // Keep search open but clear results dropdown behavior handled by searchOpen state
        }
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleResultClick = (product: Product) => {
    router.push(`/product/${product.slug}`);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

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
          <div className="flex h-14 md:h-16 items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center min-w-0 shrink">
              <Link href="/" className="flex items-center min-w-0">
                <Logo />
              </Link>
            </div>

            {/* Desktop nav: wrap + compact so Men/Women/Kids + occasions fit */}
            <div className="hidden md:flex md:items-center md:flex-wrap md:justify-center md:gap-x-2 md:gap-y-1 lg:gap-x-2.5 xl:gap-x-3 flex-1 min-w-0 px-1 max-w-4xl xl:max-w-5xl">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative shrink-0"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={() => handleMouseLeave(item.name)}
                >
                  <Link
                    href={item.href}
                    className="text-brand-gray-900 hover:text-brand-red transition-colors font-medium text-[10px] lg:text-[11px] xl:text-xs flex items-center gap-0.5 group whitespace-nowrap"
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDownIcon
                        className={`h-3 w-3 transition-transform ${
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
                      className="absolute top-full left-0 mt-2 bg-white border border-brand-gray-200 rounded-lg shadow-lg p-4 z-[100]"
                      style={{
                        width: item.children.length === 3 ? "720px" : item.children.length === 2 ? "480px" : "320px",
                      }}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div
                        className={`grid gap-6 ${
                          item.children.length === 3
                            ? "grid-cols-3"
                            : item.children.length === 2
                              ? "grid-cols-2"
                              : "grid-cols-1"
                        }`}
                      >
                        {item.children.map((section, sectionIndex) => (
                          <div key={sectionIndex}>
                            <h3 className="font-semibold text-brand-gray-900 mb-2 text-xs uppercase tracking-wide">
                              {section.title}
                            </h3>
                            <ul className="space-y-1">
                              {section.items.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    className="text-brand-gray-700 hover:text-brand-red transition-colors text-xs block py-0.5"
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
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Search */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="p-2 text-brand-gray-700 hover:text-brand-red transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Cart — sticky conversion target */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-brand-gray-700 hover:text-brand-red transition-colors rounded-full hover:bg-brand-gray-50"
                aria-label="Open shopping cart"
              >
                <ShoppingCartIcon className="h-5 w-5 md:h-6 md:w-6" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button — phones only; md+ shows full nav */}
              <button
                type="button"
                onClick={openMobileMenu}
                className="md:hidden p-2 text-brand-gray-900"
                aria-label="Open menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="border-t border-brand-gray-200 py-4 relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400" />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-red"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchQuery.trim() && (
                <div
                  ref={searchResultsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                  data-search-result
                >
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleResultClick(product)}
                          className="w-full px-4 py-3 hover:bg-brand-gray-50 transition-colors text-left flex items-center gap-3 group"
                          data-search-result
                        >
                          {product.images && product.images.length > 0 && (
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-brand-gray-100">
                              <OptimizedImage
                                src={product.images[0]}
                                variant="thumb"
                                alt={product.title}
                                fill
                                className="img-frame-fit"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-brand-gray-900 group-hover:text-brand-red transition-colors truncate">
                              {product.title}
                            </h3>
                            {product.short_description && (
                              <p className="text-sm text-brand-gray-500 truncate mt-0.5">
                                {product.short_description}
                              </p>
                            )}
                            <p className="text-sm font-semibold text-brand-green mt-1">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : !isSearching ? (
                    <div className="px-4 py-8 text-center text-brand-gray-500">
                      <p>No products found for &quot;{searchQuery}&quot;</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu — instant open (no enter delay); body scroll locked while open */}
        {mobileMenuOpen && (
          <Dialog
            open
            onClose={() => closeMobileMenu()}
            className="relative z-[60] md:hidden"
            initialFocus={menuCloseButtonRef}
          >
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="fixed inset-0 flex justify-end">
              <Dialog.Panel className="relative h-full w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto overscroll-contain">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray-200">
                  <div className="flex items-center min-w-0">
                    <Logo />
                  </div>
                  <button
                    ref={menuCloseButtonRef}
                    type="button"
                    onClick={() => closeMobileMenu()}
                    className="p-2 rounded-full hover:bg-brand-gray-100 transition-colors shrink-0"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-5 w-5 text-brand-gray-600" />
                  </button>
                </div>
                <nav className="flex flex-col space-y-0.5">
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
                            className="w-full px-3 py-2.5 rounded-lg text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50 transition-colors font-medium text-sm flex items-center justify-between"
                          >
                            <span>{item.name}</span>
                            <ChevronDownIcon
                              className={`h-3.5 w-3.5 transition-transform ${mobileExpanded[item.name] ? "rotate-180" : ""}`}
                            />
                          </button>
                          {mobileExpanded[item.name] && (
                            <div className="pl-3 mt-1 space-y-1">
                              {item.children.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="mb-3">
                                  <h4 className="font-semibold text-brand-gray-900 mb-1.5 text-xs uppercase">
                                    {section.title}
                                  </h4>
                                  <ul className="space-y-0.5">
                                    {section.items.map((subItem) => (
                                      <li key={subItem.name}>
                                        <Link
                                          href={subItem.href}
                                          scroll={false}
                                          onClick={() => closeMobileMenu({ scrollTop: true })}
                                          className="px-3 py-1.5 rounded-lg text-brand-gray-700 hover:text-brand-red hover:bg-brand-gray-50 transition-colors text-xs block"
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
                          scroll={false}
                          onClick={() => closeMobileMenu({ scrollTop: true })}
                          className="px-3 py-2.5 rounded-lg text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50 transition-colors font-medium text-sm block"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </header>
      <CartSidebar />
    </>
  );
}
