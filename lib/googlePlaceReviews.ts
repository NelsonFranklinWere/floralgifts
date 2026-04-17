import type { Review } from "@/lib/reviews";

const AVATAR_PALETTE = [
  "#F9D5E5",
  "#BBF7D0",
  "#DDD6FE",
  "#FED7AA",
  "#BFDBFE",
  "#FECACA",
] as const;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

type GooglePlaceReviewRaw = {
  author_name?: string;
  rating?: number;
  text?: string;
  time?: number;
  relative_time_description?: string;
};

type PlaceDetailsResponse = {
  status: string;
  error_message?: string;
  result?: {
    reviews?: GooglePlaceReviewRaw[];
    rating?: number;
    user_ratings_total?: number;
  };
};

export type GooglePlaceReviewsResult = {
  reviews: Review[];
  placeRating: number | null;
  userRatingsTotal: number | null;
};

/**
 * Fetches public reviews for a Google Business listing via Places API (Place Details).
 * Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in env (server-only).
 * Google returns at most ~5 review objects per request; user_ratings_total is the full count.
 */
export async function fetchGooglePlaceReviewsForStore(): Promise<GooglePlaceReviewsResult | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  const fields = encodeURIComponent("reviews,rating,user_ratings_total");
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${fields}&key=${encodeURIComponent(key)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = (await res.json()) as PlaceDetailsResponse;
    if (data.status !== "OK" || !data.result) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[google-reviews] Place Details:",
          data.status,
          data.error_message ?? ""
        );
      }
      return null;
    }

    const raw = data.result.reviews ?? [];
    const reviews: Review[] = raw.map((r, index) => {
      const name = (r.author_name ?? "Google user").trim();
      const t = typeof r.time === "number" ? r.time : index;
      const text = (r.text ?? "").trim();
      return {
        id: `google-${t}-${index}`,
        reviewer_name: name || "Google user",
        avatar_initials: initialsFromName(name || "G"),
        avatar_colour: AVATAR_PALETTE[hashString(name || String(t)) % AVATAR_PALETTE.length]!,
        rating: Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5))),
        review_text: text || "Rated on Google.",
        review_date: r.relative_time_description?.trim() || "",
        category: null,
        verified: true,
        sort_order: index,
      } satisfies Review;
    });

    return {
      reviews,
      placeRating:
        typeof data.result.rating === "number" ? data.result.rating : null,
      userRatingsTotal:
        typeof data.result.user_ratings_total === "number"
          ? data.result.user_ratings_total
          : null,
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[google-reviews] fetch failed:", err);
    }
    return null;
  }
}
