import type { Metadata } from "next";
import Link from "next/link";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Send Gifts to Kenya from Abroad | Nairobi Delivery",
  description:
    "Send gifts to Kenya from abroad with fast Nairobi delivery. Ideal for diaspora buyers in the US, Canada, Australia, UK and beyond.",
  alternates: { canonical: `${baseUrl}/send-gifts-to-kenya` },
};

export default function SendGiftsToKenyaPage() {
  const text = encodeURIComponent(
    "Hello Floral Whispers Gifts, I am abroad and I want to send a gift to someone in Nairobi."
  );

  return (
    <section className="py-12 md:py-16 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl text-[#2C2C2C] mb-4">
          Send Gifts to Kenya from Abroad
        </h1>
        <p className="text-gray-600 mb-6">
          If you are outside Kenya and want to surprise someone in Nairobi, we make ordering simple.
          Share recipient details on WhatsApp and our team confirms the best gift options and delivery time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">Step 1: Share recipient name, phone, and location.</div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">Step 2: Choose flowers, hampers, wine, or teddy bundles.</div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">Step 3: We confirm delivery and keep you updated.</div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/collections" className="inline-flex rounded-full bg-[#D4617A] text-white px-5 py-2.5 text-sm font-semibold">
            Explore gift collections
          </Link>
          <Link
            href={`https://wa.me/254721554393?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-semibold"
          >
            Start order on WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
