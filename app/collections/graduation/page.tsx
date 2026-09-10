import OccasionGiftsPage, { occasionMetadata } from "@/components/OccasionGiftsPage";
import type { Metadata } from "next";

export const metadata: Metadata = occasionMetadata("graduation");

export default function GraduationPage() {
  return <OccasionGiftsPage occasion="graduation" />;
}
