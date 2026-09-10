import { Metadata } from "next";
import RecipientGiftsClient from "@/components/RecipientGiftsClient";
import { getAllCatalogProducts } from "@/lib/catalog-products";
import {
  filterProductsByRecipient,
  getRecipientMeta,
  type GiftRecipient,
} from "@/lib/recipient-gifts";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export function recipientMetadata(recipient: GiftRecipient): Metadata {
  const meta = getRecipientMeta(recipient);
  return {
    title: `${meta.label} Nairobi | Same-Day Delivery | Floral Whispers Gifts`,
    description: meta.description,
    alternates: { canonical: `${baseUrl}/collections/${recipient}` },
    openGraph: {
      title: `${meta.label} | Floral Whispers Gifts Nairobi`,
      description: meta.description,
      url: `${baseUrl}/collections/${recipient}`,
    },
  };
}

export default async function RecipientGiftsPage({
  recipient,
}: {
  recipient: GiftRecipient;
}) {
  const meta = getRecipientMeta(recipient);
  const all = await getAllCatalogProducts();
  const products = filterProductsByRecipient(all, recipient);

  return (
    <div className="py-10 sm:py-14 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-red mb-2">
            Shop by recipient
          </p>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-gray-900 mb-3">
            {meta.label}
          </h1>
          <p className="text-brand-gray-600 text-sm sm:text-base">
            {meta.description}
          </p>
          <p className="mt-3 text-xs text-brand-gray-500">
            Showing {products.length} gift{products.length === 1 ? "" : "s"}{" "}
            for {meta.shortLabel.toLowerCase()}
          </p>
        </div>

        <RecipientGiftsClient
          products={products}
          recipientLabel={meta.shortLabel}
        />
      </div>
    </div>
  );
}
