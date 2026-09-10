"use client";

import Script from "next/script";
import { GOOGLE_BUSINESS } from "@/lib/constants";

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
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

/**
 * Live Google Business Profile reviews (Elfsight source = same Place ID as GBP).
 * Used when Places API is unavailable; feed is tied to GOOGLE_BUSINESS.placeId.
 */
export default function ElfsightGoogleReviews() {
  const appId = GOOGLE_BUSINESS.elfsightAppId;
  const reviewUrl = GOOGLE_BUSINESS.reviewUrl;

  return (
    <section
      id="google-reviews"
      dir="ltr"
      className="py-16 bg-[#FAF7F2] border-t border-[#F0E8E8]"
      style={{ direction: "ltr" }}
    >
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
        async
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#D4617A] mb-2">
            What Our Clients Say
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">
            Loved by Nairobi
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <GoogleLogo className="w-6 h-6" />
            <span className="text-sm text-[#6B7280]">Google Business reviews</span>
          </div>
        </div>

        <div
          dir="ltr"
          style={{ direction: "ltr" }}
          className={`elfsight-app-${appId}`}
          data-elfsight-app-lazy
        />

        <div className="text-center mt-10">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium px-6 py-3 rounded-full hover:shadow-md transition-all"
          >
            <GoogleLogo className="w-4 h-4" />
            Leave us a Google Review
          </a>
          <p className="text-xs text-gray-400 mt-2">
            Your review helps other Nairobi customers find us
          </p>
        </div>
      </div>
    </section>
  );
}
