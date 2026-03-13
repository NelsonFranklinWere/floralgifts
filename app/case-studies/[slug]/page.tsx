import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCaseStudySlugs,
  getCaseStudyBySlug,
  getRelatedCaseStudies,
  type CaseStudy,
} from "@/lib/case-studies";
import CaseStudyCard from "@/components/CaseStudyCard";
import CaseStudyGallery from "./Gallery";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return {};

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

  return {
    title: cs.seo_title ?? `${cs.title} | Floral Whispers Nairobi`,
    description: cs.seo_description ?? undefined,
    openGraph: {
      title: cs.seo_title ?? cs.title,
      description: cs.seo_description ?? undefined,
      images: cs.hero_image_url
        ? [{ url: cs.hero_image_url, alt: cs.title }]
        : undefined,
      type: "article",
      url: `${baseUrl}/case-studies/${cs.slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/case-studies/${cs.slug}`,
    },
  };
}

function categoryBadgeClasses(category: CaseStudy["category"]) {
  switch (category) {
    case "wedding":
      return "bg-pink-50 text-rose-800";
    case "birthday":
      return "bg-orange-50 text-amber-800";
    case "event":
      return "bg-emerald-50 text-green-800";
    case "corporate":
    default:
      return "bg-slate-50 text-slate-800";
  }
}

function categoryLabel(category: CaseStudy["category"]) {
  switch (category) {
    case "wedding":
      return "Wedding";
    case "birthday":
      return "Birthday & Event";
    case "event":
      return "Event";
    case "corporate":
    default:
      return "Corporate";
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const related = await getRelatedCaseStudies(cs.category, cs.slug, 3);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

  const clientLineParts = [
    cs.client_first_name || null,
    cs.event_type || null,
    cs.location || null,
  ].filter(Boolean);

  const clientLine =
    clientLineParts.length > 0 ? clientLineParts.join(" · ") : null;

  const palette = cs.colour_palette ?? [];

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.seo_title ?? cs.title,
    description: cs.seo_description ?? "",
    image: cs.hero_image_url,
    keywords: (cs.seo_keywords ?? []).join(", "),
    author: {
      "@type": "Organization",
      name: "Floral Whispers Gifts",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Floral Whispers Gifts",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo/FloralLogo.jpg`,
      },
    },
    datePublished: cs.created_at,
    dateModified: cs.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/case-studies/${cs.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <div className="bg-white">
        {/* HERO */}
        <section className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
          {cs.hero_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cs.hero_image_url}
              alt={cs.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
              <div className="mb-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryBadgeClasses(
                    cs.category,
                  )}`}
                >
                  {categoryLabel(cs.category)}
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-3 max-w-3xl">
                {cs.title}
              </h1>
              {clientLine && (
                <p className="text-sm md:text-base text-white/80 italic">
                  {clientLine}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* OVERVIEW STRIP */}
        <section className="bg-[#FAF7F2] border-b border-[#F0E8E8] py-6 md:py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-sm">
              <div className="border-r border-[#E4D6D6] last:border-r-0 pr-4 md:pr-6">
                <div className="text-[0.7rem] tracking-[0.2em] uppercase text-gray-500 mb-1">
                  Event Type
                </div>
                <div className="text-[#2C2C2C] font-semibold">
                  {cs.event_type || "—"}
                </div>
              </div>
              <div className="border-r border-[#E4D6D6] last:border-r-0 pr-4 md:pr-6">
                <div className="text-[0.7rem] tracking-[0.2em] uppercase text-gray-500 mb-1">
                  Date
                </div>
                <div className="text-[#2C2C2C] font-semibold">
                  {cs.event_date || "—"}
                </div>
              </div>
              <div className="border-r border-[#E4D6D6] last:border-r-0 pr-4 md:pr-6">
                <div className="text-[0.7rem] tracking-[0.2em] uppercase text-gray-500 mb-1">
                  Location
                </div>
                <div className="text-[#2C2C2C] font-semibold">
                  {cs.location || "Nairobi"}
                </div>
              </div>
              {cs.guest_count && (
                <div className="pr-4 md:pr-0">
                  <div className="text-[0.7rem] tracking-[0.2em] uppercase text-gray-500 mb-1">
                    Guests
                  </div>
                  <div className="text-[#2C2C2C] font-semibold">
                    {cs.guest_count}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* THE BRIEF */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-[0.7rem] tracking-[0.25em] uppercase text-[#D4617A] mb-3">
              What They Asked For
            </div>
            {cs.brief && (
              <div className="border-l-4 border-[#D4617A] pl-4 md:pl-6 mb-6">
                <p className="font-serif italic text-2xl md:text-3xl text-[#2C2C2C] leading-relaxed">
                  {cs.brief}
                </p>
              </div>
            )}
            {cs.flowers_used && cs.flowers_used.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2 text-sm text-[#2C2C2C]">
                  <span aria-hidden="true">🌿</span>
                  <span className="font-medium">Flowers &amp; foliage used</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cs.flowers_used.map((flower) => (
                    <span
                      key={flower}
                      className="inline-flex items-center px-3 py-1 text-xs md:text-sm rounded-full bg-[#FAF7F2] border border-[#F0E8E8] text-[#2C2C2C]"
                    >
                      {flower}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* THE STORY */}
        <section className="bg-white pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 md:gap-16 items-start">
            {/* Left column */}
            <div>
              {cs.challenge && (
                <div>
                  <h2 className="font-heading text-xl md:text-2xl text-[#2C2C2C] mb-3">
                    The Challenge
                  </h2>
                  <p className="text-sm md:text-base text-[#2C2C2C] leading-relaxed whitespace-pre-line">
                    {cs.challenge}
                  </p>
                </div>
              )}
              {cs.solution && (
                <div className="mt-8">
                  <h2 className="font-heading text-xl md:text-2xl text-[#2C2C2C] mb-3">
                    How We Brought It To Life
                  </h2>
                  <p className="text-sm md:text-base text-[#2C2C2C] leading-relaxed whitespace-pre-line">
                    {cs.solution}
                  </p>
                </div>
              )}
            </div>

            {/* Right column - Floral details card */}
            <aside className="md:sticky md:top-24">
              <div className="bg-white rounded-2xl border border-[#F0E8E8] shadow-sm p-6">
                <h3 className="font-heading text-lg text-[#2C2C2C] mb-4">
                  Floral Details
                </h3>

                {palette.length > 0 && (
                  <div className="mb-5">
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      Colour Palette
                    </div>
                    <div className="flex gap-3">
                      {palette.map((colour) => (
                        <div key={`${colour.name}-${colour.hex}`} className="flex flex-col items-center gap-1">
                          <span
                            className="w-8 h-8 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: colour.hex }}
                          />
                          <span className="text-[0.65rem] text-gray-500 text-center max-w-[4rem]">
                            {colour.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cs.flowers_used && cs.flowers_used.length > 0 && (
                  <div className="mb-5">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Flowers &amp; Foliage
                    </div>
                    <div className="text-xs text-[#2C2C2C]">
                      {cs.flowers_used.join(" • ")}
                    </div>
                  </div>
                )}

                <div className="border-t border-[#F0E8E8] pt-4 mt-4 text-xs text-gray-600 space-y-1">
                  {cs.event_type && (
                    <div>
                      <span className="font-medium">Event:</span>{" "}
                      {cs.event_type}
                    </div>
                  )}
                  {cs.event_date && (
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {cs.event_date}
                    </div>
                  )}
                  {cs.location && (
                    <div>
                      <span className="font-medium">Location:</span>{" "}
                      {cs.location}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* RESULT & QUOTE */}
        <section className="bg-[#FAF7F2] py-14 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-2xl md:text-3xl text-[#2C2C2C] mb-4">
              The Result
            </h2>
            {cs.result && (
              <p className="text-sm md:text-base text-[#2C2C2C] leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                {cs.result}
              </p>
            )}

            {cs.client_quote && (
              <div className="mt-10 md:mt-12 flex justify-center">
                <div className="bg-white rounded-3xl shadow-sm px-6 md:px-10 py-8 max-w-xl">
                  <div className="text-5xl text-[#F9D5E5] leading-none mb-2">
                    “
                  </div>
                  <p className="font-serif italic text-xl md:text-2xl text-[#2C2C2C] leading-relaxed">
                    {cs.client_quote}
                  </p>
                  {cs.client_first_name && cs.event_type && (
                    <div className="mt-4 text-xs text-gray-500">
                      — {cs.client_first_name}, {cs.event_type}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* GALLERY */}
        {cs.gallery_images && cs.gallery_images.length > 0 && (
          <section className="bg-white py-12 md:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-2xl text-[#2C2C2C] text-center mb-2">
                The Photographs
              </h2>
              <p className="text-sm italic text-gray-500 text-center mb-8">
                Every detail, captured.
              </p>
              <CaseStudyGallery images={cs.gallery_images} />
            </div>
          </section>
        )}

        {/* RELATED CASE STUDIES */}
        {related.length > 0 && (
          <section className="bg-[#FAF7F2] py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-2xl md:text-3xl text-[#2C2C2C] mb-6">
                More Stories You Might Love
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {related.map((item) => (
                  <CaseStudyCard key={item.id} caseStudy={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BOTTOM CTA */}
        <section className="bg-[#D4617A] py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="font-heading text-2xl md:text-3xl mb-3">
              Let&apos;s Create Your Story
            </h2>
            <p className="text-sm md:text-base mb-6 max-w-2xl mx-auto">
              Every arrangement we design is unique — just like the moment it
              celebrates. Get in touch today.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/254721554393"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-[#D4617A] text-sm font-semibold"
              >
                Order via WhatsApp
              </a>
              <a
                href="/case-studies"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white text-white text-sm font-semibold"
              >
                See All Our Work
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

