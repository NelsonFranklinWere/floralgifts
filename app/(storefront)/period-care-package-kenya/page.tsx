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
  title: "Period Care Package Kenya | Comfort & Self-Care Gift Baskets Nairobi",
  description:
    "Send a thoughtful period care package in Kenya. Comfort self-care hampers in Nairobi with fresh roses, chocolate treats, and customized notes to show you care.",
  alternates: { canonical: `${baseUrl}/period-care-package-kenya` },
  openGraph: {
    title: "Period Care Package Kenya | Comfort & Self-Care Gift Baskets Nairobi",
    description: "Send a thoughtful period care package in Kenya with fresh roses, chocolate treats, and customized notes.",
    url: `${baseUrl}/period-care-package-kenya`,
    type: "website",
    images: [{ url: "/images/products/hampers/GiftAmper10.jpg", width: 1200, height: 630, alt: "Period Care Package Kenya" }],
  },
};

function mergeUniqueBySlug<T extends { slug: string }>(db: T[], fallback: T[]) {
  const dbSlugs = new Set(db.map((p) => p.slug));
  const uniqueFallback = fallback.filter((p) => !dbSlugs.has(p.slug));
  return [...db, ...uniqueFallback];
}

export default async function PeriodCarePackageKenyaPage() {
  const whatsappText = encodeURIComponent(
    "Hello Floral Whispers Gifts, I want to send a cozy period care package to someone in Nairobi."
  );

  const [dbHampers, dbChocolates] = await Promise.all([
    getProducts({ category: "hampers" }),
    getProducts({ category: "chocolates" }),
  ]);

  const hampers = mergeUniqueBySlug(dbHampers, getPredefinedProducts("hampers")).slice(0, 4);
  const chocolates = mergeUniqueBySlug(dbChocolates, getPredefinedProducts("chocolates")).slice(0, 3);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What typically goes into a period care package?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our premium care packages combine comfort and pampering: they typically include fresh roses or mixed bouquets, high-quality chocolates (like Ferrero Rocher or Cadbury), plush teddy bears, and optional self-care additions with a customized encouraging note."
        }
      },
      {
        "@type": "Question",
        "name": "Can I add a custom card message to my order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Every care package includes a complimentary, elegant greeting card. During checkout or on WhatsApp, you can share a personalized message, and our florists will hand-write it beautifully for your recipient."
        }
      },
      {
        "@type": "Question",
        "name": "Do you deliver same-day to residential estates in Nairobi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we deliver same-day across Nairobi residential areas (including Westlands, Kilimani, Lavington, Karen, South B/C, and CBD) for orders placed before 2 PM EAT."
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
      <section className="bg-gradient-to-br from-[#FFF0F2] via-[#FFE3E7] to-[#FCD5DC] text-gray-800 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212,97,122,0.05) 10px, rgba(212,97,122,0.05) 20px)`,
             }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4617A]/15 border border-[#D4617A]/35 text-[#D4617A]">
                Comfort & Support Gifting
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-[#2C2C2C] leading-tight">
                Send a Thoughtful <span className="text-[#D4617A]">Period Care Package</span>
              </h1>
              <p className="text-gray-600 text-sm md:text-base max-w-xl">
                Show your support, warmth, and care with premium self-care hampers in Kenya. Beautiful combinations of soothing fresh flowers, indulgence chocolates, cuddly teddy bears, and elegant customized notes designed to brighten up their week.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={`https://wa.me/254721554393?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow-lg shadow-[#25D366]/10"
                >
                  Order Care Pack on WhatsApp
                </a>
                <Link
                  href="#comfort-grid"
                  className="bg-white border border-[#D4617A]/25 text-[#D4617A] hover:bg-[#D4617A]/5 font-semibold px-6 py-3 rounded-full transition-all inline-flex items-center text-sm"
                >
                  View Comfort Bundles
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="/images/products/hampers/GiftAmper10.jpg"
                  alt="Cozy Comfort Care Package"
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

      {/* Empathy Quote block */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-heading italic text-lg md:text-xl text-[#2C2C2C] leading-relaxed">
            &ldquo;Sometimes a little comfort, a fresh bouquet of roses, and a sweet chocolate treat is all it takes to remind them that they are loved and supported.&rdquo;
          </p>
          <div className="mt-4 text-xs font-semibold tracking-wider text-[#D4617A] uppercase">
            — Floral Whispers Care Specialists
          </div>
        </div>
      </section>

      {/* Comfort Grid */}
      <section id="comfort-grid" className="py-16 bg-[#FFF9FA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F5E1E4] pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-[#D4617A] uppercase">Warm & Soothing Baskets</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#2C2C2C] mt-1">Cozy Self-Care Hampers</h2>
              </div>
              <Link href="/collections/gift-hampers" className="text-sm font-semibold text-[#D4617A] hover:text-[#B64D62] transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                Browse Full Catalog &rarr;
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

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F5E1E4] pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-[#D4617A] uppercase">Cravings Sorted</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#2C2C2C] mt-1">Chocolates & Sweet Comfort</h2>
              </div>
              <Link href="/collections/chocolates" className="text-sm font-semibold text-[#D4617A] hover:text-[#B64D62] transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                Add More Treats &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {chocolates.map((p) => (
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

      {/* Heartfelt Quote builder step */}
      <section className="py-16 bg-white border-t border-[#F5E1E4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-[#2C2C2C]">Build Your Support Gift</h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
            Contact us on WhatsApp to custom-blend a care package. Pick their favorite flowers, choose Cadbury or Ferrero Rocher selections, choose a plush teddy bear size, and add a customized note. We make residential surprise drops simple and comforting.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/254721554393?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow shadow-[#25D366]/20"
            >
              Start Gifting on WhatsApp
            </a>
            <Link
              href="/collections"
              className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Explore Full Gifting Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
