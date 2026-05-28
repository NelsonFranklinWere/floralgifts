import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";
import { DELIVERY_LOCATIONS } from "@/lib/constants";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Flower Delivery Nairobi | Same-Day Fresh Roses & Bouquets Florist",
  description:
    "Order same-day flower delivery in Nairobi. Fresh pink roses, red roses, white flowers and corporate gift arrangements hand-delivered across Westlands, Karen, Kilimani and CBD.",
  alternates: { canonical: `${baseUrl}/flower-delivery-nairobi` },
  openGraph: {
    title: "Flower Delivery Nairobi | Same-Day Fresh Roses & Bouquets Florist",
    description: "Order same-day flower delivery in Nairobi. Fresh pink roses, red roses, white flowers delivered across Westlands, Karen, Kilimani.",
    url: `${baseUrl}/flower-delivery-nairobi`,
    type: "website",
    images: [{ url: "/images/products/flowers/BouquetFlowers2.jpg", width: 1200, height: 630, alt: "Flower Delivery Nairobi" }],
  },
};

function mergeUniqueBySlug<T extends { slug: string }>(db: T[], fallback: T[]) {
  const dbSlugs = new Set(db.map((p) => p.slug));
  const uniqueFallback = fallback.filter((p) => !dbSlugs.has(p.slug));
  return [...db, ...uniqueFallback];
}

export default async function FlowerDeliveryNairobiPage() {
  const whatsappText = encodeURIComponent(
    "Hello Floral Whispers Gifts, I want to order a fresh flower bouquet with same-day delivery in Nairobi."
  );

  const [dbFlowers, dbHampers] = await Promise.all([
    getProducts({ category: "flowers" }),
    getProducts({ category: "hampers" }),
  ]);

  const flowers = mergeUniqueBySlug(dbFlowers, getPredefinedProducts("flowers")).slice(0, 8);
  const hampers = mergeUniqueBySlug(dbHampers, getPredefinedProducts("hampers")).slice(0, 4);

  const landmarks = [
    { name: "Westlands", landmarks: "Sarit Centre, Westgate, Parklands", fee: "KES 300" },
    { name: "Karen & Langata", landmarks: "Junction Mall, Galleria, Bomas", fee: "KES 500-600" },
    { name: "Lavington & Kilimani", landmarks: "Lavington Mall, Yaya Centre", fee: "KES 300-400" },
    { name: "Gigiri & Runda", landmarks: "UN Offices, Village Market", fee: "KES 500" },
    { name: "Nairobi CBD", landmarks: "University Way, Delta Hotel", fee: "FREE" },
    { name: "Kilimani & Kileleshwa", landmarks: "Hurlingham, Kileleshwa", fee: "KES 300-350" },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does same-day flower delivery work in Nairobi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For same-day delivery in Nairobi CBD, Westlands, Kilimani, Lavington, Karen and surrounding areas, please place your order before 2:00 PM EAT. Orders received after the cut-off time will be scheduled for delivery early the next morning."
        }
      },
      {
        "@type": "Question",
        "name": "Can I choose specific colors of roses like pink or white?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely! We stock fresh pink roses, romantic red roses, pure white flowers, and yellow blooms daily. You can request customized color combinations when placing your order on WhatsApp."
        }
      },
      {
        "@type": "Question",
        "name": "Do you deliver to hospitals, offices, and hotels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we coordinate drops directly to all major hotels, corporate offices, and hospitals in Nairobi (such as Nairobi Hospital, Aga Khan, and MP Shah) to deliver beautiful get-well and congratulatory surprises."
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
      <section className="bg-gradient-to-br from-[#0F2F1D] via-[#091D12] to-[#040C07] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
             }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4617A]/20 border border-[#D4617A]/35 text-[#E47F95]">
                Fresh Artisan Florist
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
                Premium Same-Day <span className="text-[#E47F95]">Flower Delivery Nairobi</span>
              </h1>
              <p className="text-gray-300 text-sm md:text-base max-w-xl">
                Experience the magic of fresh luxury blooms. Hand-arranged by our expert local florists, we deliver fresh red roses, baby pink roses, pure white lilies, and elegant mixed arrangements across Nairobi with fast, reliable same-day courier service.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={`https://wa.me/254721554393?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow-lg shadow-[#25D366]/20"
                >
                  Order Fresh Flowers on WhatsApp
                </a>
                <Link
                  href="#flower-showcase"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-full transition-all inline-flex items-center text-sm"
                >
                  Browse Fresh Bouquets
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4617A]/25">
                <Image
                  src="/images/products/flowers/BouquetFlowers2.jpg"
                  alt="Vibrant Fresh Roses Bouquet"
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

      {/* Nairobi Delivery Zones / Landmarks map grid */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.2em] font-semibold text-[#D4617A] uppercase">Logistics Coverage</span>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Nairobi Delivery Landmarks</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-2">
              We cover all residential estates, shopping malls, corporate headquarters, and medical centers across Nairobi.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landmarks.map((l) => (
              <div key={l.name} className="bg-[#FAF7F2] rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-2 group hover:border-[#D4617A]/40 transition-colors">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading font-bold text-gray-900 text-sm md:text-base group-hover:text-[#D4617A] transition-colors">{l.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-600 font-mono">{l.fee}</span>
                </div>
                <p className="text-xs text-gray-500">{l.landmarks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fresh Flowers Showcase */}
      <section id="flower-showcase" className="py-16 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/60 pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] font-semibold text-[#D4617A] uppercase">Artisan Blooms</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Fresh Roses & Mixed Bouquets</h2>
              </div>
              <Link href="/collections/flowers" className="text-sm font-semibold text-[#D4617A] hover:text-[#B64D62] transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                Explore Flowers Shop &rarr;
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
                <span className="text-xs tracking-[0.2em] font-semibold text-[#D4617A] uppercase">Gifts Combined</span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-1">Flower Hampers & Wine Combos</h2>
              </div>
              <Link href="/collections/gift-hampers" className="text-sm font-semibold text-[#D4617A] hover:text-[#B64D62] transition-colors mt-2 md:mt-0 inline-flex items-center gap-1">
                View Hampers Catalog &rarr;
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

      {/* Professional Call To Action block */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-gray-900">Custom Bouquet Design</h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
            Want to build a bespoke floral arrangement or mixed rose design? Reach out to our design team directly on WhatsApp. We can help you pick colors, customize teddy sizes, select wines, and write personalized message notes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/254721554393?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow shadow-[#25D366]/20"
            >
              Consult Florist on WhatsApp
            </a>
            <Link
              href="/collections/flowers"
              className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Shop Fresh Flowers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
