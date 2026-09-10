import { Metadata } from "next";
import NewArrivalsClient from "./NewArrivalsClient";
import { getProducts } from "@/lib/db";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "New Arrivals | Latest Flowers, Hampers & Gifts | Floral Whispers",
  description:
    "Shop the latest flowers, gift hampers, teddy bears, cakes and more — newest products first, with same-day delivery across Nairobi.",
  alternates: {
    canonical: `${baseUrl}/new-arrivals`,
  },
  openGraph: {
    title: "New Arrivals | Floral Whispers Gifts",
    description:
      "Discover our newest flowers, hampers and gifts — ordered newest first.",
    url: `${baseUrl}/new-arrivals`,
    type: "website",
  },
};

export default async function NewArrivalsPage() {
  // getProducts already orders by created_at desc (newest first)
  const products = await getProducts();
  return <NewArrivalsClient products={Array.isArray(products) ? products : []} />;
}

export const revalidate = 60;
