import { Metadata } from "next";
import SalePageClient from "./SalePageClient";
import { getSaleProducts } from "@/lib/db";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Shop Our Sale Catalog — Flowers, Hampers & Gifts | Floral Whispers",
  description:
    "Browse our curated Sale catalog of flowers, gift hampers, wines, chocolates, cakes and more. Same-day delivery in Nairobi — Floral Whispers Gifts.",
  alternates: {
    canonical: `${baseUrl}/sale`,
  },
  openGraph: {
    title: "Shop Our Sale Catalog — Flowers, Hampers & Gifts | Floral Whispers",
    description:
      "Browse our curated Sale catalog of flowers, gift hampers, wines, chocolates, cakes and more. Same-day delivery in Nairobi.",
    url: `${baseUrl}/sale`,
    type: "website",
  },
};

export default async function SalePage() {
  const products = await getSaleProducts(20);
  return <SalePageClient products={Array.isArray(products) ? products : []} />;
}

export const revalidate = 60;
