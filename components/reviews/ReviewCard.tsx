"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews";

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
  const [expanded, setExpanded] = useState(false);

  const maxLength = 180;
  const isLong = review.review_text.length > maxLength;
  const shownText =
    !isLong || expanded
      ? review.review_text
      : review.review_text.slice(0, maxLength) + "…";

  const toggle = () => {
    if (!isLong) return;
    setExpanded((prev) => !prev);
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);

  return (
    <article className="w-[320px] flex-shrink-0 bg-white rounded-2xl p-5 border border-[#F0E8E8] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-col gap-3">
      {/* Row 1: identity */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold text-[#2C2C2C]"
          style={{ backgroundColor: review.avatar_colour }}
        >
          {review.avatar_initials}
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-[#2C2C2C]">
            {review.reviewer_name}
          </div>
          <div className="text-[12px] text-[#9CA3AF]">{review.review_date}</div>
        </div>
        {/* Google G logo */}
        <GoogleLogo className="w-5 h-5 ml-auto" />
      </div>

      {/* Row 2: stars */}
      <div className="flex items-center gap-1">
        {stars.map((filled, idx) => (
          <svg
            key={idx}
            className="w-4 h-4"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.95 2.675c-.784.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.063 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"
              fill={filled ? "#FBBF24" : "#E5E7EB"}
            />
          </svg>
        ))}
      </div>

      {/* Row 3: text */}
      <div className="text-[14px] leading-relaxed text-[#374151]">
        <p className="transition-[max-height] duration-300 ease-in-out">
          {shownText}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={toggle}
            className="mt-1 text-sm text-[#D4617A] font-medium"
          >
            {expanded ? "Less" : "More"}
          </button>
        )}
      </div>

      {/* Row 4: verified badge */}
      <div className="mt-1 flex items-center gap-1 text-[11px] text-[#6B7280]">
        <svg
          className="w-3 h-3 text-green-500"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M10 18a1 1 0 01-.514-.143l-6-3.5A1 1 0 013 13.5v-7a1 1 0 01.514-.857l6-3.5a1 1 0 01.972 0l6 3.5A1 1 0 0117 6.5v7a1 1 0 01-.514.857l-6 3.5A1 1 0 0110 18zm-2.293-7.707a1 1 0 101.414 1.414L10 10.828l2.879 2.879a1 1 0 001.414-1.414l-3.586-3.586a1 1 0 00-1.414 0L7.707 10.293z"
          />
        </svg>
        <span>Google Review</span>
      </div>
    </article>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6 1.54 7.38 2.84l5.4-5.4C33.89 4.1 29.47 2 24 2 14.82 2 7.16 7.84 4.24 16.1l6.86 5.32C12.68 14.64 17.8 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.15 24.5c0-1.6-.15-3.13-.43-4.5H24v9.02h12.4c-.54 2.9-2.18 5.36-4.66 7.02l7.33 5.69C42.77 38.9 46.15 32.4 46.15 24.5z"
      />
      <path
        fill="#4A90E2"
        d="M11.1 28.58A14.5 14.5 0 0 1 10.5 24c0-1.58.27-3.12.75-4.55l-6.86-5.32A22.41 22.41 0 0 0 2 24c0 3.64.87 7.07 2.39 10.1l6.71-5.52z"
      />
      <path
        fill="#FBBC05"
        d="M24 46c5.47 0 10.08-1.8 13.44-4.88l-7.33-5.69C28.1 36.46 26.21 37 24 37c-6.2 0-11.32-5.14-11.9-11.58l-6.86 5.32C7.16 40.16 14.82 46 24 46z"
      />
      <path fill="none" d="M2 2h44v44H2z" />
    </svg>
  );
}

