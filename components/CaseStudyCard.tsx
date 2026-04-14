"use client";

import Link from "next/link";
import Image from "next/image";
import type { CaseStudy, CaseStudyColour } from "@/lib/case-studies";

type Props = {
  caseStudy: CaseStudy;
};

const categoryLabel: Record<CaseStudy["category"], string> = {
  wedding: "Wedding",
  birthday: "Birthday & Event",
  event: "Event",
  corporate: "Corporate",
};

const categoryBadgeClasses: Record<CaseStudy["category"], string> = {
  wedding: "bg-gradient-to-r from-pink-100 to-rose-100 text-rose-800 border border-rose-200",
  birthday: "bg-gradient-to-r from-orange-100 to-amber-100 text-amber-800 border border-amber-200",
  event: "bg-gradient-to-r from-emerald-100 to-green-100 text-green-800 border border-green-200",
  corporate: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200",
};

export default function CaseStudyCard({ caseStudy }: Props) {
  const {
    slug,
    title,
    hero_image_url,
    category,
    client_first_name,
    event_type,
    location,
    colour_palette,
  } = caseStudy;

  const palette = (colour_palette ?? []) as CaseStudyColour[];

  const clientLineParts = [
    client_first_name ? `${client_first_name}'s` : null,
    event_type || null,
    location || null,
  ].filter(Boolean);

  const clientLine =
    clientLineParts.length > 0 ? clientLineParts.join(" · ") : null;

  return (
    <Link
      href={`/case-studies/${slug}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-brand-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {hero_image_url && (
          <Image
            src={hero_image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
        <div
          className={`absolute top-3 left-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm ${categoryBadgeClasses[category]}`}
        >
          {categoryLabel[category]}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-brand-gray-50 px-5 py-4 rounded-b-2xl border-t border-brand-gray-100">
        <h3 className="font-heading text-lg font-bold bg-gradient-to-r from-brand-gray-900 to-brand-gray-700 bg-clip-text text-transparent mb-2 line-clamp-2">
          {title}
        </h3>
        {clientLine && (
          <p className="text-xs text-brand-gray-600 italic mb-4 bg-brand-gray-100/50 px-3 py-2 rounded-lg">
            {clientLine}
          </p>
        )}

        {palette.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-brand-gray-500 mb-2 font-medium">Color Palette</p>
            <div className="flex gap-2">
              {palette.slice(0, 5).map((colour) => (
                <span
                  key={`${colour.name}-${colour.hex}`}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: colour.hex }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}

        <span className="inline-flex items-center text-sm font-bold bg-gradient-to-r from-brand-red to-brand-green bg-clip-text text-transparent group-hover:underline decoration-2 underline-offset-2">
          Read the story
          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200 text-lg">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

