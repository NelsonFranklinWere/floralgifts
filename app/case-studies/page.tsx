import { Metadata } from "next";
import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";
import CaseStudyCard from "@/components/CaseStudyCard";

export const metadata: Metadata = {
  title: "Our Work — Floral Case Studies | Floral Whispers Nairobi",
  description:
    "Real wedding, birthday, event and corporate flower designs by Floral Whispers — Nairobi's premium florist. Every arrangement is a story.",
  alternates: {
    canonical: "https://floralwhispersgifts.co.ke/case-studies",
  },
};

const CATEGORY_FILTERS = [
  { key: "all", label: "All" },
  { key: "wedding", label: "Weddings" },
  { key: "birthday", label: "Birthdays & Events" },
  { key: "corporate", label: "Corporate" },
  { key: "event", label: "Events" },
] as const;

type CategoryKey = (typeof CATEGORY_FILTERS)[number]["key"];

type PageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function CaseStudiesPage({
  searchParams,
}: PageProps) {
  const resolved = (await searchParams) ?? {};
  const categoryParam = (resolved.category ?? "all") as CategoryKey;
  const currentCategory =
    CATEGORY_FILTERS.find((c) => c.key === categoryParam)?.key ?? "all";

  const caseStudies = await getAllCaseStudies(
    currentCategory === "all" ? undefined : currentCategory,
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#D4617A] mb-3">
              Our Work
            </p>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#2C2C2C] mb-4">
              Real flowers. Real stories. Real Nairobi.
            </h1>
            <p className="text-sm md:text-base text-[#2C2C2C] leading-relaxed max-w-xl">
              Floral Whispers Gifts is a florist in Nairobi creating custom
              wedding flowers, birthday florals, event installations and
              corporate office designs. Every story you see here began with a
              brief and ended with same-day flower delivery Nairobi clients
              could feel the moment they walked into the room.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative w-full max-w-md ml-auto">
              <div className="absolute -inset-6 bg-[#F9D5E5] opacity-60 rounded-3xl -z-10" />
              <div className="overflow-hidden rounded-3xl border border-[#F0E8E8] shadow-md">
                <div className="aspect-[4/5] bg-[#FAF7F2]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-t border-[#F0E8E8] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = currentCategory === cat.key;
            const href =
              cat.key === "all"
                ? "/case-studies"
                : `/case-studies?category=${encodeURIComponent(cat.key)}`;
            return (
              <Link
                key={cat.key}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  isActive
                    ? "bg-[#D4617A] text-white border-[#D4617A]"
                    : "bg-white text-[#D4617A] border-[#D4617A] hover:bg-[#F9D5E5]"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[#FAF7F2] py-10 md:py-14 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {caseStudies.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm md:text-base text-[#2C2C2C]">
                More{" "}
                {
                  CATEGORY_FILTERS.find((c) => c.key === currentCategory)
                    ?.label
                }{" "}
                stories coming soon — follow us on Instagram{" "}
                <span className="font-semibold">@floralwhispersgifts</span> for
                a preview.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {caseStudies.map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#D4617A] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-3">
            Ready to create your story?
          </h2>
          <p className="text-sm md:text-base mb-6 max-w-2xl mx-auto">
            Tell us your vision — we&apos;ll design something unforgettable for
            your special day in Nairobi.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="https://wa.me/254721554393"
              target="_blank"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-[#D4617A] text-sm font-semibold"
            >
              Order via WhatsApp
            </Link>
            <Link
              href="/collections/flowers"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white text-white text-sm font-semibold"
            >
              View Our Arrangements
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

