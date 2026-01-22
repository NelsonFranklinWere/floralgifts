import { Metadata } from "next";
import CardsPageClient from "./CardsPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Gift Cards | Floral Whispers Gifts - Perfect Gift Cards Nairobi",
  description: "Perfect gift cards for any occasion in Nairobi. Digital and physical gift cards available. Let them choose their favorite flowers, teddy bears, and gifts. Same-day delivery across Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
  keywords: [
    "gift cards Nairobi",
    "digital gift cards Kenya",
    "physical gift cards Nairobi",
    "flower gift cards Kenya",
    "gift vouchers Nairobi",
    "present cards Kenya",
    "gift certificates Nairobi",
    "birthday gift cards Kenya",
    "anniversary gift cards Nairobi",
    "corporate gift cards Kenya",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/cards`,
  },
  openGraph: {
    title: "Gift Cards | Floral Whispers Gifts Nairobi",
    description: "Perfect gift cards for any occasion. Digital and physical gift cards available for flowers, teddy bears, and gifts in Nairobi.",
    url: `${baseUrl}/collections/cards`,
    type: "website",
  },
};

export default function CardsPage() {
  return <CardsPageClient />;
}