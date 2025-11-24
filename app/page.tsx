import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://whispersfloralgifts.co.ke";

export const metadata: Metadata = {
  title: "Premium Flower Delivery Nairobi | Same-Day Delivery | Whispers Floral Gifts",
  description:
    "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Birthday flowers, anniversary flowers, funeral wreaths, roses Nairobi. Order online with M-Pesa payment. Fast delivery across Nairobi.",
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
    "flower delivery Nairobi CBD",
    "flower delivery Westlands",
    "flower delivery Karen",
    "flower delivery Lavington",
    "flower delivery Kilimani",
    "florist Nairobi",
    "online flower shop Nairobi",
    "M-Pesa flower delivery Nairobi",
    "fast flower delivery Nairobi",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Whispers Floral Gifts | Premium Flower Delivery Nairobi | Same-Day Delivery",
    description: "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Birthday flowers, anniversary flowers, roses Nairobi.",
    url: baseUrl,
    siteName: "Floral Whispers Gifts",
    images: [
      {
        url: "/images/logo/FloralLogo.jpg",
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
    title: "Whispers Floral Gifts | Premium Flower Delivery Nairobi",
    description: "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
    images: ["/images/logo/FloralLogo.jpg"],
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
  // Fetch featured products
  const [featuredFlowers, featuredHampers, featuredTeddy] = await Promise.all([
    getProducts({ category: "flowers" }).then(products => products.slice(0, 5)),
    getProducts({ category: "hampers" }).then(products => products.slice(0, 5)),
    getProducts({ category: "teddy" }).then(products => products.slice(0, 5)),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div>
        <HeroCarousel />

        {/* Featured Gift Hampers Section */}
        {featuredHampers.length > 0 && (
          <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2 md:mb-4">
                  Premium Gift Hampers
                </h2>
                <p className="text-brand-gray-600 text-sm md:text-base lg:text-lg">
                  Thoughtfully curated gift hampers perfect for every occasion
                </p>
              </div>
              <div className="mb-4 md:mb-6 text-center">
                <Link
                  href="/collections/gift-hampers"
                  className="text-brand-green hover:text-brand-green/80 font-medium text-sm md:text-base"
                >
                  View all →
                </Link>
              </div>
              <div className="flex overflow-x-auto gap-3 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-4 lg:gap-6 pb-3 md:pb-0 scrollbar-visible md:scrollbar-hide">
                {featuredHampers.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[45vw] sm:w-[40vw] md:w-auto">
                    <ProductCard
                      id={product.id}
                      name={product.title}
                      price={product.price}
                      image={product.images[0] || "/images/products/hampers/giftamper.jpg"}
                      slug={product.slug}
                      shortDescription={product.short_description}
                      category={product.category}
                      homePage={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Flowers Section */}
        {featuredFlowers.length > 0 && (
          <section className="py-8 md:py-12 lg:py-16 bg-brand-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2 md:mb-4">
                  Flowers Delivered Same Day in Nairobi
                </h2>
                <p className="text-brand-gray-600 text-sm md:text-base lg:text-lg">
                  Beautiful bouquets for every occasion - same-day delivery available
                </p>
              </div>
              <div className="mb-4 md:mb-6 text-center">
                <Link
                  href="/collections/flowers"
                  className="text-brand-green hover:text-brand-green/80 font-medium text-sm md:text-base"
                >
                  View all →
                </Link>
              </div>
              <div className="flex overflow-x-auto gap-3 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-4 lg:gap-6 pb-3 md:pb-0 scrollbar-visible md:scrollbar-hide">
                {featuredFlowers.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[45vw] sm:w-[40vw] md:w-auto">
                    <ProductCard
                      id={product.id}
                      name={product.title}
                      price={product.price}
                      image={product.images[0] || "/images/products/flowers/BouquetFlowers1.jpg"}
                      slug={product.slug}
                      shortDescription={product.short_description}
                      category={product.category}
                      homePage={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Say It With Flowers Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-4 md:mb-6">
                Say It With Flowers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                <Link
                  href="/collections/flowers?tags=anniversary"
                  className="card p-4 md:p-6 text-center hover:shadow-cardHover transition-shadow group"
                >
                  <div className="text-3xl md:text-4xl mb-2">💐</div>
                  <h3 className="font-heading font-semibold text-sm md:text-base text-brand-gray-900 mb-1 group-hover:text-brand-green transition-colors">
                    Anniversary Flowers
                  </h3>
                </Link>
                <Link
                  href="/collections/flowers?tags=romantic"
                  className="card p-4 md:p-6 text-center hover:shadow-cardHover transition-shadow group"
                >
                  <div className="text-3xl md:text-4xl mb-2">🌹</div>
                  <h3 className="font-heading font-semibold text-sm md:text-base text-brand-gray-900 mb-1 group-hover:text-brand-green transition-colors">
                    Romantic Flowers
                  </h3>
                </Link>
                <Link
                  href="/collections/flowers?tags=birthday"
                  className="card p-4 md:p-6 text-center hover:shadow-cardHover transition-shadow group"
                >
                  <div className="text-3xl md:text-4xl mb-2">🎂</div>
                  <h3 className="font-heading font-semibold text-sm md:text-base text-brand-gray-900 mb-1 group-hover:text-brand-green transition-colors">
                    Birthday Flowers
                  </h3>
                </Link>
                <Link
                  href="/collections/flowers?tags=get well soon"
                  className="card p-4 md:p-6 text-center hover:shadow-cardHover transition-shadow group"
                >
                  <div className="text-3xl md:text-4xl mb-2">🌻</div>
                  <h3 className="font-heading font-semibold text-sm md:text-base text-brand-gray-900 mb-1 group-hover:text-brand-green transition-colors">
                    Get Well Soon Flowers
                  </h3>
                </Link>
                <Link
                  href="/collections/flowers"
                  className="card p-4 md:p-6 text-center hover:shadow-cardHover transition-shadow group"
                >
                  <div className="text-3xl md:text-4xl mb-2">🌸</div>
                  <h3 className="font-heading font-semibold text-sm md:text-base text-brand-gray-900 mb-1 group-hover:text-brand-green transition-colors">
                    Flower Bouquets
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Teddy Bears Section */}
        {featuredTeddy.length > 0 && (
          <section className="py-8 md:py-12 lg:py-16 bg-brand-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2 md:mb-4">
                  Cuddly Teddy Bears
                </h2>
                <p className="text-brand-gray-600 text-sm md:text-base lg:text-lg">
                  Perfect companions for every special moment
                </p>
              </div>
              <div className="mb-4 md:mb-6 text-center">
                <Link
                  href="/collections/teddy-bears"
                  className="text-brand-green hover:text-brand-green/80 font-medium text-sm md:text-base"
                >
                  View all →
                </Link>
              </div>
              <div className="flex overflow-x-auto gap-3 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-4 lg:gap-6 pb-3 md:pb-0 scrollbar-visible md:scrollbar-hide">
                {featuredTeddy.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[45vw] sm:w-[40vw] md:w-auto">
                    <ProductCard
                      id={product.id}
                      name={product.title}
                      price={product.price}
                      image={product.images[0] || "/images/products/teddies/Teddybear1.jpg"}
                      slug={product.slug}
                      shortDescription={product.short_description}
                      category={product.category}
                      homePage={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Categories Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2 md:mb-4">
                Perfect Gifts for Every Occasion
              </h2>
              <p className="text-brand-gray-600 text-sm md:text-base lg:text-lg">
                Thoughtfully curated collections to express your love and appreciation
              </p>
            </div>
            <div className="flex gap-3 md:gap-6 lg:gap-8">
              {/* Flowers Card */}
              <Link
                href="/collections/flowers"
                className="card overflow-hidden group hover:shadow-cardHover transition-all duration-300 flex-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={featuredFlowers[0]?.images[0] || "/images/products/flowers/BouquetFlowers1.jpg"}
                    alt="Flowers Collection"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 30vw, 33vw"
                    loading="lazy"
                    quality={85}
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-heading font-semibold text-lg md:text-xl text-brand-gray-900 mb-2 group-hover:text-brand-green transition-colors">
                    Fresh Flowers
                  </h3>
                  <p className="text-brand-gray-600 text-sm md:text-base mb-4">
                    Handpicked blooms that speak from the heart
                  </p>
                  <span className="btn-primary inline-block text-sm md:text-base">
                    Explore
                  </span>
                </div>
              </Link>

              {/* Teddy Bears Card */}
              <Link
                href="/collections/teddy-bears"
                className="card overflow-hidden group hover:shadow-cardHover transition-all duration-300 flex-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={featuredTeddy[0]?.images[0] || "/images/products/teddies/Teddybear1.jpg"}
                    alt="Teddy Bears Collection"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 30vw, 33vw"
                    loading="lazy"
                    quality={85}
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-heading font-semibold text-lg md:text-xl text-brand-gray-900 mb-2 group-hover:text-brand-green transition-colors">
                    Cuddly Teddy Bears
                  </h3>
                  <p className="text-brand-gray-600 text-sm md:text-base mb-4">
                    Soft companions that bring comfort and joy
                  </p>
                  <span className="btn-primary inline-block text-sm md:text-base">
                    Explore
                  </span>
                </div>
              </Link>

              {/* Gift Hampers Card */}
              <Link
                href="/collections/gift-hampers"
                className="card overflow-hidden group hover:shadow-cardHover transition-all duration-300 flex-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={featuredHampers[0]?.images[0] || "/images/products/hampers/giftamper.jpg"}
                    alt="Gift Hampers Collection"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 30vw, 33vw"
                    loading="lazy"
                    quality={85}
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-heading font-semibold text-lg md:text-xl text-brand-gray-900 mb-2 group-hover:text-brand-green transition-colors">
                    Luxury Gift Hampers
                  </h3>
                  <p className="text-brand-gray-600 text-sm md:text-base mb-4">
                    Elegant collections of premium treats for every occasion
                  </p>
                  <span className="btn-primary inline-block text-sm md:text-base">
                    Explore
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-8 md:py-12 lg:py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-brand-green"
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
                <h3 className="font-heading font-semibold text-lg md:text-xl text-brand-gray-900 mb-2">
                  Same Day Flower Delivery
                </h3>
                <p className="text-brand-gray-600 text-sm md:text-base">
                  Shop floral arrangements and gifts online - we deliver within Nairobi on the same day, and reach the rest of Kenya the following day.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg md:text-xl text-brand-gray-900 mb-2">
                  Support Small Business
                </h3>
                <p className="text-brand-gray-600 text-sm md:text-base">
                  As a small local florist pouring care into every arrangement, we deliver handcrafted flowers and thoughtful gifts with love.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg md:text-xl text-brand-gray-900 mb-2">
                  Personalised Flower Arrangements
                </h3>
                <p className="text-brand-gray-600 text-sm md:text-base">
                  Design your own unique flower arrangement - mix and match your favorite blooms, add your special message, and make it truly yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-8 md:py-12 lg:py-16 bg-brand-green text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4">
              Save 10% on Your First Purchase
            </h2>
            <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 text-white/90">
              Sign up today and we&apos;ll send you a 10% discount code towards your first purchase.
            </p>
            <form className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-brand-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="btn-primary bg-white text-brand-green hover:bg-brand-gray-100 px-6 py-3"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
