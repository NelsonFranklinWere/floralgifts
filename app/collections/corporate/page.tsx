import OccasionGiftsPage, { occasionMetadata } from "@/components/OccasionGiftsPage";
import type { Metadata } from "next";

export const metadata: Metadata = occasionMetadata("corporate");

export default function CorporatePage() {
  return <OccasionGiftsPage occasion="corporate" />;
}
