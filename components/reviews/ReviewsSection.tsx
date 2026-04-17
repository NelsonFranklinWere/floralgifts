import { getReviews } from "@/lib/reviews";
import ReviewsShowcase from "./ReviewsShowcase";

export default async function ReviewsSection() {
  const reviews = await getReviews();
  if (reviews.length === 0) return null;

  const avg =
    reviews.length === 0
      ? "5.0"
      : (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1);

  return (
    <ReviewsShowcase
      reviews={reviews}
      averageRating={avg}
      countLabel={`· ${reviews.length} Google Reviews`}
    />
  );
}

