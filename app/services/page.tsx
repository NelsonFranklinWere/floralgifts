import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SHOP_INFO } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Flower & Gift Services Nairobi | Floral Whispers",
  description:
    "Same-day flower and gift delivery in Nairobi: bouquets, hampers, wedding and corporate flowers, and sympathy arrangements from Floral Whispers Gifts.",
  alternates: {
    canonical: `${baseUrl}/services`,
  },
  openGraph: {
    title: "Flower & Gift Services Nairobi | Floral Whispers",
    description: "Same-day flower and gift delivery in Nairobi: bouquets, hampers, wedding and corporate flowers, and sympathy arrangements from Floral Whispers Gifts.",
    url: `${baseUrl}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flower & Gift Services Nairobi | Floral Whispers",
    description: "Same-day flower and gift delivery in Nairobi: bouquets, hampers, wedding and corporate flowers, and sympathy arrangements from Floral Whispers Gifts.",
  },
};

const services = [
  {
    title: "Wedding Flowers",
    description:
      "Flowers for your day, from the bride’s bouquet to the tables, planned around your colours and your venue.",
    image: "/images/products/flowers/BouquetFlowers2.jpg",
    features: [
      "A bouquet for the bride",
      "Flowers for bridesmaids and family",
      "Flowers for the church or garden",
      "Table flowers for the reception",
      "Buttonholes for the groom's party",
    ],
  },
  {
    title: "Graduation Celebrations",
    description:
      "Bright bouquets, money bouquets with graduation toppers and teddy bears that look great in ceremony photos.",
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    features: [
      "Bouquets from PP2 to campus",
      "Hampers that say well done",
      "Bears dressed for the ceremony",
      "Something made just for you",
    ],
  },
  {
    title: "Corporate Gifts",
    description:
      "Hampers and office flowers for clients and staff, with branded cards and delivery planned across your locations.",
    image: "/images/products/hampers/giftamper.jpg",
    features: [
      "Hampers for clients and staff",
      "Flowers for the boss's office",
      "Thank-you gifts for your team",
      "Flowers to thank a client",
      "Large orders welcome",
    ],
  },
  {
    title: "Flower Styling & Design",
    description:
      "Tell us the mood and the budget, and we will design something made only for that occasion.",
    image: "/images/products/flowers/BouquetFlowers4.jpg",
    features: [
      "Flowers styled for your event",
      "Something made just for you",
      "Designs built around your theme",
      "Seasonal flower choices",
      "Advice before you decide",
    ],
  },
  {
    title: "Sympathy & Condolences",
    description:
      "Heart and round wreaths and casket flowers, prepared with care and delivered to the home, church or funeral venue.",
    image: "/images/products/flowers/BouquetFlowers5.jpg",
    features: [
      "Heart and round wreaths",
      "Flowers for a grieving family",
      "Flowers for the casket",
      "Tributes for a loved one",
    ],
  },
  {
    title: "Special Occasions",
    description:
      "Birthdays, anniversaries, new babies and quick recoveries: gifts chosen for the person, then delivered across Kenya.",
    image: "/images/products/flowers/BouquetFlowers6.jpg",
    features: [
      "Flowers for a birthday",
      "Roses for your anniversary",
      "Gifts for 14 February",
      "Gifts for Mum on her day",
      "Flowers and fruit for recovery",
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
            What We Do
          </h1>
          <p className="text-brand-gray-700 text-lg max-w-3xl mx-auto bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-brand-gray-200 shadow-md">
            What we make for people across Nairobi and the rest of Kenya, whether the moment is big, quiet or last-minute.
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
              Have Something in Mind?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Tell us the date, the place and your budget. We will suggest what fits and give you a price
              before you commit.
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-brand-green hover:bg-brand-gray-100 hover:text-brand-red px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                <span>💬</span>
                Talk to Us
              </Link>
              <Link href="/collections" className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-green px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105">
                <span>🌸</span>
                See What We Sell
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
                How Delivery Works
              </h3>
            </div>
            <ul className="space-y-3 text-brand-gray-700 mb-6">
              <li className="bg-brand-green/10 p-3 rounded-lg border border-brand-green/20">
                <span className="font-semibold text-brand-green">Nairobi CBD:</span> Free, and same-day when you order by 6PM
              </li>
              <li className="bg-brand-red/10 p-3 rounded-lg border border-brand-red/20">
                <span className="font-semibold text-brand-red">Outside Nairobi:</span> Usually arrives the next day, and the fee depends on the town
              </li>
              <li className="bg-brand-gray-100 p-3 rounded-lg border border-brand-gray-200">
                <span className="font-semibold">Across Kenya:</span> We have delivered as far as Nakuru and Mombasa. We confirm the date with you first
              </li>
              <li className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="font-semibold text-yellow-700">Rush Orders:</span> Running late? Message us and we will tell you if express delivery is possible
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
                How to Pay
              </h3>
            </div>
            <ul className="space-y-3 text-brand-gray-700">
              <li className="bg-brand-green/10 p-3 rounded-lg border border-brand-green/20">
                <span className="font-semibold text-brand-green">M-Pesa:</span> Pay at checkout with M-Pesa or card
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
                <span className="font-semibold">WhatsApp:</span> Send your order on WhatsApp, and we will sort out payment there
              </li>
              <li className="bg-brand-gray-100 p-3 rounded-lg border border-brand-gray-200">
                <span className="font-semibold">Corporate:</span> Ask us about credit terms on large orders
              </li>
              <li className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="font-semibold text-yellow-700">Cash on Delivery:</span> You can pay the rider on Nairobi orders
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

