import { Metadata } from "next";
import CardsPageClient from "./CardsPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Valentine's Cards Nairobi | Romantic Love Messages, Personalized Valentine's Cards & Gift Cards | Same-Day Delivery",
  description: "Best Valentine's cards Nairobi: romantic love messages, personalized Valentine's cards, gift cards for your wife, husband, girlfriend. Pre-Valentine's orders, same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
  keywords: [
    // Valentine's Cards Core Keywords
    "valentine's cards Nairobi",
    "valentine's love cards Nairobi",
    "romantic valentine's cards Nairobi",
    "valentine's message cards Nairobi",
    "personalized valentine's cards Nairobi",

    // Valentine's Cards for Relationships
    "valentine's card for wife Nairobi",
    "valentine's card for husband Nairobi",
    "valentine's card for girlfriend Nairobi",
    "valentine's card for mom Nairobi",
    "valentine's card for dad Nairobi",
    "romantic love cards valentine's Nairobi",

    // Valentine's Card Types
    "valentine's gift cards Nairobi",
    "valentine's digital cards Nairobi",
    "valentine's physical cards Nairobi",
    "valentine's romantic messages Nairobi",
    "valentine's love letters Nairobi",

    // Valentine's Planning
    "pre valentine's cards Nairobi",
    "valentine's card delivery Nairobi",
    "early valentine's card orders Nairobi",
    "plan valentine's romantic message Nairobi",

    // Valentine's Delivery
    "same day valentine's cards Nairobi",
    "valentine's cards CBD Nairobi",
    "valentine's cards Westlands",
    "valentine's cards Karen Nairobi",
    "valentine's cards Lavington",
    "valentine's cards Kilimani",

    // Valentine's AI Search
    "where to buy valentine's cards Nairobi",
    "best valentine's love cards Nairobi",
    "romantic cards near me Nairobi",
    "how to write valentine's message Nairobi",

    // Valentine's Voice Search
    "order valentine's cards online Nairobi",
    "find romantic cards near me Nairobi",
    "valentine's card delivery near me",

    // Valentine's Long-tail
    "personalized valentine's romantic messages Nairobi",
    "custom valentine's love cards Nairobi",
    "beautiful valentine's card designs Nairobi",
    "thoughtful valentine's message cards Nairobi",

    // Valentine's Seasonal
    "february valentine's cards Nairobi",
    "2025 valentine's cards Nairobi",
    "love month cards Nairobi Kenya",

    // Keeping traditional keywords
    "gift cards Nairobi",
    "digital gift cards Kenya",
    "physical gift cards Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/cards`,
  },
  openGraph: {
    title: "Valentine's Cards Nairobi | Romantic Love Messages, Personalized Valentine's Cards & Gift Cards",
    description: "Best Valentine's cards Nairobi: romantic love messages, personalized Valentine's cards, gift cards for your wife, husband, girlfriend. Pre-Valentine's orders, same-day delivery across Nairobi.",
    url: `${baseUrl}/collections/cards`,
    type: "website",
  },
};

export default function CardsPage() {
  return <CardsPageClient />;
}