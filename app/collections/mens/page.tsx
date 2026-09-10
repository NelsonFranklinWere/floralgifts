import RecipientGiftsPage, { recipientMetadata } from "@/components/RecipientGiftsPage";
import type { Metadata } from "next";

export const metadata: Metadata = recipientMetadata("mens");

export default function MensPage() {
  return <RecipientGiftsPage recipient="mens" />;
}
