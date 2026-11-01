import { Metadata } from "next";
import CardsPageClient from "./CardsPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Greeting Cards Nairobi | Floral Whispers",
  description:
    "Greeting cards for birthdays, anniversaries and congratulations, delivered with flowers and gifts across Nairobi from Floral Whispers Gifts.",
  alternates: {
    canonical: `${baseUrl}/collections/cards`,
  },
  openGraph: {
    title: "Greeting Cards Nairobi | Floral Whispers",
    description: "Greeting cards for birthdays, anniversaries and congratulations, delivered with flowers and gifts across Nairobi from Floral Whispers Gifts.",
    url: `${baseUrl}/collections/cards`,
    type: "website",
  },
};

export default function CardsPage() {
  return <CardsPageClient />;
}