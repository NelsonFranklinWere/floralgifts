import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Nairobi Flower Hamper + Wine Same-Day Delivery | Floral Whispers Gifts",
  description:
    "Order flower hamper and wine gifts in Nairobi with same-day delivery. Premium roses, chocolates, wine and teddy bundles for birthdays, anniversaries and romantic surprises.",
  alternates: {
    canonical: `${baseUrl}/flower-hamper-wine-nairobi`,
  },
  openGraph: {
    title: "Nairobi Flower Hamper + Wine Same-Day Delivery",
    description:
      "Premium flower hamper + wine gifts delivered same day in Nairobi CBD, Westlands, Karen, Kilimani and Lavington.",
    url: `${baseUrl}/flower-hamper-wine-nairobi`,
    type: "website",
    images: [
      {
        url: "/images/products/hampers/giftamper.jpg",
        width: 1200,
        height: 630,
        alt: "Flower hamper and wine same-day delivery Nairobi",
      },
    ],
  },
};

function mergeUniqueBySlug<T extends { slug: string }>(db: T[], fallback: T[]) {
  const dbSlugs = new Set(db.map((p) => p.slug));
  const uniqueFallback = fallback.filter((p) => !dbSlugs.has(p.slug));
  return [...db, ...uniqueFallback];
}

export default async function FlowerHamperWineNairobiPage() {
  const whatsappText = encodeURIComponent(
    "Hello Floral Whispers Gifts, I want to order a flower hamper + wine gift with same-day delivery in Nairobi."
  );
  const [dbHampers, dbWines, dbFlowers] = await Promise.all([
    getProducts({ category: "hampers" }),
    getProducts({ category: "wines" }),
    getProducts({ category: "flowers" }),
  ]);

  const hampers = mergeUniqueBySlug(dbHampers, getPredefinedProducts("hampers")).slice(0, 8);
  const wines = mergeUniqueBySlug(dbWines, getPredefinedProducts("wines")).slice(0, 6);
  const flowers = mergeUniqueBySlug(dbFlowers, getPredefinedProducts("flowers")).slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#D4617A] mb-2">
            Same-Day Delivery Nairobi
          </p>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#2C2C2C] mb-4">
            Flower Hamper + Wine Gifts in Nairobi
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
            Looking for a Nairobi flower hamper with wine for birthdays, anniversaries,
            congratulations or romantic surprises? Floral Whispers Gifts delivers curated
            hampers with fresh flowers, premium wine, chocolates and teddy bears across
            Nairobi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-white border border-gray-200 p-4">
            <h2 className="font-heading text-lg text-[#2C2C2C] mb-2">What's included</h2>
            <p className="text-sm text-gray-600">
              Fresh flower arrangements, selected wine options, premium chocolates and gift
              add-ons.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-4">
            <h2 className="font-heading text-lg text-[#2C2C2C] mb-2">Delivery zones</h2>
            <p className="text-sm text-gray-600">
              Nairobi CBD, Westlands, Karen, Kilimani, Kileleshwa, Lavington and nearby
              areas.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-4">
            <h2 className="font-heading text-lg text-[#2C2C2C] mb-2">How to order</h2>
            <p className="text-sm text-gray-600">
              Choose your hamper, confirm delivery details on WhatsApp, then pay with
              M-Pesa.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link
            href={`/collections/gift-hampers`}
            className="inline-flex items-center rounded-full bg-[#D4617A] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Shop Gift Hampers
          </Link>
          <Link
            href={`/collections/wines`}
            className="inline-flex items-center rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-6 py-3 hover:shadow-md transition-all"
          >
            Pair with Wine
          </Link>
          <Link
            href={`https://wa.me/254721554393?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-[#25D366] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Order on WhatsApp
          </Link>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-heading text-2xl md:text-3xl text-[#2C2C2C]">
                Gift Hampers
              </h2>
              <Link href="/collections/gift-hampers" className="text-sm font-medium text-[#D4617A] hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
          </section>

          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-heading text-2xl md:text-3xl text-[#2C2C2C]">
                Wines to Pair
              </h2>
              <Link href="/collections/wines" className="text-sm font-medium text-[#D4617A] hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {wines.map((p, idx) => (
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
          </section>

          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-heading text-2xl md:text-3xl text-[#2C2C2C]">
                Add Fresh Flowers
              </h2>
              <Link href="/collections/flowers" className="text-sm font-medium text-[#D4617A] hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {flowers.map((p, idx) => (
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
          </section>
        </div>
      </div>
    </section>
  );
}
