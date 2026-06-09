import { getReviews } from "@/lib/reviews";
import { fetchGooglePlaceReviewsForStore } from "@/lib/googlePlaceReviews";
import { FALLBACK_GOOGLE_REVIEWS } from "@/lib/reviews-fallback";
import ReviewsShowcase from "./ReviewsShowcase";

export default async function HomeReviewsSection() {
  let reviews: Awaited<ReturnType<typeof getReviews>> = [];
  let averageRating = "5.0";
  let countLabel = "· Google Reviews";

  const google = await fetchGooglePlaceReviewsForStore();
  if (google?.reviews.length) {
    reviews = google.reviews;
    averageRating =
      google.placeRating != null ? google.placeRating.toFixed(1) : "5.0";
    countLabel = google.userRatingsTotal
      ? `· ${google.userRatingsTotal} Google Reviews`
      : `· ${reviews.length} Google Reviews`;
  } else {
    reviews = await getReviews();
    if (reviews.length > 0) {
      averageRating = (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1);
      countLabel = `· ${reviews.length} Google Reviews`;
    }
  }

  if (reviews.length === 0) {
    reviews = FALLBACK_GOOGLE_REVIEWS;
    averageRating = "5.0";
    countLabel = "· Google Reviews";
  }

  return (
    <ReviewsShowcase
      reviews={reviews}
      averageRating={averageRating}
      countLabel={countLabel}
    />
  );
}
