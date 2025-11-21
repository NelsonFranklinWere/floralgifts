import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import HeroCarousel from "@/components/HeroCarousel";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";

export const metadata: Metadata = {
  title: "Premium Flower Delivery Nairobi | Same-Day Delivery | Floral Whispers Gifts",
  description:
    "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery Nairobi CBD. Birthday flowers, anniversary flowers, funeral wreaths, roses Nairobi. Order online with M-Pesa payment.",
  keywords: [
    "flower delivery Nairobi",
    "roses Nairobi",
    "gift hampers Kenya",
    "birthday flowers Nairobi",
    "anniversary flowers Kenya",
    "funeral wreaths Nairobi",
    "teddy bears Kenya",
    "same-day delivery Nairobi",
    "romantic flowers Nairobi",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Floral Whispers Gifts | Premium Flower Delivery Nairobi | Same-Day Delivery",
    description: "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery Nairobi CBD. Birthday flowers, anniversary flowers, roses Nairobi.",
    url: baseUrl,
    siteName: "Floral Whispers Gifts",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Floral Whispers Gifts - Premium Flowers & Gifts in Nairobi",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Floral Whispers Gifts | Premium Flower Delivery Nairobi",
    description: "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery available.",
    images: ["/images/logo.jpg"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ],
};

export default async function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div>
      <HeroCarousel />

      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-heading font-bold text-xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2 md:mb-4">
              Shop by Category
            </h1>
            <p className="text-brand-gray-600 text-sm md:text-lg">
              Choose from our beautiful collection of flowers, teddy bears, and gift hampers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
            <div className="card overflow-hidden group">
              <Link href="/collections/flowers" className="block">
                <div className="relative h-32 md:h-48 lg:h-64 overflow-hidden">
                  <Image
                    src="/images/products/flowers/BouquetFlowers2.jpg"
                    alt="Premium flower delivery Nairobi - Birthday flowers, anniversary flowers, roses Nairobi"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4 lg:p-6">
                  <h2 className="font-heading font-semibold text-base md:text-lg lg:text-xl text-brand-gray-900 mb-1 md:mb-2 group-hover:text-brand-green transition-colors">
                    Flowers
                  </h2>
                  <p className="text-brand-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">
                    Beautiful bouquets for every occasion - birthdays, anniversaries, get well soon, and more
                  </p>
                </div>
              </Link>
              <div className="px-3 md:px-4 lg:px-6 pb-3 md:pb-4 lg:pb-6">
                <Link
                  href="/collections/flowers"
                  className="btn-primary w-full text-center block text-xs md:text-sm py-2 md:py-3"
                >
                  View Flowers →
                </Link>
              </div>
            </div>

            <div className="card overflow-hidden group">
              <Link href="/collections/teddy-bears" className="block">
                <div className="relative h-32 md:h-48 lg:h-64 overflow-hidden">
                  <Image
                    src="/images/products/teddies/Teddybear1.jpg"
                    alt="Teddy bears Kenya - Red, white, brown, pink, blue teddy bears in various sizes"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4 lg:p-6">
                  <h2 className="font-heading font-semibold text-base md:text-lg lg:text-xl text-brand-gray-900 mb-1 md:mb-2 group-hover:text-brand-green transition-colors">
                    Teddy Bears
                  </h2>
                  <p className="text-brand-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">
                    Cuddly teddy bears in various sizes and colors - perfect for gifts and special occasions
                  </p>
                </div>
              </Link>
              <div className="px-3 md:px-4 lg:px-6 pb-3 md:pb-4 lg:pb-6">
                <Link
                  href="/collections/teddy-bears"
                  className="btn-primary w-full text-center block text-xs md:text-sm py-2 md:py-3"
                >
                  View Teddy Bears →
                </Link>
              </div>
            </div>

            <div className="card overflow-hidden group">
              <Link href="/collections/gift-hampers" className="block">
                <div className="relative h-32 md:h-48 lg:h-64 overflow-hidden">
                  <Image
                    src="/images/products/hampers/giftamper.jpg"
                    alt="Gift hampers Kenya - Chocolate gift hampers, wine gift hampers, corporate gift hampers Nairobi"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4 lg:p-6">
                  <h2 className="font-heading font-semibold text-base md:text-lg lg:text-xl text-brand-gray-900 mb-1 md:mb-2 group-hover:text-brand-green transition-colors">
                    Gift Hampers
                  </h2>
                  <p className="text-brand-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">
                    Luxury gift hampers filled with curated items - perfect for corporate gifts and celebrations
                  </p>
                </div>
              </Link>
              <div className="px-3 md:px-4 lg:px-6 pb-3 md:pb-4 lg:pb-6">
                <Link
                  href="/collections/gift-hampers"
                  className="btn-primary w-full text-center block text-xs md:text-sm py-2 md:py-3"
                >
                  View Gift Hampers →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 bg-brand-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-brand-gray-900 mb-2 md:mb-4">
              Why Choose Floral Whispers Gifts?
            </h2>
            <p className="text-brand-gray-600 text-sm md:text-base lg:text-lg">
              Experience the perfect blend of quality, convenience, and care
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-brand-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="font-heading font-semibold text-sm md:text-base lg:text-lg text-brand-gray-900 mb-1 md:mb-2">
                Same-Day Delivery
              </h2>
              <p className="text-brand-gray-600 text-xs md:text-sm">
                Free same-day delivery within Nairobi CBD. Outside CBD, we deliver within 24 hours at a nominal fee.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-brand-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h2 className="font-heading font-semibold text-sm md:text-base lg:text-lg text-brand-gray-900 mb-1 md:mb-2">
                Premium Quality
              </h2>
              <p className="text-brand-gray-600 text-xs md:text-sm">
                We source only the finest flowers and curate gift hampers with meticulous attention to detail
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-brand-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="font-heading font-semibold text-sm md:text-base lg:text-lg text-brand-gray-900 mb-1 md:mb-2">
                Nationwide Delivery
              </h2>
              <p className="text-brand-gray-600 text-xs md:text-sm">
                Deliveries across Kenya within 24 hours - your gifts reach loved ones anywhere
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-brand-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="font-heading font-semibold text-sm md:text-base lg:text-lg text-brand-gray-900 mb-1 md:mb-2">
                Trusted Service
              </h2>
              <p className="text-brand-gray-600 text-xs md:text-sm">
                Thousands of satisfied customers trust us for their special moments and celebrations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 bg-brand-green text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4">
            Fast & Reliable Same-Day Delivery Nairobi
          </h2>
          <p className="text-sm md:text-base lg:text-lg mb-3 md:mb-4 text-white/90">
            <strong>Nairobi CBD:</strong> Free same-day delivery. Your beautiful gifts arrive the same day at no extra cost.
          </p>
          <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 text-white/90">
            <strong>Outside CBD:</strong> Delivery within 24 hours at a nominal fee. We ensure your gifts reach you fresh and on time, wherever you are.
          </p>
          <Link href="/collections" className="btn-primary bg-white text-brand-green hover:bg-brand-gray-100 inline-block text-sm md:text-base py-2 md:py-3 px-4 md:px-6">
            Browse Collections
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}

