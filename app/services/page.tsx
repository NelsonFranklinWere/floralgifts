import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SHOP_INFO } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Valentine's Delivery Services Nairobi | Same-Day Romantic Flowers, Chocolates & Gift Hampers | Floral Whispers Gifts",
  description:
    "Valentine's delivery services Nairobi: same-day romantic flowers, chocolates, wine, teddy bears & surprise hampers for your wife, husband, girlfriend. Pre-Valentine's orders, express delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Order Valentine's gifts online with guaranteed delivery.",
  keywords: [
    // Valentine's Delivery Services
    "valentine's delivery services nairobi",
    "same day valentine's delivery nairobi",
    "valentine's express delivery nairobi",
    "valentine's gift delivery nairobi",
    "pre valentine's delivery nairobi",

    // Valentine's Service Areas
    "valentine's delivery CBD nairobi",
    "valentine's flowers westlands delivery",
    "valentine's gifts karen delivery",
    "valentine's hampers lavington delivery",
    "valentine's chocolates kilimani delivery",

    // Valentine's Customization
    "valentine's custom arrangements nairobi",
    "personalized valentine's gifts nairobi",
    "valentine's surprise packages nairobi",
    "custom valentine's hampers nairobi",
    "bespoke valentine's flowers nairobi",

    // Valentine's Delivery Timing
    "valentine's rush delivery nairobi",
    "last minute valentine's delivery nairobi",
    "urgent valentine's gifts nairobi",
    "emergency valentine's delivery nairobi",
    "guaranteed valentine's delivery nairobi",

    // Valentine's Service Types
    "valentine's flower styling nairobi",
    "romantic valentine's arrangements nairobi",
    "valentine's gift wrapping nairobi",
    "valentine's hamper assembly nairobi",
    "valentine's personalization nairobi",

    // Valentine's Long-tail Services
    "professional valentine's delivery service nairobi",
    "reliable valentine's gift delivery kenya",
    "experienced valentine's florist services nairobi",
    "trusted valentine's delivery partner nairobi",

    // Valentine's Seasonal Services
    "february valentine's delivery nairobi",
    "2025 valentine's services nairobi",
    "love month delivery services kenya",

    // Traditional services keywords
    "wedding flowers Nairobi",
    "corporate gifts Nairobi",
    "surprise gift delivery Nairobi",
    "romantic flower arrangements Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/services`,
  },
  openGraph: {
    title: "Valentine's Delivery Services Nairobi | Same-Day Romantic Flowers, Chocolates & Gift Hampers",
    description: "Valentine's delivery services Nairobi: same-day romantic flowers, chocolates, wine, teddy bears & surprise hampers. Pre-Valentine's orders, express delivery across Nairobi.",
    url: `${baseUrl}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentine's Delivery Services Nairobi | Same-Day Romantic Gifts",
    description: "Valentine's delivery services Nairobi: same-day romantic flowers, chocolates, wine, teddy bears & surprise hampers. Pre-Valentine's orders, express delivery across Nairobi.",
  },
};

const services = [
  {
    title: "Wedding Flowers",
    description:
      "Complete wedding floral services including bridal bouquets, centerpieces, ceremony arrangements, and reception decorations. Let us bring your dream wedding to life.",
    image: "/images/products/flowers/BouquetFlowers2.jpg",
    features: [
      "Bridal bouquets",
      "Bridal party flowers",
      "Ceremony arrangements",
      "Reception centerpieces",
      "Boutonnières & corsages",
    ],
  },
  {
    title: "Graduation Celebrations",
    description:
      "Celebrate academic achievements with stunning graduation bouquets and gift hampers. Perfect for congratulating graduates on their success.",
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    features: [
      "Graduation bouquets",
      "Congratulations hampers",
      "Teddy bears with graduation accessories",
      "Custom arrangements",
    ],
  },
  {
    title: "Corporate Gifts",
    description:
      "Professional gift solutions for your business needs. Luxury hampers, elegant arrangements, and branded gifts that impress clients and employees.",
    image: "/images/products/hampers/giftamper.jpg",
    features: [
      "Corporate gift hampers",
      "Executive bouquets",
      "Employee appreciation gifts",
      "Client thank-you arrangements",
      "Bulk ordering available",
    ],
  },
  {
    title: "Flower Styling & Design",
    description:
      "Professional floral design services for events, parties, and special occasions. Custom arrangements tailored to your style and theme.",
    image: "/images/products/flowers/BouquetFlowers4.jpg",
    features: [
      "Event styling",
      "Custom arrangements",
      "Theme-based designs",
      "Seasonal collections",
      "Consultation services",
    ],
  },
  {
    title: "Sympathy & Condolences",
    description:
      "Thoughtful and respectful arrangements for expressing condolences. Elegant funeral flowers and sympathy bouquets delivered with care.",
    image: "/images/products/flowers/BouquetFlowers5.jpg",
    features: [
      "Funeral wreaths",
      "Sympathy bouquets",
      "Casket arrangements",
      "Memorial tributes",
    ],
  },
  {
    title: "Special Occasions",
    description:
      "Birthdays, anniversaries, Valentine&apos;s Day, Mother&apos;s Day, and more. We have the perfect arrangement for every special moment.",
    image: "/images/products/flowers/BouquetFlowers6.jpg",
    features: [
      "Birthday bouquets",
      "Anniversary arrangements",
      "Valentine&apos;s Day specials",
      "Mother&apos;s Day collections",
      "Get well soon flowers",
    ],
  },
];

export default function ServicesPage() {
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
        name: "Services",
        item: `${baseUrl}/services`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-brand-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive floral and gift services for every occasion in Nairobi and beyond
          </p>
        </div>

        <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 mb-12 pb-3 md:pb-0 scrollbar-visible md:scrollbar-hide">
          {services.map((service, index) => (
            <div key={index} className="flex-shrink-0 w-[70vw] sm:w-[65vw] md:w-auto card overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={`${service.title} - Floral Whispers Gifts Nairobi`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 70vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-3 group-hover:text-brand-green transition-colors">
                  {service.title}
                </h2>
                <p className="text-brand-gray-700 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-brand-gray-600 flex items-start">
                      <span className="text-brand-green mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-green text-white rounded-lg p-8 md:p-12 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Ready to Make Your Event Special?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Contact us to discuss your needs. We offer consultations and custom quotes for all our
            services.
          </p>
          <div className="flex flex-row gap-3 md:gap-4 justify-center">
            <Link href="/contact" className="btn-primary bg-white text-brand-green hover:bg-brand-gray-100 inline-block text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
              Contact Us
            </Link>
            <Link href="/collections" className="btn-outline bg-transparent border-white text-white hover:bg-white/10 inline-block text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
              Browse Collections
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:gap-8">
          <div className="card p-3 md:p-6">
            <h3 className="font-heading font-bold text-sm md:text-xl text-brand-gray-900 mb-2 md:mb-4">
              Delivery Information
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-base text-brand-gray-700 mb-4">
              <li>
                <span className="font-semibold">Nairobi CBD:</span> Complimentary same-day delivery - your gifts arrive fresh and on time
              </li>
              <li>
                <span className="font-semibold">Outside Nairobi:</span> Swift next-day delivery with transparent, location-based pricing
              </li>
              <li>
                <span className="font-semibold">Nationwide:</span> Reliable 24-hour delivery service across Kenya, bringing joy everywhere
              </li>
              <li>
                <span className="font-semibold">Rush Orders:</span> Express delivery available - we&apos;ll make it happen when you need it most
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-brand-gray-200">
              <p className="text-xs md:text-sm text-brand-gray-600 italic">
                <span className="font-semibold text-brand-green">💡 Pro Tip:</span> During checkout, review your cart to see location-specific delivery fees and estimated arrival times tailored to your delivery address.
              </p>
            </div>
          </div>

          <div className="card p-3 md:p-6">
            <h3 className="font-heading font-bold text-sm md:text-xl text-brand-gray-900 mb-2 md:mb-4">
              Payment Options
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-base text-brand-gray-700">
              <li>
                <span className="font-semibold">M-Pesa:</span> Pay via STK Push on checkout
              </li>
              <li>
                <span className="font-semibold">Till Number:</span>{" "}
                <span className="font-mono font-semibold text-brand-green">{SHOP_INFO.mpesa.till}</span>
              </li>
              <li>
                <span className="font-semibold">PayBill:</span>{" "}
                <span className="font-mono font-semibold text-brand-green">{SHOP_INFO.mpesa.paybill}</span>
              </li>
              <li>
                <span className="font-semibold">WhatsApp:</span> Order and arrange payment via
                WhatsApp
              </li>
              <li>
                <span className="font-semibold">Corporate:</span> Credit terms available for bulk
                orders
              </li>
              <li>
                <span className="font-semibold">Cash on Delivery:</span> Available for Nairobi
                orders
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

