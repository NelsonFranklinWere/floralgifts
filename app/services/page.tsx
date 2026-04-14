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
      <div className="py-12 bg-gradient-to-br from-brand-green/5 via-white to-brand-red/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-green/20 to-brand-red/20 backdrop-blur-sm rounded-full mb-6 shadow-lg border border-white/50">
            <span className="text-2xl">🎉</span>
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-5xl bg-gradient-to-r from-brand-green to-brand-red bg-clip-text text-transparent mb-6">
            Our Event Services
          </h1>
          <p className="text-brand-gray-700 text-lg max-w-3xl mx-auto bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-brand-gray-200 shadow-md">
            Comprehensive floral and gift services for every occasion in Nairobi and beyond. From intimate celebrations to grand corporate events.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 mb-16 pb-4 md:pb-0 scrollbar-visible md:scrollbar-hide">
          {services.map((service, index) => (
            <div key={index} className="flex-shrink-0 w-[70vw] sm:w-[65vw] md:w-auto bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={`${service.title} - Floral Whispers Gifts Nairobi`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 70vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <span className="text-lg">🌸</span>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-white/80 to-brand-gray-50/50">
                <h2 className="font-heading font-bold text-xl bg-gradient-to-r from-brand-gray-900 to-brand-gray-700 bg-clip-text text-transparent mb-3 group-hover:from-brand-green group-hover:to-brand-red group-hover:bg-clip-text transition-all duration-300">
                  {service.title}
                </h2>
                <p className="text-brand-gray-700 mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-brand-gray-600 flex items-start group/item">
                      <span className="text-brand-green mr-2 font-bold group-hover/item:text-brand-red transition-colors">✓</span>
                      <span className="group-hover/item:text-brand-gray-800 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-brand-green via-brand-red to-brand-green text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <span className="text-2xl">🎊</span>
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Ready to Make Your Event Special?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Contact us to discuss your needs. We offer consultations and custom quotes for all our
              services.
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-brand-green hover:bg-brand-gray-100 hover:text-brand-red px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                <span>💬</span>
                Contact Us
              </Link>
              <Link href="/collections" className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-green px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105">
                <span>🌸</span>
                Browse Collections
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-green/20 to-brand-red/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🚚</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-brand-gray-900">
                Delivery Information
              </h3>
            </div>
            <ul className="space-y-3 text-brand-gray-700 mb-6">
              <li className="bg-brand-green/10 p-3 rounded-lg border border-brand-green/20">
                <span className="font-semibold text-brand-green">Nairobi CBD:</span> Complimentary same-day delivery - your gifts arrive fresh and on time
              </li>
              <li className="bg-brand-red/10 p-3 rounded-lg border border-brand-red/20">
                <span className="font-semibold text-brand-red">Outside Nairobi:</span> Swift next-day delivery with transparent, location-based pricing
              </li>
              <li className="bg-brand-gray-100 p-3 rounded-lg border border-brand-gray-200">
                <span className="font-semibold">Nationwide:</span> Reliable 24-hour delivery service across Kenya, bringing joy everywhere
              </li>
              <li className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="font-semibold text-yellow-700">Rush Orders:</span> Express delivery available - we&apos;ll make it happen when you need it most
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-brand-gray-200 bg-gradient-to-r from-brand-green/5 to-brand-red/5 p-4 rounded-lg">
              <p className="text-sm text-brand-gray-700 leading-relaxed">
                <span className="font-semibold text-brand-green">💡 Pro Tip:</span> During checkout, review your cart to see location-specific delivery fees and estimated arrival times tailored to your delivery address.
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-green/20 to-brand-red/20 rounded-full flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-brand-gray-900">
                Payment Options
              </h3>
            </div>
            <ul className="space-y-3 text-brand-gray-700">
              <li className="bg-brand-green/10 p-3 rounded-lg border border-brand-green/20">
                <span className="font-semibold text-brand-green">M-Pesa:</span> Pay via STK Push on checkout
              </li>
              <li className="bg-brand-red/10 p-3 rounded-lg border border-brand-red/20">
                <span className="font-semibold text-brand-red">Till Number:</span>{" "}
                <span className="font-mono font-bold text-brand-green bg-white px-2 py-1 rounded">{SHOP_INFO.mpesa.till}</span>
              </li>
              <li className="bg-brand-red/10 p-3 rounded-lg border border-brand-red/20">
                <span className="font-semibold text-brand-red">PayBill:</span>{" "}
                <span className="font-mono font-bold text-brand-green bg-white px-2 py-1 rounded">{SHOP_INFO.mpesa.paybill}</span>
              </li>
              <li className="bg-brand-gray-100 p-3 rounded-lg border border-brand-gray-200">
                <span className="font-semibold">WhatsApp:</span> Order and arrange payment via WhatsApp
              </li>
              <li className="bg-brand-gray-100 p-3 rounded-lg border border-brand-gray-200">
                <span className="font-semibold">Corporate:</span> Credit terms available for bulk orders
              </li>
              <li className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="font-semibold text-yellow-700">Cash on Delivery:</span> Available for Nairobi orders
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

