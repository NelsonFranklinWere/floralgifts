import type { Metadata } from "next";
import Link from "next/link";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Period Care Package Kenya | Thoughtful Gifts in Nairobi",
  description:
    "Shop thoughtful period care package gifts in Kenya with same-day Nairobi delivery. Add flowers, comfort items, chocolates and caring notes.",
  alternates: { canonical: `${baseUrl}/period-care-package-kenya` },
};

export default function PeriodCarePackageKenyaPage() {
  const text = encodeURIComponent(
    "Hello Floral Whispers Gifts, I want to send a period care package in Nairobi."
  );

  return (
    <section className="py-12 md:py-16 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl text-[#2C2C2C] mb-4">
          Period Care Package Kenya
        </h1>
        <p className="text-gray-600 mb-6">
          Send a caring period support package in Nairobi with practical essentials and a thoughtful flower add-on.
          Perfect for partners, friends, and family who want to show support.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-6">
          <li>Comfort-first care package options</li>
          <li>Optional flowers and chocolates</li>
          <li>Same-day and next-day Nairobi delivery</li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link href="/collections/gift-hampers" className="inline-flex rounded-full bg-[#D4617A] text-white px-5 py-2.5 text-sm font-semibold">
            Shop care-friendly hampers
          </Link>
          <Link
            href={`https://wa.me/254721554393?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-semibold"
          >
            Order on WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
