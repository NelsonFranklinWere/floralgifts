"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCartIcon as ShoppingCartIconSolid } from "@heroicons/react/24/solid";
import { Analytics } from "@/lib/analytics";
import { generateProductWhatsAppLink } from "@/lib/whatsapp";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  shortDescription?: string;
  category?: string;
  hideDetailsButton?: boolean;
  homePage?: boolean;
  priority?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  slug,
  shortDescription,
  category,
  hideDetailsButton = false,
  homePage = false,
  priority = false,
}: ProductCardProps) {

  const { addItem } = useCartStore();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Track product view when card is visible
    if (id && name && category) {
      Analytics.trackProductView(id, name, category, price);
    }
  }, [id, name, category, price]);

  const handleAddToCart = () => {
    const cartImage = imageError
      ? (category === "flowers"
          ? "/images/products/flowers/BouquetFlowers1.jpg"
          : category === "hampers"
          ? "/images/products/hampers/giftamper.jpg"
          : category === "teddy"
          ? "/images/products/teddies/Teddybear1.jpg"
          : category === "chocolates"
          ? "/images/products/Chocolates/Chocolates1.jpg"
          : category === "wines"
          ? "/images/products/wines/redwine.jpg"
          : "/images/products/hampers/giftamper.jpg")
      : image;

    addItem({
      id,
      name,
      price,
      image: cartImage,
      slug,
    });
    // Track add to cart
    Analytics.trackAddToCart(id, name, price, 1);
  };

  const handleBasketClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart();
  };

  const whatsappLink = useMemo(() => generateProductWhatsAppLink(name, price, 1), [name, price]);

  const getAltText = () => {
    const baseType =
      category === "flowers"
        ? "flowers"
        : category === "teddy"
        ? "teddy bears"
        : category === "hampers"
        ? "gift hamper"
        : category === "chocolates"
        ? "chocolates"
        : category === "wines"
        ? "wine"
        : "gifts";

    return `${name} — ${baseType} delivered in Nairobi by Floral Whispers Gifts`;
  };

  return (
    <>
      <div className="card p-2 sm:p-3 md:p-4 group">
        <div className="mb-1.5 sm:mb-2 md:mb-3">
          <Link
            href={`/product/${slug}`}
            className="relative block aspect-square overflow-hidden rounded-lg bg-brand-gray-100 cursor-pointer"
            aria-label={`View ${name} details`}
          >
            {image && !imageError ? (
              <>
                <Image
                  src={image}
                  alt={getAltText()}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading={priority ? "eager" : "lazy"}
                  priority={priority}
                  quality={70}
                  fetchPriority={priority ? "high" : "auto"}
                  onError={(e) => {
                    console.error("[ProductCard] Image failed to load:", image);
                    console.error("[ProductCard] Error:", e);
                    setImageError(true);
                  }}
                />
                {/* Basket icon overlay - always visible */}
                <button
                  type="button"
                  onClick={handleBasketClick}
                  className="absolute top-0 right-0 z-10 bg-white rounded-full px-2 py-1.5 sm:px-2.5 sm:py-2 shadow-lg hover:bg-brand-red hover:text-white transition-all duration-300 group-hover:scale-110 flex items-center gap-1"
                  aria-label={`Add ${name} to cart`}
                >
                  <ShoppingCartIconSolid className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-red group-hover:text-white transition-colors" />
                  <span className="text-[10px] sm:text-[11px] md:text-xs font-semibold leading-none text-brand-gray-900 group-hover:text-white transition-colors">
                    cart
                  </span>
                </button>
              </>
            ) : (
              <Image
                src={
                  category === "flowers"
                    ? "/images/products/flowers/BouquetFlowers1.jpg"
                    : category === "hampers"
                    ? "/images/products/hampers/giftamper.jpg"
                    : category === "teddy"
                    ? "/images/products/teddies/Teddybear1.jpg"
                    : category === "chocolates"
                    ? "/images/products/Chocolates/Chocolates1.jpg"
                    : category === "wines"
                    ? "/images/products/wines/redwine.jpg"
                    : "/images/products/hampers/giftamper.jpg"
                }
                alt={getAltText()}
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={priority ? "eager" : "lazy"}
                priority={priority}
                quality={60}
                fetchPriority={priority ? "high" : "auto"}
              />
            )}
          </Link>
        </div>

      <Link href={`/product/${slug}`} className="block">
        <h3 className="font-heading font-semibold text-[10px] sm:text-[11px] md:text-xs text-brand-gray-900 mb-0.5 sm:mb-1 group-hover:text-brand-red transition-colors line-clamp-2">
          {name}
        </h3>
        {shortDescription && (
          <p className="text-brand-gray-600 text-[10px] sm:text-[11px] md:text-xs mb-0.5 sm:mb-1 md:mb-1 line-clamp-2">{shortDescription}</p>
        )}
        <p className="font-mono font-semibold text-brand-red text-[11px] sm:text-xs md:text-xs mb-1 sm:mb-1.5 md:mb-2">
          {formatCurrency(price)}
        </p>
      </Link>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary w-full text-center text-[10px] sm:text-[11px] md:text-xs py-1 sm:py-1.5 md:py-2 mt-1 sm:mt-1.5 flex items-center justify-center"
        aria-label={`Order ${name} on WhatsApp`}
      >
        Order on WhatsApp
      </a>
      </div>
    </>
  );
}

