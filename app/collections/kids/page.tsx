import RecipientGiftsPage, { recipientMetadata } from "@/components/RecipientGiftsPage";
import type { Metadata } from "next";

export const metadata: Metadata = recipientMetadata("kids");

export default function KidsPage() {
  return <RecipientGiftsPage recipient="kids" />;
}
