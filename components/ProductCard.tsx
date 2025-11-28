"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon as ShoppingCartIconSolid } from "@heroicons/react/24/solid";
import ImageModal from "@/components/ImageModal";
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    // Track product view when card is visible
    if (id && name && category) {
      Analytics.trackProductView(id, name, category, price);
    }
  }, [id, name, category, price]);

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image,
      slug,
    });
    // Track add to cart
    Analytics.trackAddToCart(id, name, price, 1);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (image) {
      setIsImageModalOpen(true);
    }
  };

  const handleBasketClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart();
  };

  return (
    <>
      <div className="card p-2 sm:p-3 md:p-4 group">
        <div className="mb-1.5 sm:mb-2 md:mb-3">
          <div 
            className="relative aspect-square overflow-hidden rounded-lg bg-brand-gray-100 cursor-pointer group/image"
            onClick={handleImageClick}
          >
            {image ? (
              <>
                <Image
                  src={image}
                  alt={`${name} - ${category === "flowers" ? "Premium flower delivery Nairobi CBD, Westlands, Karen" : category === "teddy" ? "Teddy bears Kenya, Nairobi" : category === "hampers" ? "Gift hampers Kenya, Nairobi CBD" : category === "wines" ? "Wines Nairobi, Westlands" : "Chocolates Kenya, Nairobi"} | Whispers Floral Gifts`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading={priority ? undefined : "lazy"}
                  priority={priority}
                  quality={70}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onError={(e) => {
                    console.error("[ProductCard] Image failed to load:", image);
                    console.error("[ProductCard] Error:", e);
                  }}
                />
                {/* Basket icon overlay - always visible */}
                <button
                  type="button"
                  onClick={handleBasketClick}
                  className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-brand-red hover:text-white transition-all duration-300 group-hover:scale-110"
                  aria-label={`Add ${name} to cart`}
                >
                  <ShoppingCartIconSolid className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-red group-hover:text-white transition-colors" />
                </button>
                {/* Click indicator overlay */}
                {!homePage && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-white bg-opacity-80 rounded-full p-2">
                      <MagnifyingGlassIcon className="w-6 h-6 text-brand-gray-900" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-gray-400 text-xs">
                No image
              </div>
            )}
          </div>
        </div>

      <Link href={`/product/${slug}`} className="block">
        <h3 className="font-heading font-semibold text-xs sm:text-sm md:text-base text-brand-gray-900 mb-0.5 sm:mb-1 group-hover:text-brand-green transition-colors line-clamp-2">
          {name}
        </h3>
        {shortDescription && (
          <p className="text-brand-gray-600 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 md:mb-2 line-clamp-2">{shortDescription}</p>
        )}
        <p className="font-mono font-semibold text-brand-green text-xs sm:text-sm md:text-base mb-1 sm:mb-2 md:mb-3">
          {formatCurrency(price)}
        </p>
      </Link>

      {/* Details button - only for gift hampers */}
      {category === "hampers" && !hideDetailsButton && (
        <Link
          href={`/product/${slug}`}
          className="btn-outline w-full text-center text-[10px] sm:text-xs md:text-sm py-1 sm:py-1.5 md:py-2 mt-1 sm:mt-2"
          aria-label={`View details for ${name}`}
        >
          Details
        </Link>
      )}
      </div>

      {/* Image Modal */}
      {image && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={image}
          alt={name}
        />
      )}
    </>
  );
}

