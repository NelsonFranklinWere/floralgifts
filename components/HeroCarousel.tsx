"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const heroSlides = [
  {
    id: 1,
    image: "/images/products/flowers/BouquetFlowers1.jpg",
    title: "Valentine's Day Gifts Nairobi | Romantic Flowers for Wife, Girlfriend, Mom",
    subtitle: "Express love with beautiful Valentine's roses & premium chocolates. Same-day delivery across Nairobi CBD, Westlands, Karen. Perfect Valentine's surprises for your special someone.",
    ctaText: "Shop Valentine's Gifts",
    ctaLink: "/collections",
  },
  {
    id: 2,
    image: "/images/products/flowers/BouquetFlowers2.jpg",
    title: "Romantic Valentine's Flowers Nairobi | Best Gifts for Couples & Families",
    subtitle: "Stunning Valentine's arrangements for your wife, girlfriend, husband, or family. Fresh roses, mixed bouquets, money bouquets. Express your love beautifully in Nairobi.",
    ctaText: "Valentine's Flowers",
    ctaLink: "/collections/flowers",
  },
  {
    id: 3,
    image: "/images/products/hampers/giftamper.jpg",
    title: "Luxury Valentine's Gift Hampers Nairobi | Surprise Gifts for Loved Ones",
    subtitle: "Premium Valentine's hampers with Ferrero Rocher chocolates, teddy bears, and romantic flowers. Perfect gifts for couples, families, and girlfriends in Nairobi.",
    ctaText: "Valentine's Hampers",
    ctaLink: "/collections/gift-hampers",
  },
  {
    id: 4,
    image: "/images/products/teddies/Teddybear1.jpg",
    title: "Valentine's Teddy Bears Nairobi | Cuddly Gifts for Girlfriend, Wife, Family",
    subtitle: "Soft and adorable Valentine's teddy bears (25cm-200cm) in romantic colors. Express love with cuddly companions - perfect gifts for couples and families in Nairobi.",
    ctaText: "Valentine's Teddy Bears",
    ctaLink: "/collections/teddy-bears",
  },
  {
    id: 5,
    image: "/images/products/Chocolates/Chocolates1.jpg",
    title: "Premium Valentine's Chocolates Nairobi | Romantic Gifts for Couples",
    subtitle: "Luxury Ferrero Rocher chocolates and gourmet Valentine's treats. Sweet surprises for your wife, girlfriend, or family. Same-day delivery across Nairobi.",
    ctaText: "Valentine's Chocolates",
    ctaLink: "/collections/chocolates",
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
            priority={index <= 1}
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex items-center justify-between gap-4 md:gap-8">
                {/* Left side - Text content */}
                <div className="text-left text-white max-w-2xl flex-1">
                  <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-2 md:mb-3 lg:mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl mb-4 md:mb-6 lg:mb-8 text-white/90">{slide.subtitle}</p>
                  <Link href={slide.ctaLink} className="btn-primary inline-block text-xs md:text-sm lg:text-base px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4">
                    {slide.ctaText}
                  </Link>
                </div>
                
                {/* Right side - Two overlapping images */}
                <div className="hidden md:flex items-center justify-end flex-shrink-0 relative">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                    {/* First image - behind, positioned at top-left, bottom-right corner overlaps second image's top-left by 68px */}
                    <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-lg overflow-hidden shadow-lg border-2 border-white/20 z-10" style={{ transform: 'translate(68px, 68px)' }}>
                      <Image
                        src={heroSlides[(index + 1) % heroSlides.length].image}
                        alt={heroSlides[(index + 1) % heroSlides.length].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                        quality={75}
                        loading="lazy"
                      />
                    </div>
                    {/* Second image - in front, positioned so its top-left corner overlaps first image's bottom-right corner by 68px */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-lg overflow-hidden shadow-lg border-2 border-white/20 z-20" style={{ transform: 'translate(-68px, -68px)' }}>
                      <Image
                        src={heroSlides[(index + 2) % heroSlides.length].image}
                        alt={heroSlides[(index + 2) % heroSlides.length].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                        quality={75}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

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

