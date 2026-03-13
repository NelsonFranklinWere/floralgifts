import { createClient } from "@/utils/supabase/server";

export type CaseStudyColour = {
  name: string;
  hex: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  category: "wedding" | "birthday" | "event" | "corporate";
  client_first_name?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  location?: string | null;
  guest_count?: string | null;
  brief?: string | null;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  client_quote?: string | null;
  flowers_used?: string[] | null;
  colour_palette?: CaseStudyColour[] | null;
  hero_image_url?: string | null;
  gallery_images?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// All published case studies for listing page
export async function getAllCaseStudies(
  category?: string,
): Promise<CaseStudy[]> {
  const supabase = createClient();
  let query = supabase
    .from("case_studies")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    return [];
  }
  return (data ?? []) as CaseStudy[];
}

// Single case study by slug
export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;

  return (data ?? null) as CaseStudy | null;
}

// Featured case studies for homepage (max 3)
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  if (error) return [];
  return (data ?? []) as CaseStudy[];
}

// Related case studies (same category, exclude current)
export async function getRelatedCaseStudies(
  category: string,
  excludeSlug: string,
  limit = 3,
): Promise<CaseStudy[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("published", true)
    .eq("category", category)
    .neq("slug", excludeSlug)
    .limit(limit);

  if (error) return [];
  return (data ?? []) as CaseStudy[];
}

// All slugs for generateStaticParams
export async function getAllCaseStudySlugs(): Promise<{ slug: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("slug")
    .eq("published", true);

  if (error) return [];

  return (data ?? []) as { slug: string }[];
}

