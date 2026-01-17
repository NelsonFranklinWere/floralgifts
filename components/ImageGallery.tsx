"use client";

import { useState } from "react";
import Image from "next/image";
import ImageModal from "@/components/ImageModal";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  category?: string;
}

const categoryAltDescriptions: Record<string, string> = {
  flowers: "Premium flower delivery Nairobi CBD, Westlands, Karen",
  teddy: "Teddy bears Kenya, Nairobi gift delivery",
  hampers: "Gift hampers Kenya, Nairobi CBD delivery",
  wines: "Premium wines Nairobi, Westlands delivery",
  chocolates: "Chocolates Kenya, Nairobi gift delivery",
};

export default function ImageGallery({ images, productName, category }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const categoryDesc = category ? categoryAltDescriptions[category] || "" : "";
  const getAltText = (index: number) =>
    categoryDesc
      ? `${productName} - ${categoryDesc} | Floral Whispers Gifts - Image ${index + 1}`
      : `${productName} - Image ${index + 1}`;

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-brand-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-brand-gray-400">No image available</p>
      </div>
    );
  }

  const handleImageClick = () => {
    if (images[selectedIndex]) {
      setIsImageModalOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="relative aspect-square overflow-hidden rounded-lg bg-brand-gray-100 cursor-pointer group"
        onClick={handleImageClick}
      >
        <Image
          src={images[selectedIndex]}
          alt={getAltText(selectedIndex)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={selectedIndex === 0}
          fetchPriority={selectedIndex === 0 ? "high" : "auto"}
          quality={75}
          sizes="(max-width: 768px) 100vw, 50vw"
          loading={selectedIndex === 0 ? "eager" : "lazy"}
        />
        {/* Click indicator overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-80 rounded-full p-2">
            <MagnifyingGlassIcon className="w-6 h-6 text-brand-gray-900" />
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                selectedIndex === index
                  ? "border-brand-green"
                  : "border-brand-gray-200 hover:border-brand-gray-300"
              }`}
              aria-label={`View ${productName} image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} - thumbnail ${index + 1}${categoryDesc ? ` | ${categoryDesc}` : ""}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
                quality={60}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {images[selectedIndex] && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={images[selectedIndex]}
          alt={getAltText(selectedIndex)}
        />
      )}
    </div>
  );
}

