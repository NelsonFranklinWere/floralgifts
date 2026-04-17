"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCartIcon as ShoppingCartIconSolid } from "@heroicons/react/24/solid";
import { Analytics } from "@/lib/analytics";

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
        <p className="font-mono font-semibold text-brand-red text-[11px] sm:text-xs md:text-xs mb-0.5 sm:mb-1">
          {formatCurrency(price)}
        </p>
        <p className="text-brand-gray-500 text-[9px] sm:text-[10px] md:text-xs mb-1 sm:mb-1.5 md:mb-2">
          + Delivery from KES 200
        </p>
      </Link>

      <div className="mt-1 sm:mt-1.5 flex flex-col gap-1">
        <button
          type="button"
          onClick={handleBasketClick}
          className="w-full btn-primary-sm"
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCartIconSolid className="h-4 w-4" />
          Add to Cart
        </button>
        <div className="flex items-center justify-center gap-1 text-[9px] text-brand-gray-600">
          <span className="font-semibold">✓</span>
          <span>M-Pesa Accepted</span>
        </div>
      </div>
      </div>
    </>
  );
}

