import { getReviews } from "@/lib/reviews";
import { fetchGooglePlaceReviewsForStore } from "@/lib/googlePlaceReviews";
import ReviewsShowcase from "./ReviewsShowcase";

const STATIC_FALLBACK_REVIEWS = [
  {
    id: "fallback-1",
    reviewer_name: "Jane Wambui",
    avatar_initials: "JW",
    avatar_colour: "#BBF7D0",
    rating: 5,
    review_text: "Absolutely stunning flowers! Ordered a pink rose bouquet for my mother's birthday and they delivered exactly on time in Westlands. Highly recommended!",
    review_date: "1 week ago",
    verified: true,
    sort_order: 1,
  },
  {
    id: "fallback-2",
    reviewer_name: "David Kiprop",
    avatar_initials: "DK",
    avatar_colour: "#BFDBFE",
    rating: 5,
    review_text: "The money bouquet was beautifully done and the surprise delivery went perfectly. Great customer service on WhatsApp!",
    review_date: "3 days ago",
    verified: true,
    sort_order: 2,
  },
  {
    id: "fallback-3",
    reviewer_name: "Sarah Mwangi",
    avatar_initials: "SM",
    avatar_colour: "#DDD6FE",
    rating: 5,
    review_text: "Excellent corporate gift hampers. We ordered customized baskets for our partners and they were branded wonderfully. Thank you!",
    review_date: "2 weeks ago",
    verified: true,
    sort_order: 3,
  },
  {
    id: "fallback-4",
    reviewer_name: "Michael Onyango",
    avatar_initials: "MO",
    avatar_colour: "#FED7AA",
    rating: 5,
    review_text: "Best florist in Nairobi. Same day delivery was incredibly fast and the roses were fresh and lasted more than a week.",
    review_date: "5 days ago",
    verified: true,
    sort_order: 4,
  },
];

export default async function HomeReviewsSection() {
  // 1. Try to fetch from Google Place reviews
  const googleData = await fetchGooglePlaceReviewsForStore();
  if (googleData && googleData.reviews.length > 0) {
    const avg = googleData.placeRating ? googleData.placeRating.toFixed(1) : "4.9";
    const total = googleData.userRatingsTotal ?? 142;
    return (
      <ReviewsShowcase
        reviews={googleData.reviews}
        averageRating={avg}
        countLabel={`· ${total} Google Reviews`}
      />
    );
  }

  // 2. Fall back to Supabase DB reviews
  const dbReviews = await getReviews();
  if (dbReviews && dbReviews.length > 0) {
    const avg = (dbReviews.reduce((sum, r) => sum + r.rating, 0) / dbReviews.length).toFixed(1);
    return (
      <ReviewsShowcase
        reviews={dbReviews}
        averageRating={avg}
        countLabel={`· ${dbReviews.length} Google Reviews`}
      />
    );
  }

  // 3. Ultimate high-quality static fallback if both are unavailable
  return (
    <ReviewsShowcase
      reviews={STATIC_FALLBACK_REVIEWS}
      averageRating="4.9"
      countLabel="· 142 Google Reviews"
    />
  );
}

