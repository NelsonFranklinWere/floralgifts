"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { generateProductWhatsAppLink } from "@/lib/whatsapp";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCartIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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

  const whatsappLink = generateProductWhatsAppLink(name, price);

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
      <div className="card p-3 md:p-4 group">
        <div className="mb-2 md:mb-3">
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
                  loading="lazy"
                  quality={85}
                  onError={(e) => {
                    console.error("[ProductCard] Image failed to load:", image);
                    console.error("[ProductCard] Error:", e);
                  }}
                />
                {/* Basket icon overlay for home page */}
                {homePage && (
                  <button
                    type="button"
                    onClick={handleBasketClick}
                    className="absolute top-0 right-0 z-10 bg-white rounded-full p-1.5 shadow-lg hover:bg-brand-red hover:text-white transition-all duration-300"
                    aria-label={`Add ${name} to cart`}
                  >
                    <ShoppingCartIconSolid className="w-3.5 h-3.5 text-brand-red" />
                  </button>
                )}
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
        <h3 className="font-heading font-semibold text-sm md:text-base text-brand-gray-900 mb-1 group-hover:text-brand-green transition-colors line-clamp-2">
          {name}
        </h3>
        {shortDescription && (
          <p className="text-brand-gray-600 text-xs md:text-sm mb-1 md:mb-2 line-clamp-2">{shortDescription}</p>
        )}
        <p className="font-mono font-semibold text-brand-green text-sm md:text-base mb-2 md:mb-3">
          {formatCurrency(price)}
        </p>
      </Link>

      {homePage && category === "hampers" && (
        <Link
          href={`/product/${slug}`}
          className="btn-outline w-full text-center text-xs py-1.5 mt-2"
          aria-label={`View details for ${name}`}
        >
          View Details
        </Link>
      )}

      {!homePage && (
        <div className="flex flex-col gap-1.5 md:gap-2">
          <div className="flex gap-1.5 md:gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-primary flex-1 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-1.5 md:py-2"
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingCartIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-3 md:px-4 py-1.5 md:py-2 flex items-center justify-center"
              aria-label={`Order ${name} via WhatsApp`}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 md:h-5 md:w-5" />
            </a>
          </div>
          {!hideDetailsButton && (
            <Link
              href={`/product/${slug}`}
              className="btn-outline w-full text-center text-xs md:text-sm py-1.5 md:py-2"
              aria-label={`View details for ${name}`}
            >
              View Details
            </Link>
          )}
        </div>
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

