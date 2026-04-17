import { fetchGoogleReviews } from "@/services/googleReviews";

export type Review = {
  id: string;
  reviewer_name: string;
  avatar_initials: string;
  avatar_colour: string;
  rating: number;
  review_text: string;
  review_date: string;
  category?: string | null;
  verified: boolean;
  sort_order: number;
};

export async function getReviews(): Promise<Review[]> {
  try {
    const googleReviews = await fetchGoogleReviews();
    
    // Transform Google reviews to match our Review type
    return googleReviews.map((review: {
      author_name: string;
      rating: number;
      review_text: string;
      time: string;
      profile_photo: string | null;
      rating_numeric: number;
    }, index: number) => ({
      id: `google-review-${index}`,
      reviewer_name: review.author_name,
      avatar_initials: review.author_name ? review.author_name.charAt(0).toUpperCase() : 'G',
      avatar_colour: '#D4617A',
      rating: review.rating,
      review_text: review.review_text,
      review_date: review.time,
      category: 'Google',
      verified: true,
      sort_order: index
    }));
  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    return [];
  }
}
