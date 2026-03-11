import { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Flower Delivery Nairobi — Same Day Delivery Across the City | Floral Whispers Gifts",
  description:
    "Flower delivery Nairobi with same-day delivery across Westlands, Karen, Kilimani, Lavington, CBD, Eastleigh, South B, Langata, Runda and Muthaiga. Order bouquets, roses and gift hampers via WhatsApp from Floral Whispers Gifts.",
  alternates: {
    canonical: `${baseUrl}/flower-delivery-nairobi`,
  },
};

export default function FlowerDeliveryNairobiPage() {
  return (
    <div className="bg-white py-8 md:py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Flower Delivery Nairobi — Same Day Delivery Across the City
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-4">
          Floral Whispers Gifts offers fast, reliable flower delivery across Nairobi with same-day options
          available. We cover key areas including Westlands, Karen, Kilimani, Lavington, CBD, Eastleigh,
          South B, Langata, Runda and Muthaiga, ensuring your bouquet arrives fresh and on time.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-4">
          Choose from romantic red roses, mixed bouquets, sunflowers and curated gift hampers to match any
          occasion — birthdays, anniversaries, apologies, graduations or just-because surprises. Simply send
          your order details on WhatsApp and our team will confirm availability, delivery time and payment so
          your flowers can be prepared and dispatched quickly.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Same-day flower delivery in Nairobi is available for orders placed within our daily cut-off window,
          subject to location and stock. We coordinate closely with riders to keep you updated so you can
          relax while we handle every detail of your delivery.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <a
            href="https://wa.me/254721554393"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm md:text-base"
          >
            Order Flowers on WhatsApp
          </a>
          <span className="text-xs md:text-sm text-brand-gray-600">
            Tell us the bouquet, budget and delivery location in Nairobi — we&apos;ll handle the rest.
          </span>
        </div>

        <div className="space-y-4 text-brand-gray-800 text-sm md:text-base">
          <p>
            For classic bouquets, explore our{" "}
            <Link href="/collections/flowers" className="text-brand-green hover:text-brand-red font-semibold">
              Flowers Nairobi collection
            </Link>{" "}
            with red roses, mixed arrangements and seasonal blooms. If you want to combine flowers with
            chocolates, wine or teddy bears, visit our{" "}
            <Link
              href="/collections/gift-hampers"
              className="text-brand-green hover:text-brand-red font-semibold"
            >
              Gift Hampers Nairobi
            </Link>{" "}
            page for ready-made packages.
          </p>
          <p>
            Every order is hand-arranged by our Nairobi florists and packaged carefully for transport, so your
            recipient experiences a beautiful unboxing moment the second their flowers arrive.
          </p>
        </div>
      </div>
    </div>
  );
}

