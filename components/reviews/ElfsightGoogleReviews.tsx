"use client";

import Script from "next/script";

const ELFSIGHT_APP_ID = "a2f24b95-404d-4f9b-b799-879cc5699bbb";

export default function ElfsightGoogleReviews() {
  return (
    <section id="google-reviews" className="py-16 bg-[#FAF7F2] border-t border-[#F0E8E8]">
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
        async
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#D4617A] mb-2">
            Customer reviews
          </p>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-[#2C2C2C] mb-3">
            Reviews on Google
          </h2>
        </div>
        <div
          className={`elfsight-app-${ELFSIGHT_APP_ID}`}
          data-elfsight-app-lazy
        />
      </div>
    </section>
  );
}
