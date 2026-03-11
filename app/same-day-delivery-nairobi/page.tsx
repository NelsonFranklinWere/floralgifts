import { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Same Day Delivery Nairobi — Flowers, Hampers & Teddy Bears | Floral Whispers Gifts",
  description:
    "Same day delivery Nairobi for flowers, gift hampers and teddy bears. Learn how our cutoff times, delivery areas and WhatsApp ordering work with Floral Whispers Gifts.",
  alternates: {
    canonical: `${baseUrl}/same-day-delivery-nairobi`,
  },
};

export default function SameDayDeliveryNairobiPage() {
  return (
    <div className="bg-white py-8 md:py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Same Day Delivery Nairobi — Flowers, Hampers & Teddy Bears
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-4">
          Need a last-minute gift in Nairobi? Floral Whispers Gifts offers same-day delivery for flowers,
          luxury gift hampers and teddy bears across major Nairobi neighbourhoods including CBD, Westlands,
          Karen, Kilimani, Lavington, Langata and surrounding estates.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-4">
          Place your order on WhatsApp before our daily cut-off time and our team will confirm the delivery
          window, rider availability and payment. Once confirmed, we hand-arrange your bouquet or hamper and
          dispatch it immediately so it reaches your recipient the same day.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Same-day delivery is ideal for birthdays, anniversaries, apologies, hospital visits and surprise
          gestures. We keep communication clear from order to drop-off, so you always know when your gift has
          arrived.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <a
            href="https://wa.me/254721554393"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm md:text-base"
          >
            Chat on WhatsApp for Same-Day Delivery
          </a>
          <span className="text-xs md:text-sm text-brand-gray-600">
            Share the product, budget and Nairobi location — we&apos;ll confirm if same-day delivery is
            available.
          </span>
        </div>

        <div className="space-y-4 text-brand-gray-800 text-sm md:text-base">
          <p>
            Browse{" "}
            <Link href="/collections/flowers" className="text-brand-green hover:text-brand-red font-semibold">
              Flowers Nairobi
            </Link>{" "}
            for fresh bouquets,{" "}
            <Link
              href="/collections/gift-hampers"
              className="text-brand-green hover:text-brand-red font-semibold"
            >
              Gift Hampers Nairobi
            </Link>{" "}
            for curated boxes, and{" "}
            <Link
              href="/collections/teddy-bears"
              className="text-brand-green hover:text-brand-red font-semibold"
            >
              Teddy Bears Nairobi
            </Link>{" "}
            for soft toys and giant bears that can be sent on their own or paired with flowers.
          </p>
          <p>
            If you&apos;re unsure what to choose, send us a quick message on WhatsApp with the occasion and
            budget and we&apos;ll recommend the best same-day options available in Nairobi.
          </p>
        </div>
      </div>
    </div>
  );
}

