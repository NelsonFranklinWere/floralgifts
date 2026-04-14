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
    <div className="min-h-screen bg-gradient-to-br from-brand-green/5 via-white to-brand-red/5">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green/10 via-white to-brand-red/10">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green/20 via-transparent to-brand-red/20 opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center bg-gradient-to-r from-brand-green to-brand-red text-white text-xs tracking-[0.25em] uppercase px-4 py-2 rounded-full mb-4 shadow-lg">
              <span className="mr-2">✨</span>
              Our Work
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-brand-green to-brand-red bg-clip-text text-transparent mb-6 font-bold">
              Real flowers. Real stories. Real Nairobi.
            </h1>
            <p className="text-sm md:text-base text-brand-gray-700 leading-relaxed max-w-xl bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-brand-gray-200">
              Floral Whispers Gifts is a florist in Nairobi creating custom
              wedding flowers, birthday florals, event installations and
              corporate office designs. Every story you see here began with a
              brief and ended with same-day flower delivery Nairobi clients
              could feel the moment they walked into the room.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative w-full max-w-md ml-auto">
              <div className="absolute -inset-6 bg-gradient-to-br from-brand-green/30 to-brand-red/30 opacity-60 rounded-3xl -z-10 blur-xl" />
              <div className="overflow-hidden rounded-3xl border-2 border-white shadow-2xl bg-white/80 backdrop-blur-sm">
                <div className="aspect-[4/5] bg-gradient-to-br from-brand-green/20 to-brand-red/20 flex items-center justify-center">
                  <div className="text-6xl">🌸</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-t border-brand-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap gap-3">
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
                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 transform hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-brand-green to-brand-red text-white border-transparent shadow-lg"
                    : "bg-white text-brand-gray-700 border-brand-gray-300 hover:border-brand-red hover:bg-brand-red/50 hover:text-white"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-gradient-to-br from-brand-green/5 via-white to-brand-red/5 py-10 md:py-14 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {caseStudies.length === 0 ? (
            <div className="py-16 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-brand-gray-200 shadow-lg">
                <div className="text-4xl mb-4">📸</div>
                <p className="text-sm md:text-base text-brand-gray-700 mb-4">
                  More{" "}
                  {
                    CATEGORY_FILTERS.find((c) => c.key === currentCategory)
                      ?.label
                  }{" "}
                  stories coming soon
                </p>
                <p className="text-sm text-brand-gray-600">
                  Follow us on Instagram{" "}
                  <a
                    href="https://instagram.com/floralwhispersgifts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-red hover:underline"
                  >
                    @floralwhispersgifts
                  </a>{" "}
                  for a preview.
                </p>
              </div>
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
      <section className="bg-gradient-to-r from-brand-green via-brand-red to-brand-red py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-2xl">💝</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-4 font-bold">
            Ready to create your story?
          </h2>
          <p className="text-sm md:text-base mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed">
            Tell us your vision — we&apos;ll design something unforgettable for
            your special day in Nairobi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://wa.me/254721554393"
              target="_blank"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-brand-red text-sm font-semibold hover:bg-brand-green hover:text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <span className="mr-2">💬</span>
              Order via WhatsApp
            </Link>
            <Link
              href="/collections/flowers"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-white text-white text-sm font-semibold hover:bg-white hover:text-brand-red transition-all duration-200 transform hover:scale-105"
            >
              <span className="mr-2">🌸</span>
              View Our Arrangements
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

