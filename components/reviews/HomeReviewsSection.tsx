import { getReviews } from "@/lib/reviews";
import { fetchGooglePlaceReviewsForStore } from "@/lib/googlePlaceReviews";
import ElfsightGoogleReviews from "./ElfsightGoogleReviews";
import ReviewsShowcase from "./ReviewsShowcase";
import { GOOGLE_BUSINESS } from "@/lib/constants";

/**
 * Homepage reviews priority:
 * 1. Google Places API sample for the GBP Place ID (server-side live data)
 * 2. Live Elfsight widget sourced from the same Place ID / Business Profile
 * 3. Curated Supabase reviews as last resort
 *
 * Review CTA always uses the official Google share / verification link.
 */
export default async function HomeReviewsSection() {
  const google = await fetchGooglePlaceReviewsForStore();

  if (google?.reviews.length) {
    const averageRating =
      google.placeRating != null ? google.placeRating.toFixed(1) : "5.0";
    const countLabel = google.userRatingsTotal
      ? `· ${google.userRatingsTotal} Google Reviews`
      : `· ${google.reviews.length} Google Reviews`;

    return (
      <ReviewsShowcase
        reviews={google.reviews}
        averageRating={averageRating}
        countLabel={countLabel}
        reviewUrl={GOOGLE_BUSINESS.reviewUrl}
      />
    );
  }

  // Places API unavailable (billing/quota) or empty sample — live GBP widget
  // (Elfsight source place_id === GOOGLE_BUSINESS.placeId).
  return <ElfsightGoogleReviews />;
}

/** Optional admin/curated-only block (not used on home when GBP is primary). */
export async function CuratedReviewsSection() {
  const reviews = await getReviews();
  if (reviews.length === 0) return null;
  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);
  return (
    <ReviewsShowcase
      reviews={reviews}
      averageRating={averageRating}
      countLabel={`· ${reviews.length} reviews`}
      reviewUrl={GOOGLE_BUSINESS.reviewUrl}
    />
  );
}
