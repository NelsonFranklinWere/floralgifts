import ReviewsCarousel from "./ReviewsCarousel";
import type { Review } from "@/lib/reviews";

const STATIC_REVIEWS: Review[] = [
  {
    id: "1",
    reviewer_name: "Sarah M.",
    avatar_initials: "SM",
    avatar_colour: "#F9D5E5",
    rating: 5,
    review_text:
      "Floral Whispers did all the flowers for my wedding in Karen. The arch alone was breathtaking — exactly what I had shown them on Pinterest but even more beautiful in person. Every guest asked who did the flowers.",
    review_date: "February 2026",
    category: "wedding",
    verified: true,
    sort_order: 1,
  },
  {
    id: "2",
    reviewer_name: "James K.",
    avatar_initials: "JK",
    avatar_colour: "#BBF7D0",
    rating: 5,
    review_text:
      "Ordered a surprise bouquet for my wife's birthday — delivered by 10am as promised. The roses were fresh, the packaging was stunning, and she absolutely loved it. Will be ordering again for our anniversary.",
    review_date: "January 2026",
    category: "birthday",
    verified: true,
    sort_order: 2,
  },
  {
    id: "3",
    reviewer_name: "Amina W.",
    avatar_initials: "AW",
    avatar_colour: "#DDD6FE",
    rating: 5,
    review_text:
      "The period care package I ordered for my sister was so thoughtfully put together. She cried happy tears. Fast delivery to Westlands and the presentation was gorgeous. Highly recommend.",
    review_date: "January 2026",
    category: "general",
    verified: true,
    sort_order: 3,
  },
  {
    id: "4",
    reviewer_name: "Brian O.",
    avatar_initials: "BO",
    avatar_colour: "#FED7AA",
    rating: 5,
    review_text:
      "We use Floral Whispers for our office in Upperhill — monthly subscription and the team is always professional, always on time, and the arrangements are always different and beautiful. Our clients notice every time.",
    review_date: "December 2025",
    category: "corporate",
    verified: true,
    sort_order: 4,
  },
  {
    id: "5",
    reviewer_name: "Wanjiru N.",
    avatar_initials: "WN",
    avatar_colour: "#F9D5E5",
    rating: 5,
    review_text:
      "I have used several florists in Nairobi and Floral Whispers is in a different league. They listened to exactly what I wanted for my daughter's graduation and delivered something even better. Same-day delivery was a lifesaver.",
    review_date: "December 2025",
    category: "event",
    verified: true,
    sort_order: 5,
  },
  {
    id: "6",
    reviewer_name: "David M.",
    avatar_initials: "DM",
    avatar_colour: "#BBF7D0",
    rating: 5,
    review_text:
      "Proposed to my girlfriend with a custom rose arrangement from Floral Whispers. They helped me choose the flowers, arranged everything beautifully, and even added a personal note card. She said yes. 10 out of 10.",
    review_date: "November 2025",
    category: "general",
    verified: true,
    sort_order: 6,
  },
  {
    id: "7",
    reviewer_name: "Grace A.",
    avatar_initials: "GA",
    avatar_colour: "#FDE68A",
    rating: 5,
    review_text:
      "Ordered centrepieces for our company dinner at Radisson Blu — 12 tables. Every arrangement was identical, fresh, and delivered and set up on time. Very professional team. Will use again for our next corporate event.",
    review_date: "November 2025",
    category: "corporate",
    verified: true,
    sort_order: 7,
  },
  {
    id: "8",
    reviewer_name: "Kevin T.",
    avatar_initials: "KT",
    avatar_colour: "#DDD6FE",
    rating: 5,
    review_text:
      "Sent flowers to my mum in Nairobi from the UK — ordered online, paid via M-Pesa link, and she received them the same day. She was so surprised and the flowers lasted over two weeks. Amazing service.",
    review_date: "October 2025",
    category: "general",
    verified: true,
    sort_order: 8,
  },
  {
    id: "9",
    reviewer_name: "Fatuma H.",
    avatar_initials: "FH",
    avatar_colour: "#F9D5E5",
    rating: 5,
    review_text:
      "Floral Whispers did the flowers for my nikah — they understood the aesthetic I wanted immediately. White, gold and green. The bridal bouquet was a work of art. So many compliments. Thank you so much.",
    review_date: "October 2025",
    category: "wedding",
    verified: true,
    sort_order: 9,
  },
  {
    id: "10",
    reviewer_name: "Peter N.",
    avatar_initials: "PN",
    avatar_colour: "#BBF7D0",
    rating: 5,
    review_text:
      "Best florist in Nairobi, no competition. I have ordered birthday flowers, sympathy flowers, and random appreciation bouquets — every single time the quality has been exceptional and delivery always on time.",
    review_date: "September 2025",
    category: "general",
    verified: true,
    sort_order: 10,
  },
];

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
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

export default function StaticReviewsSection() {
  const reviews = STATIC_REVIEWS;
  const avg =
    reviews.length === 0
      ? "5.0"
      : (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1);

  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4">
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

      <ReviewsCarousel reviews={reviews} />

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

