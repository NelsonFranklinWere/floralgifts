import { getReviews } from "@/lib/reviews";
import ReviewsCarousel from "./ReviewsCarousel";

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6 1.54 7.38 2.84l5.4-5.4C33.89 4.1 29.47 2 24 2 14.82 2 7.16 7.84 4.24 16.1l6.86 5.32C12.68 14.64 17.8 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.15 24.5c0-1.6-.15-3.13-.43-4.5H24v9.02h12.4c-.54 2.9-2.18 5.36-4.66 7.02l7.33 5.69C42.77 38.9 46.15 32.4 46.15 24.5z"
      />
      <path
        fill="#4A90E2"
        d="M11.1 28.58A14.5 14.5 0 0 1 10.5 24c0-1.58.27-3.12.75-4.55l-6.86-5.32A22.41 22.41 0 0 0 2 24c0 3.64.87 7.07 2.39 10.1l6.71-5.52z"
      />
      <path
        fill="#FBBC05"
        d="M24 46c5.47 0 10.08-1.8 13.44-4.88l-7.33-5.69C28.1 36.46 26.21 37 24 37c-6.2 0-11.32-5.14-11.9-11.58l-6.86 5.32C7.16 40.16 14.82 46 24 46z"
      />
      <path fill="none" d="M2 2h44v44H2z" />
    </svg>
  );
}

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
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#D4617A] mb-2">
            What Our Clients Say
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">
            Loved by Nairobi
          </h2>
          <div className="flex items-center justify-center gap-3">
            <GoogleLogo className="w-6 h-6" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <svg
                  key={idx}
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.95 2.675c-.784.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.063 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"
                    fill="#FBBF24"
                  />
                </svg>
              ))}
            </div>
            <span className="font-bold text-lg text-[#2C2C2C]">
              {avg}
            </span>
            <span className="text-sm text-[#6B7280]">
              · {reviews.length} Google Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <ReviewsCarousel reviews={reviews} />

      {/* CTA */}
      <div className="text-center mt-10 px-4">
        <a
          href="https://search.google.com/local/writereview?placeid=FLORAL_WHISPERS_PLACE_ID"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium px-6 py-3 rounded-full hover:shadow-md transition-all"
        >
          <GoogleLogo className="w-4 h-4" />
          Leave us a Google Review
        </a>
        <p className="text-xs text-gray-400 mt-2">
          Your review helps other Nairobi customers find us
        </p>
      </div>
    </section>
  );
}

