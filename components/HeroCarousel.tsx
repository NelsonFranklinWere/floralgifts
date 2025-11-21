"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const heroSlides = [
  {
    id: 1,
    image: "/images/products/flowers/BouquetFlowers1.jpg",
    title: "Feel the Beauty and Blossom",
    subtitle: "Premium flowers, gift hampers, and teddy bears delivered to your door in Nairobi",
    ctaText: "Shop Now",
    ctaLink: "/collections",
  },
  {
    id: 2,
    image: "/images/products/flowers/BouquetFlowers2.jpg",
    title: "Celebrate Every Moment",
    subtitle: "Beautiful arrangements for birthdays, anniversaries, and special occasions",
    ctaText: "Explore Flowers",
    ctaLink: "/collections/flowers",
  },
  {
    id: 3,
    image: "/images/products/hampers/giftamper.jpg",
    title: "Luxury Gift Hampers",
    subtitle: "Curated collections perfect for corporate gifting and celebrations",
    ctaText: "View Hampers",
    ctaLink: "/collections/gift-hampers",
  },
  {
    id: 4,
    image: "/images/products/teddies/Teddybear1.jpg",
    title: "Cuddly Teddy Bears",
    subtitle: "Soft and adorable companions in various sizes and colors",
    ctaText: "Shop Teddy Bears",
    ctaLink: "/collections/teddy-bears",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="relative h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-2xl">
              <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-2 md:mb-3 lg:mb-4">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base lg:text-lg xl:text-xl mb-4 md:mb-6 lg:mb-8 text-white/90">{slide.subtitle}</p>
              <Link href={slide.ctaLink} className="btn-primary inline-block text-xs md:text-sm lg:text-base px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4">
                {slide.ctaText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

