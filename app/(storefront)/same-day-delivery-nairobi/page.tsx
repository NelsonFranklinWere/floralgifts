import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Same-Day Delivery Nairobi | Express Gifts & Flowers Florist",
  description:
    "Need express same-day gift delivery in Nairobi? Order fresh flower bouquets, wine hampers and giant teddy bears before 2 PM EAT for same-day delivery across the city.",
  alternates: { canonical: `${baseUrl}/same-day-delivery-nairobi` },
  openGraph: {
    title: "Same-Day Delivery Nairobi | Express Gifts & Flowers Florist",
    description: "Need express same-day gift delivery in Nairobi? Order before 2 PM EAT for same-day delivery across the city.",
    url: `${baseUrl}/same-day-delivery-nairobi`,
    type: "website",
    images: [{ url: "/images/products/flowers/BouquetFlowers1.jpg", width: 1200, height: 630, alt: "Same-Day Delivery Nairobi" }],
  },
};

function mergeUniqueBySlug<T extends { slug: string }>(db: T[], fallback: T[]) {
  const dbSlugs = new Set(db.map((p) => p.slug));
  const uniqueFallback = fallback.filter((p) => !dbSlugs.has(p.slug));
  return [...db, ...uniqueFallback];
}

export default async function SameDayDeliveryNairobiPage() {
  const whatsappText = encodeURIComponent(
    "Hello Floral Whispers Gifts, I need an urgent same-day gift delivery in Nairobi today. What packages are available?"
  );

  const [dbFlowers, dbHampers, dbTeddy] = await Promise.all([
    getProducts({ category: "flowers" }),
    getProducts({ category: "hampers" }),
    getProducts({ category: "teddy" }),
  ]);

  const flowers = mergeUniqueBySlug(dbFlowers, getPredefinedProducts("flowers")).slice(0, 4);
  const hampers = mergeUniqueBySlug(dbHampers, getPredefinedProducts("hampers")).slice(0, 4);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the cut-off time for same-day delivery in Nairobi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our standard cut-off time for same-day residential and office delivery in Nairobi is 2:00 PM EAT. Orders placed after 2:00 PM are scheduled for next-day dispatch, though you can contact us on WhatsApp to check if a late rush courier is available."
        }
      },
      {
        "@type": "Question",
        "name": "How much does same-day delivery cost in Nairobi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delivery within Nairobi CBD is free! For other major areas like Westlands, Kilimani, Lavington, Kileleshwa, South B/C, and Parklands, the delivery fee ranges from KES 300 to KES 400. Outer locations like Karen, Runda, Gigiri, and Ruaka range from KES 500 to KES 700."
        }
      },
      {
        "@type": "Question",
        "name": "Can I request delivery at a specific hour?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We coordinate delivery windows (e.g. morning, afternoon, or late afternoon) rather than precise hourly drops. If you have a specific time constraint, please share it with us on WhatsApp, and we will try our best to accommodate it with our dispatch riders."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
             }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#25D366]/20 border border-[#25D366]/40 text-[#4ADE80]">
                Express Delivery Service
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
                Nairobi <span className="text-[#4ADE80]">Same-Day Delivery</span> Flowers & Hampers
              </h1>
              <p className="text-gray-300 text-sm md:text-base max-w-xl">
                Forgot a birthday or anniversary? Don&apos;t panic! Floral Whispers Gifts has you covered. Place your order before 2:00 PM EAT, and our fast-response florists and local riders will hand-deliver fresh roses, luxury gift baskets, or plush teddy bears across Nairobi today.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={`https://wa.me/254721554393?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow-lg shadow-[#25D366]/20"
                >
                  Request Same-Day Courier
                </a>
                <Link
                  href="#same-day-catalog"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-full transition-all inline-flex items-center text-sm"
                >
                  Explore Urgent Catalog
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#25D366]/20">
                <Image
                  src="/images/products/flowers/BouquetFlowers1.jpg"
                  alt="Express Same-Day Roses Delivery"
                  fill
                  className="object-cover"
                  sizes="400px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Same-day cut-off time warning alert component */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
            <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h3 className="font-heading font-bold text-amber-900 text-sm md:text-base">Same-Day Cutoff: 2:00 PM EAT</h3>
            <p className="text-xs md:text-sm text-amber-700 mt-0.5">
              Please place your order before 2 PM local Nairobi time for guaranteed same-day home or office delivery. If you are past 2 PM, send us a WhatsApp text to see if a custom late rider is available.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Showcases */}
      <section id="same-day-catalog" className="py-16 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/60 pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-[#4ADE80] uppercase">Fresh & Ready</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Same-Day Flowers & Roses</h2>
              </div>
              <Link href="/collections/flowers" className="text-sm font-semibold text-[#1E293B] hover:text-[#4ADE80] transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                Explore Flowers &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {flowers.map((p) => (
                <ProductCard
                  key={p.slug}
                  id={p.id}
                  name={p.title}
                  price={p.price}
                  image={p.images?.[0] || ""}
                  slug={p.slug}
                  shortDescription={p.short_description || ""}
                  category={p.category}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/60 pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-[#4ADE80] uppercase">Quick Dispatch</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Same-Day Gift Hampers</h2>
              </div>
              <Link href="/collections/gift-hampers" className="text-sm font-semibold text-[#1E293B] hover:text-[#4ADE80] transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                Explore Hampers &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {hampers.map((p) => (
                <ProductCard
                  key={p.slug}
                  id={p.id}
                  name={p.title}
                  price={p.price}
                  image={p.images?.[0] || ""}
                  slug={p.slug}
                  shortDescription={p.short_description || ""}
                  category={p.category}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Trust builder details */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-gray-900">Need Immediate Assistance?</h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
            Our WhatsApp customer service agents are standing by to help you choose the best express gift options. Tell us your location and occasion, and we will send you real-time recommendations, prepare the gift instantly, and dispatch a dedicated express rider.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/254721554393?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow"
            >
              Order Express Gifting Now
            </a>
            <Link
              href="/collections"
              className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Explore Gifting Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
