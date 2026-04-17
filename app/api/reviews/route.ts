import { NextResponse } from 'next/server';
import config from '@/config';

export async function GET() {
  try {
    const { GOOGLE_API_KEY, GOOGLE_PLACE_ID } = config;

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google API error:', data.status, data.error_message);
      return NextResponse.json([]);
    }

    const reviews = (data.result.reviews || []).map((review: any, index: number) => ({
      author_name: review.author_name || 'Anonymous',
      rating: review.rating || 0,
      review_text: review.text || '',
      time: review.relative_time_description || '',
      profile_photo: review.profile_photo_url || null,
      rating_numeric: review.rating || 0
    }));

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Reviews API error:', error);
    return NextResponse.json([]);
  }
}
