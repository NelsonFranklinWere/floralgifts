import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://whispersfloralgifts.co.ke";

export const metadata: Metadata = {
  title: "Collections | Whispers Floral Gifts - Flowers, Teddy Bears, Gift Hampers Nairobi",
  description: "Browse our collections: premium flowers Nairobi, teddy bears Kenya, gift hampers Kenya, wines Nairobi, chocolates Kenya. Christmas gifts, holiday collections, December specials. Same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Fast delivery across Nairobi.",
  keywords: [
    "flower collections Nairobi",
    "teddy bear collections Kenya",
    "gift hamper collections Kenya",
    "wine collections Nairobi",
    "chocolate collections Kenya",
    "flowers Nairobi CBD",
    "gift hampers Westlands",
    "teddy bears Karen",
    "wines Lavington",
    "chocolates Kilimani",
    "Christmas collections Nairobi",
    "holiday gift collections",
    "December gift collections",
    "Christmas gift collections Kenya",
    "holiday season collections",
  ],
  alternates: {
    canonical: `${baseUrl}/collections`,
  },
  openGraph: {
    title: "Collections | Whispers Floral Gifts - Flowers, Teddy Bears, Gift Hampers",
    description: "Browse our collections: premium flowers, teddy bears, gift hampers, wines, and chocolates in Nairobi. Same-day delivery available.",
    url: `${baseUrl}/collections`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collections | Whispers Floral Gifts",
    description: "Browse our collections: premium flowers, teddy bears, gift hampers, wines, and chocolates in Nairobi.",
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
    {
      "@type": "ListItem",
      position: 2,
      name: "Collections",
      item: `${baseUrl}/collections`,
    },
  ],
};

export default function CollectionsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            Our Collections
          </h1>
          <p className="text-brand-gray-600 text-lg">
            Explore our beautiful range of flowers, teddy bears, gift hampers, wines, and chocolates
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          <Link
            href="/collections/flowers"
            className="card overflow-hidden group block"
          >
            <div className="relative h-48 md:h-80 overflow-hidden">
              <Image
                src="/images/products/flowers/BouquetFlowers2.jpg"
                alt="Premium flower delivery Nairobi - Birthday flowers, anniversary flowers, roses Nairobi"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="p-3 md:p-8">
              <h2 className="font-heading font-bold text-base md:text-3xl text-brand-gray-900 mb-2 md:mb-3 group-hover:text-brand-green transition-colors">
                Flowers
              </h2>
              <p className="text-brand-gray-600 mb-2 md:mb-4 text-xs md:text-base line-clamp-2 md:line-clamp-none">
                Beautiful bouquets for every occasion - birthdays, anniversaries, get well soon, funerals, and more
              </p>
              <span className="text-brand-green font-medium text-xs md:text-base">Shop Flowers →</span>
            </div>
          </Link>

          <Link
            href="/collections/teddy-bears"
            className="card overflow-hidden group block"
          >
            <div className="relative h-48 md:h-80 overflow-hidden">
              <Image
                src="/images/products/teddies/Teddybear1.jpg"
                alt="Teddy bears Kenya - Red, white, brown, pink, blue teddy bears in various sizes"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="p-3 md:p-8">
              <h2 className="font-heading font-bold text-base md:text-3xl text-brand-gray-900 mb-2 md:mb-3 group-hover:text-brand-green transition-colors">
                Teddy Bears
              </h2>
              <p className="text-brand-gray-600 mb-2 md:mb-4 text-xs md:text-base line-clamp-2 md:line-clamp-none">
                Cuddly teddy bears in various sizes and colors - perfect for gifts and special occasions
              </p>
              <span className="text-brand-green font-medium text-xs md:text-base">Shop Teddy Bears →</span>
            </div>
          </Link>

          <Link
            href="/collections/gift-hampers"
            className="card overflow-hidden group block"
          >
            <div className="relative h-48 md:h-80 overflow-hidden">
              <Image
                src="/images/products/hampers/giftamper.jpg"
                alt="Gift hampers Kenya - Chocolate gift hampers, wine gift hampers, corporate gift hampers Nairobi"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="p-3 md:p-8">
              <h2 className="font-heading font-bold text-base md:text-3xl text-brand-gray-900 mb-2 md:mb-3 group-hover:text-brand-green transition-colors">
                Gift Hampers
              </h2>
              <p className="text-brand-gray-600 mb-2 md:mb-4 text-xs md:text-base line-clamp-2 md:line-clamp-none">
                Luxury gift hampers filled with curated items - perfect for corporate gifts and celebrations
              </p>
              <span className="text-brand-green font-medium text-xs md:text-base">Shop Gift Hampers →</span>
            </div>
          </Link>

          <Link
            href="/collections/wines"
            className="card overflow-hidden group block"
          >
            <div className="relative h-48 md:h-80 overflow-hidden">
              <Image
                src="/images/products/wines/Wines1.jpg"
                alt="Premium wines Nairobi - Wine gift hampers, celebration wines Kenya"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="p-3 md:p-8">
              <h2 className="font-heading font-bold text-base md:text-3xl text-brand-gray-900 mb-2 md:mb-3 group-hover:text-brand-green transition-colors">
                Wines
              </h2>
              <p className="text-brand-gray-600 mb-2 md:mb-4 text-xs md:text-base line-clamp-2 md:line-clamp-none">
                Premium wines for every occasion - perfect for celebrations, gifts, and special moments
              </p>
              <span className="text-brand-green font-medium text-xs md:text-base">Shop Wines →</span>
            </div>
          </Link>

          <Link
            href="/collections/chocolates"
            className="card overflow-hidden group block"
          >
            <div className="relative h-48 md:h-80 overflow-hidden">
              <Image
                src="/images/products/Chocolates/Chocolates1.jpg"
                alt="Premium chocolates Kenya - Chocolate gift hampers, Ferrero Rocher chocolates Nairobi"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="p-3 md:p-8">
              <h2 className="font-heading font-bold text-base md:text-3xl text-brand-gray-900 mb-2 md:mb-3 group-hover:text-brand-green transition-colors">
                Chocolates
              </h2>
              <p className="text-brand-gray-600 mb-2 md:mb-4 text-xs md:text-base line-clamp-2 md:line-clamp-none">
                Delicious premium chocolates - perfect for gifts, celebrations, and sweet moments
              </p>
              <span className="text-brand-green font-medium text-xs md:text-base">Shop Chocolates →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

