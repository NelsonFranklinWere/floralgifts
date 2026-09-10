"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatCurrency, getCategoryFallbackImage } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
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
  category,
  priority = false,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [imageError, setImageError] = useState(false);
  const [useObjectUrl, setUseObjectUrl] = useState(false);
  const [added, setAdded] = useState(false);
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image: cartImageUrl, slug });
    Analytics.trackAddToCart(id, name, price, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
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
    <div ref={cardRef} className="group flex flex-col h-full">
      {/* Image */}
      <Link
        href={`/product/${slug}`}
        className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-brand-gray-50 mb-3"
        aria-label={`View ${name} details`}
      >
        {displaySrc && !imageError ? (
          useObjectUrl && isSupabaseStorageUrl(image) ? (
            <OptimizedImage
              key="object-fallback"
              src={toSupabaseObjectUrl(image)}
              alt={getAltText()}
              fill
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
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
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
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
            className="object-cover object-center opacity-60"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
          />
        )}
      </Link>

      {/* Name · Price + Add to Cart on one row */}
      <div className="flex flex-col flex-1 px-0.5 min-w-0">
        <Link href={`/product/${slug}`} className="block mb-1.5 sm:mb-2 min-w-0">
          <h3 className="font-heading font-bold text-[11px] sm:text-[13px] md:text-sm text-brand-gray-900 leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity">
            {name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-1 sm:gap-2 min-w-0">
          <p className="font-body font-semibold text-[11px] sm:text-[13px] md:text-sm text-brand-gray-900 shrink-0 tabular-nums">
            {formatCurrency(price)}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`shrink-0 border border-brand-gray-900 py-1 px-1.5 sm:py-1.5 sm:px-2.5 md:px-3 text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.04em] sm:tracking-[0.08em] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gray-900 focus:ring-offset-1 whitespace-nowrap ${
              added
                ? "bg-brand-gray-900 text-white"
                : "bg-white text-brand-gray-900 hover:bg-brand-gray-900 hover:text-white"
            }`}
            aria-label={`Add ${name} to cart`}
          >
            {added ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
