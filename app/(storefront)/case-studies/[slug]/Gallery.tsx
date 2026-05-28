"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

type Props = {
  images: string[];
};

export default function CaseStudyGallery({ images }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setIsOpen(true);
  };

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const showPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close, showNext, showPrev]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="mt-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => openAt(i)}
              className="group relative block w-full overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4617A]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`Case study photo ${i + 1}`}
                  width={900}
                  height={900}
                  className="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white text-2xl font-light px-3 py-1"
            aria-label="Close gallery"
          >
            ×
          </button>
          <button
            type="button"
            onClick={showPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl px-3 py-2"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl px-3 py-2"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="max-w-5xl w-full px-4">
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] mx-auto">
              <Image
                src={images[index]}
                alt={`Case study photo ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-sm text-white/80">
              {index + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

