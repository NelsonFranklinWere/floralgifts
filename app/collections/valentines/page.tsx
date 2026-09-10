import OccasionGiftsPage, { occasionMetadata } from "@/components/OccasionGiftsPage";
import type { Metadata } from "next";

export const metadata: Metadata = occasionMetadata("valentines");

export default function ValentinesPage() {
  return <OccasionGiftsPage occasion="valentines" />;
}
