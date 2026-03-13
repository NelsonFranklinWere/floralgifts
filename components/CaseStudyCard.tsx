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
  wedding: "bg-pink-50 text-rose-800",
  birthday: "bg-orange-50 text-amber-800",
  event: "bg-emerald-50 text-green-800",
  corporate: "bg-slate-50 text-slate-800",
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
      className="group block rounded-2xl overflow-hidden bg-white border border-[#F0E8E8] shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {hero_image_url && (
          <Image
            src={hero_image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
        <div
          className={`absolute top-3 left-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm ${categoryBadgeClasses[category]}`}
        >
          {categoryLabel[category]}
        </div>
      </div>

      <div className="bg-white px-5 py-4 rounded-b-2xl">
        <h3 className="font-heading text-lg font-semibold text-[#2C2C2C] mb-1 line-clamp-2">
          {title}
        </h3>
        {clientLine && (
          <p className="text-xs text-gray-500 italic mb-3">
            {clientLine}
          </p>
        )}

        {palette.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-2 mb-1">
              {palette.slice(0, 5).map((colour) => (
                <span
                  key={`${colour.name}-${colour.hex}`}
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: colour.hex }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}

        <span className="inline-flex items-center text-sm font-medium text-[#D4617A] group-hover:underline">
          Read the story
          <span className="ml-1 group-hover:translate-x-0.5 transition-transform duration-150">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

