import { createClient } from "@/utils/supabase/server";

export type Review = {
  id: string;
  reviewer_name: string;
  avatar_initials: string;
  avatar_colour: string;
  rating: number;
  review_text: string;
  review_date: string;
  category?: string | null;
  verified: boolean;
  sort_order: number;
};

export async function getReviews(): Promise<Review[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("verified", true)
    .order("sort_order", { ascending: true })
    .limit(10);

  if (error) return [];

  return (data ?? []) as Review[];
}
