import RecipientGiftsPage, { recipientMetadata } from "@/components/RecipientGiftsPage";
import type { Metadata } from "next";

export const metadata: Metadata = recipientMetadata("womens");

export default function WomensPage() {
  return <RecipientGiftsPage recipient="womens" />;
}
