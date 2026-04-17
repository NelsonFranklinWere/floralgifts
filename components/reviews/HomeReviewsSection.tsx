import { fetchGooglePlaceReviewsForStore } from "@/lib/googlePlaceReviews";
import ReviewsShowcase from "./ReviewsShowcase";

const DEFAULT_REVIEW_URL = "https://share.google/SLquYNat2Z1Ag1AO8";

function averageFromReviews(reviews: { rating: number }[]): string {
  if (reviews.length === 0) return "5.0";
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

/**
 * Homepage reviews: Google Places (Place Details) only.
 * Configure GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env.local.
 */
export default async function HomeReviewsSection() {
  const google = await fetchGooglePlaceReviewsForStore();

  if (google && google.reviews.length > 0) {
    const avg =
      google.placeRating != null
        ? google.placeRating.toFixed(1)
        : averageFromReviews(google.reviews);
    const total = google.userRatingsTotal;
    const countLabel =
      total != null
        ? `· ${total.toLocaleString()} reviews on Google`
        : `· ${google.reviews.length} reviews on Google`;
    return (
      <ReviewsShowcase
        reviews={google.reviews}
        averageRating={avg}
        countLabel={countLabel}
        footnote="Google shows a sample of recent public reviews. Overall rating and total count come from your Business Profile."
      />
    );
  }

  const reviewUrl =
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || DEFAULT_REVIEW_URL;

  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#D4617A] mb-2">
          Customer reviews
        </p>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2C2C2C] mb-3">
          Reviews on Google
        </h2>
        <p className="text-sm text-[#6B7280] mb-6">
          Live reviews load here once{" "}
          <code className="text-xs bg-white/80 px-1 py-0.5 rounded border border-[#E5E7EB]">
            GOOGLE_PLACE_ID
          </code>{" "}
          is set in{" "}
          <code className="text-xs bg-white/80 px-1 py-0.5 rounded border border-[#E5E7EB]">
            .env.local
          </code>{" "}
          and Places API billing is enabled on your Google Cloud project.
        </p>
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-6 py-3 rounded-full hover:shadow-md transition-all"
        >
          Read and leave a review on Google
        </a>
      </div>
    </section>
  );
}
