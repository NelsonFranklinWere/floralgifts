import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";
import { SHOP_INFO } from "@/lib/constants";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Corporate Gift Hampers Nairobi | Premium Bulk Business Gifting",
  description:
    "Order luxury corporate gift hampers in Nairobi. Custom branded business gift baskets, team appreciation rewards, and holiday hampers with reliable same-day delivery.",
  alternates: { canonical: `${baseUrl}/corporate-gift-hampers-nairobi` },
  openGraph: {
    title: "Corporate Gift Hampers Nairobi | Premium Bulk Business Gifting",
    description: "Order luxury corporate gift hampers in Nairobi. Custom branded business gift baskets.",
    url: `${baseUrl}/corporate-gift-hampers-nairobi`,
    type: "website",
    images: [{ url: "/images/products/hampers/GiftAmper6.jpg", width: 1200, height: 630, alt: "Corporate Gift Hampers Nairobi" }],
  },
};

function mergeUniqueBySlug<T extends { slug: string }>(db: T[], fallback: T[]) {
  const dbSlugs = new Set(db.map((p) => p.slug));
  const uniqueFallback = fallback.filter((p) => !dbSlugs.has(p.slug));
  return [...db, ...uniqueFallback];
}

export default async function CorporateGiftHampersPage() {
  const whatsappText = encodeURIComponent(
    "Hello Floral Whispers Gifts, I want to request a quotation for custom bulk corporate gift hampers in Nairobi."
  );

  const [dbHampers, dbWines] = await Promise.all([
    getProducts({ category: "hampers" }),
    getProducts({ category: "wines" }),
  ]);

  const hampers = mergeUniqueBySlug(dbHampers, getPredefinedProducts("hampers")).slice(0, 8);
  const wines = mergeUniqueBySlug(dbWines, getPredefinedProducts("wines")).slice(0, 4);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you support custom company branding on hampers in Nairobi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely! We offer branded gift tags, customized corporate cards with your company logo, and color-coordinated ribbons that match your brand identity for bulk orders of 5 or more hampers."
        }
      },
      {
        "@type": "Question",
        "name": "What is the lead time for bulk corporate hamper orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For orders of 5-20 hampers, we can often arrange same-day or next-day delivery. For larger orders exceeding 20 hampers, we require a lead time of 2-3 business days to ensure premium item curation and custom card printing."
        }
      },
      {
        "@type": "Question",
        "name": "How do we pay for corporate orders and get invoices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept payments via M-Pesa (Paybill / Till Number), Direct Bank Transfers, and Credit/Debit Cards. We issue official KRA compliant electronic tax invoices for all corporate orders."
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
      <section className="bg-gradient-to-br from-[#0B3B24] via-[#062616] to-[#0A301C] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
             }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37]">
                Premium Gifting Solutions
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
                Elevate Your Business with <span className="text-[#D4AF37]">Corporate Gift Hampers</span>
              </h1>
              <p className="text-gray-300 text-sm md:text-base max-w-xl">
                Nairobi's premium corporate florist. We handcraft bespoke gift hampers, fresh flowers, and premium wine pairings designed to build strong relationships with clients, employees, and executive partners.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={`https://wa.me/254721554393?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow-lg shadow-[#25D366]/20"
                >
                  Request Bulk Quote on WhatsApp
                </a>
                <Link
                  href="#catalog"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-full transition-all inline-flex items-center text-sm"
                >
                  Explore Showcase
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/20">
                <Image
                  src="/images/products/hampers/GiftAmper6.jpg"
                  alt="Premium Corporate Hamper Basket"
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

      {/* Trust factors */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0B3B24]/5 flex items-center justify-center text-[#0B3B24] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-900 text-sm md:text-base">Compliant Corporate Billing</h3>
                <p className="text-xs text-gray-500 mt-1">We provide electronic KRA compliant tax invoices (eTIMS ready) for clean company expense accounting.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0B3B24]/5 flex items-center justify-center text-[#0B3B24] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-900 text-sm md:text-base">Custom Brand Packaging</h3>
                <p className="text-xs text-gray-500 mt-1">Include company logos, bespoke branded greetings cards, and ribbons tailored to your color theme.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0B3B24]/5 flex items-center justify-center text-[#0B3B24] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-900 text-sm md:text-base">Coordinated Office Drops</h3>
                <p className="text-xs text-gray-500 mt-1">Multi-location delivery throughout Nairobi CBD, Kilimani, Westlands, Gigiri and Lavington with precise schedules.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Showcases */}
      <section id="catalog" className="py-16 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/60 pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-[#D4AF37] uppercase">Premium Curation</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Gift Hampers</h2>
              </div>
              <Link href="/collections/gift-hampers" className="text-sm font-semibold text-[#0B3B24] hover:text-[#D4AF37] transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                View Gifting Collection &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {hampers.map((p, idx) => (
                <ProductCard
                  key={p.slug}
                  id={p.id}
                  name={p.title}
                  price={p.price}
                  image={p.images?.[0] || ""}
                  slug={p.slug}
                  shortDescription={p.short_description || ""}
                  category={p.category}
                  priority={idx < 2}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/60 pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-[#D4AF37] uppercase">Partner Celebrations</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Premium Wines to Pair</h2>
              </div>
              <Link href="/collections/wines" className="text-sm font-semibold text-[#0B3B24] hover:text-[#D4AF37] transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                View Wine Cellar &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {wines.map((p) => (
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

      {/* Corporate Quotation Request Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-gray-900">Custom Corporate Hampers</h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
            Need something tailored? Let us design custom executive baskets matching your specific theme, budgets, and branding specifications. Get in touch with our design team.
          </p>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-white border border-gray-200/80 inline-block text-left w-full shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="font-heading font-semibold text-lg text-gray-900">How It Works</h3>
                <ol className="mt-4 space-y-3 text-sm text-gray-600 list-decimal pl-5">
                  <li><strong>Submit Request</strong>: Send us your quantity and budget parameters.</li>
                  <li><strong>Proposal</strong>: We send 3 curated proposal options with layouts.</li>
                  <li><strong>Branding</strong>: Add logo tags, cards, and ribbon color matching.</li>
                  <li><strong>Delivery</strong>: Coordinated logistics across multiple sites.</li>
                </ol>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/254721554393?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-semibold text-center py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.736.001-2.599-1.01-5.048-2.846-6.886C16.606 2.145 14.166 1.135 11.997 1.135c-5.444 0-9.866 4.372-9.87 9.738 0 1.764.483 3.483 1.398 5.017l-.998 3.64 3.732-.977c1.518.825 3.033 1.258 4.388 1.258zm9.96-7.417c-.295-.148-1.745-.862-2.015-.96-.27-.098-.465-.148-.66.148-.195.297-.757.96-.927 1.157-.17.196-.34.22-.635.074-.295-.148-1.246-.459-2.375-1.464-.877-.782-1.47-1.747-1.642-2.043-.172-.296-.018-.456.13-.603.133-.133.295-.346.444-.518.149-.17.197-.295.295-.492.1-.197.05-.37-.025-.518-.075-.148-.66-1.59-.905-2.18-.24-.576-.48-.497-.66-.507-.17-.007-.365-.007-.56-.007-.195 0-.51.073-.78.37-.27.296-1.02.997-1.02 2.429 0 1.43 1.04 2.81 1.185 3.007.145.195 2.05 3.125 4.96 4.38.69.298 1.23.476 1.65.61.69.22 1.32.19 1.82.115.55-.083 1.74-.71 1.99-1.398.25-.688.25-1.28.175-1.398-.075-.118-.27-.197-.565-.346z"/></svg>
                  Contact Design Specialist
                </a>
                <a
                  href={`mailto:${SHOP_INFO.email}?subject=Corporate Hamper Request`}
                  className="bg-transparent border border-[#0B3B24] text-[#0B3B24] text-center font-semibold py-3 rounded-xl hover:bg-[#0B3B24]/5 transition-all text-sm"
                >
                  Send Email Request
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
