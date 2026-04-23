import type { Metadata } from "next";
import Link from "next/link";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Corporate Gift Hampers Nairobi | Bulk Orders for Teams & Clients",
  description:
    "Order corporate gift hampers in Nairobi for client appreciation, team celebrations, and holiday campaigns. Bulk hamper packages with reliable delivery and WhatsApp support.",
  alternates: { canonical: `${baseUrl}/corporate-gift-hampers-nairobi` },
};

export default function CorporateGiftHampersPage() {
  const text = encodeURIComponent(
    "Hello Floral Whispers Gifts, I need a corporate hamper quotation for bulk delivery in Nairobi."
  );

  return (
    <section className="py-12 md:py-16 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl text-[#2C2C2C] mb-4">
          Corporate Gift Hampers Nairobi
        </h1>
        <p className="text-gray-600 mb-6">
          We prepare custom bulk gift hampers for Nairobi companies, agencies, teams and client campaigns.
          Choose your budget, recipient count, and preferred delivery dates.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-6">
          <li>Bulk hampers for clients and staff</li>
          <li>Branded card and message customization</li>
          <li>Coordinated same-day and scheduled delivery</li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link href="/collections/gift-hampers" className="inline-flex rounded-full bg-[#D4617A] text-white px-5 py-2.5 text-sm font-semibold">
            Browse hampers
          </Link>
          <Link
            href={`https://wa.me/254721554393?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-semibold"
          >
            Request bulk quote on WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
