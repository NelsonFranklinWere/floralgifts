"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, getCategoryFallbackImage } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCartIcon as ShoppingCartIconSolid } from "@heroicons/react/24/solid";
import { Analytics } from "@/lib/analytics";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-blur";
import {
  getOptimizedProductImageUrl,
  isSupabaseStorageUrl,
  toSupabaseObjectUrl,
} from "@/lib/product-image-url";
import OptimizedImage from "@/components/OptimizedImage";

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
  priority = false,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [imageError, setImageError] = useState(false);
  const [useObjectUrl, setUseObjectUrl] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const fallbackImage = getCategoryFallbackImage(category || "");
  const displaySrc =
    useObjectUrl && isSupabaseStorageUrl(image)
      ? toSupabaseObjectUrl(image)
      : image;

  useEffect(() => {
    setImageError(false);
    setUseObjectUrl(false);
  }, [image]);

  useEffect(() => {
    if (!id || !name || !category) return;

    const seenKey = `fw_pv_${id}`;
    try {
      if (sessionStorage.getItem(seenKey)) return;
    } catch {
      /* private mode */
    }

    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        try {
          sessionStorage.setItem(seenKey, "1");
        } catch {
          /* ignore */
        }
        Analytics.trackProductView(id, name, category, price);
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "50px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [id, name, category, price]);

  const handleImageError = () => {
    if (!useObjectUrl && isSupabaseStorageUrl(image)) {
      setUseObjectUrl(true);
      return;
    }
    setImageError(true);
  };

  const cartImageUrl = imageError
    ? fallbackImage
    : image
      ? getOptimizedProductImageUrl(image, "cart")
      : fallbackImage;

  const handleAddToCart = () => {
    addItem({ id, name, price, image: cartImageUrl, slug });
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
    <div ref={cardRef} className="card p-2 sm:p-3 md:p-4 group">
      <div className="mb-1.5 sm:mb-2 md:mb-3">
        <Link
          href={`/product/${slug}`}
          className="img-product-frame block cursor-pointer"
          aria-label={`View ${name} details`}
        >
          {displaySrc && !imageError ? (
            useObjectUrl && isSupabaseStorageUrl(image) ? (
              <Image
                key="object-fallback"
                src={toSupabaseObjectUrl(image)}
                alt={getAltText()}
                fill
                unoptimized
                className="img-frame-fit"
                sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 360px"
                loading={priority ? "eager" : "lazy"}
                priority={priority}
                fetchPriority={priority ? "high" : "auto"}
                onError={() => setImageError(true)}
              />
            ) : (
              <OptimizedImage
                key={displaySrc}
                src={displaySrc}
                variant="card"
                alt={getAltText()}
                fill
                className="img-frame-fit"
                sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 360px"
                loading={priority ? "eager" : "lazy"}
                priority={priority}
                fetchPriority={priority ? "high" : "auto"}
                onError={handleImageError}
                {...(priority
                  ? { placeholder: "blur" as const, blurDataURL: IMAGE_BLUR_DATA_URL }
                  : {})}
              />
            )
          ) : (
            <OptimizedImage
              src={fallbackImage}
              alt={getAltText()}
              fill
              className="img-frame-fit opacity-60"
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 360px"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              fetchPriority={priority ? "high" : "auto"}
            />
          )}
        </Link>
      </div>

      <Link href={`/product/${slug}`} className="block">
        <h3 className="font-heading font-semibold text-xs sm:text-sm text-brand-gray-900 mb-0.5 sm:mb-1 group-hover:text-brand-red transition-colors line-clamp-2">
          {name}
        </h3>
        {shortDescription && (
          <p className="text-brand-gray-600 text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2">{shortDescription}</p>
        )}
        <p className="font-mono font-semibold text-brand-red text-sm sm:text-base mb-1 sm:mb-1.5 md:mb-2">
          {formatCurrency(price)}
        </p>
      </Link>

      <button
        type="button"
        onClick={handleBasketClick}
        className="mt-1 sm:mt-1.5 w-full btn-primary-sm"
        aria-label={`Add ${name} to cart`}
      >
        <ShoppingCartIconSolid className="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  );
}
