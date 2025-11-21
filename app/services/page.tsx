import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";

export const metadata: Metadata = {
  title: "Services | Floral Whispers Gifts - Wedding Flowers, Corporate Gifts, Event Styling Nairobi",
  description:
    "Comprehensive floral and gift services Nairobi: wedding flowers, graduation celebrations, corporate gifts, flower styling, sympathy & condolences, special occasions. Same-day delivery available.",
  keywords: [
    "wedding flowers Nairobi",
    "corporate gifts Kenya",
    "flower styling Nairobi",
    "event flowers Nairobi",
    "graduation flowers Kenya",
    "sympathy flowers Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/services`,
  },
  openGraph: {
    title: "Services | Floral Whispers Gifts - Wedding Flowers, Corporate Gifts Nairobi",
    description: "Comprehensive floral and gift services Nairobi: wedding flowers, corporate gifts, event styling, special occasions.",
    url: `${baseUrl}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Floral Whispers Gifts",
    description: "Comprehensive floral and gift services Nairobi: wedding flowers, corporate gifts, event styling.",
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

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="card overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={`${service.title} - Floral Whispers Gifts Nairobi`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            <ul className="space-y-1 md:space-y-2 text-xs md:text-base text-brand-gray-700">
              <li>
                <span className="font-semibold">Nairobi CBD:</span> Free same-day delivery
              </li>
              <li>
                <span className="font-semibold">Outside CBD:</span> Delivery within 24 hours at a nominal fee
              </li>
              <li>
                <span className="font-semibold">Nationwide:</span> 24-hour delivery across Kenya
              </li>
              <li>
                <span className="font-semibold">Rush Orders:</span> Available upon request
              </li>
            </ul>
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

