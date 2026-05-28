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
  title: "Send Gifts to Kenya from Abroad | Diaspora Gift & Flower Delivery",
  description:
    "Send flowers and gift hampers to Kenya from the US, UK, Canada, Europe, or Australia. High-end bouquets, wine, and teddy surprises with secure payments and same-day Nairobi delivery.",
  alternates: { canonical: `${baseUrl}/send-gifts-to-kenya` },
  openGraph: {
    title: "Send Gifts to Kenya from Abroad | Diaspora Gift & Flower Delivery",
    description: "Send flowers and gift hampers to Kenya from the US, UK, Canada, Europe, or Australia. Secure payments, same-day delivery.",
    url: `${baseUrl}/send-gifts-to-kenya`,
    type: "website",
    images: [{ url: "/images/products/hampers/GiftAmper1.jpg", width: 1200, height: 630, alt: "Send Gifts to Kenya from Abroad" }],
  },
};

function mergeUniqueBySlug<T extends { slug: string }>(db: T[], fallback: T[]) {
  const dbSlugs = new Set(db.map((p) => p.slug));
  const uniqueFallback = fallback.filter((p) => !dbSlugs.has(p.slug));
  return [...db, ...uniqueFallback];
}

export default async function SendGiftsToKenyaPage() {
  const whatsappText = encodeURIComponent(
    "Hello Floral Whispers Gifts, I am currently living abroad and I want to send a premium gift surprise to someone in Nairobi."
  );

  const [dbHampers, dbFlowers, dbTeddy] = await Promise.all([
    getProducts({ category: "hampers" }),
    getProducts({ category: "flowers" }),
    getProducts({ category: "teddy" }),
  ]);

  const hampers = mergeUniqueBySlug(dbHampers, getPredefinedProducts("hampers")).slice(0, 4);
  const flowers = mergeUniqueBySlug(dbFlowers, getPredefinedProducts("flowers")).slice(0, 4);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I pay for gift delivery in Kenya from the US, UK, or Europe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer multiple secure payment options for international buyers: you can pay via credit/debit cards (Visa, Mastercard, American Express, Discover), Send M-Pesa using remittance services (like Remitly, WorldRemit, Sendwave), or directly through our secure online Pesapal card payment checkout."
        }
      },
      {
        "@type": "Question",
        "name": "Do you send photos of the flowers before delivery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely! Since you are far away, we keep you fully connected. Our WhatsApp team will send you photos of the fresh flowers and curated hampers for your approval before dispatching our dispatch rider."
        }
      },
      {
        "@type": "Question",
        "name": "How do you coordinate delivery with recipients in Nairobi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We handle logistics carefully to preserve the surprise. We reach out to the recipient to confirm their availability and precise location details. We coordinate closely to deliver at their convenience, ensuring a smooth surprise moment."
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
      <section className="bg-gradient-to-br from-[#1E1B4B] via-[#0F0E36] to-[#0A0923] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
             }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/20 border border-[#D4AF37]/45 text-[#D4AF37]">
                Global Gifting Trust
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
                Send Premium Gifts to <span className="text-[#D4AF37]">Kenya from Abroad</span>
              </h1>
              <p className="text-gray-300 text-sm md:text-base max-w-xl">
                Bridge the distance and delight your loved ones in Nairobi. We specialize in diaspora flower delivery and luxury gift hamper surprises. Pay securely from the USA, UK, Canada, Australia, or Europe, and watch their face light up when our riders hand-deliver your love.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={`https://wa.me/254721554393?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow-lg shadow-[#25D366]/20"
                >
                  Order via WhatsApp Support
                </a>
                <Link
                  href="#diaspora-bestsellers"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-full transition-all inline-flex items-center text-sm"
                >
                  Explore Top Gifts Sent
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/20">
                <Image
                  src="/images/products/hampers/GiftAmper1.jpg"
                  alt="Premium Luxury Hamper Basket"
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

      {/* Trust factors - Diaspora Specific */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900 text-center mb-8">
            Why Thousands of Diaspora Buyers Trust Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1E1B4B]/5 flex items-center justify-center text-[#1E1B4B] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-900 text-sm md:text-base">Secure Global Checkout</h3>
                <p className="text-xs text-gray-500 mt-1">Accept Visa, Mastercard, AMEX, Discover, and local remittance services. Pay easily in USD, GBP, CAD, or AUD.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1E1B4B]/5 flex items-center justify-center text-[#1E1B4B] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-900 text-sm md:text-base">WhatsApp Photo Proof</h3>
                <p className="text-xs text-gray-500 mt-1">We send you live photos of your beautiful flowers and gift hampers from our workshop before they are dispatched.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1E1B4B]/5 flex items-center justify-center text-[#1E1B4B] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-900 text-sm md:text-base">Intelligent Surprise Delivery</h3>
                <p className="text-xs text-gray-500 mt-1">We call the recipient to coordinate the delivery location and time discreetly to preserve the surprise element.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step ordering roadmap */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-xl md:text-2xl text-center text-gray-900 mb-8">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3 relative">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-indigo-500/10">01</div>
              <h3 className="font-heading font-bold text-gray-900 text-sm md:text-base">Step 1: Choose Gift</h3>
              <p className="text-xs md:text-sm text-gray-600">Select standard luxury hampers, roses, or soft teddy bear packages, or let our florists craft a custom bundle.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3 relative">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-indigo-500/10">02</div>
              <h3 className="font-heading font-bold text-gray-900 text-sm md:text-base">Step 2: Share Details</h3>
              <p className="text-xs md:text-sm text-gray-600">Provide the recipient&apos;s name, phone, and estate location in Nairobi. Add your heartfelt message for the card.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3 relative">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-indigo-500/10">03</div>
              <h3 className="font-heading font-bold text-gray-900 text-sm md:text-base">Step 3: Secure Delivery</h3>
              <p className="text-xs md:text-sm text-gray-600">Complete payment securely using Credit Card or remittance. We verify, arrange, take photos, and deliver.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Showcases */}
      <section id="diaspora-bestsellers" className="py-16 bg-[#F9FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/60 pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-indigo-600 uppercase">Top Sent Hampers</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Luxury Gift Hampers</h2>
              </div>
              <Link href="/collections/gift-hampers" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                Explore Full Hampers Collection &rarr;
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
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/60 pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-indigo-600 uppercase">Fresh Roses & Bouquets</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Romantic Flower Delivery</h2>
              </div>
              <Link href="/collections/flowers" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                Browse Fresh Flowers &rarr;
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

        </div>
      </section>

      {/* Heartfelt diaspora section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-gray-900">Ordering is Fast & 100% Secure</h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
            Our checkout platform supports secure online transactions. If you prefer personal assistance or need custom packages, simply text us on WhatsApp. We have a dedicated support agent online during European and North American daytime hours to help you coordinate your surprise.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/254721554393?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow"
            >
              Order on WhatsApp Now
            </a>
            <Link
              href="/collections"
              className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Explore Gifting Catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
