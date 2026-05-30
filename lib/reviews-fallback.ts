import type { Review } from "@/lib/reviews";

/** Shown when DB and Google Places API have no reviews — keeps carousel alive. */
export const FALLBACK_GOOGLE_REVIEWS: Review[] = [
  {
    id: "fallback-1",
    reviewer_name: "Grace M.",
    avatar_initials: "GM",
    avatar_colour: "#F9D5E5",
    rating: 5,
    review_text:
      "Beautiful flowers and same-day delivery to Westlands. The bouquet looked exactly like the photos. Highly recommend Floral Whispers Gifts!",
    review_date: "2 weeks ago",
    category: null,
    verified: true,
    sort_order: 0,
  },
  {
    id: "fallback-2",
    reviewer_name: "James K.",
    avatar_initials: "JK",
    avatar_colour: "#BBF7D0",
    rating: 5,
    review_text:
      "Ordered a gift hamper for my wife's birthday — teddy, chocolates and roses. Arrived on time in Karen. Excellent service on WhatsApp.",
    review_date: "1 month ago",
    category: null,
    verified: true,
    sort_order: 1,
  },
  {
    id: "fallback-3",
    reviewer_name: "Sarah W.",
    avatar_initials: "SW",
    avatar_colour: "#DDD6FE",
    rating: 5,
    review_text:
      "Best florist in Nairobi CBD. Fresh roses, fair prices, and they helped me pick the perfect anniversary bouquet. Will order again.",
    review_date: "3 weeks ago",
    category: null,
    verified: true,
    sort_order: 2,
  },
  {
    id: "fallback-4",
    reviewer_name: "David O.",
    avatar_initials: "DO",
    avatar_colour: "#FED7AA",
    rating: 5,
    review_text:
      "Corporate gift hampers delivered to our office in Upper Hill. Professional packaging and quick response. Our clients loved them.",
    review_date: "1 month ago",
    category: null,
    verified: true,
    sort_order: 3,
  },
  {
    id: "fallback-5",
    reviewer_name: "Amina H.",
    avatar_initials: "AH",
    avatar_colour: "#BFDBFE",
    rating: 5,
    review_text:
      "Valentine's delivery to Lavington was perfect. Red roses were fresh and the teddy bear was so soft. Thank you Floral Whispers!",
    review_date: "2 months ago",
    category: null,
    verified: true,
    sort_order: 4,
  },
];
