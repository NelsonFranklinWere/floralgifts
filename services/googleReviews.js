import config from '@/config';

export async function fetchGoogleReviews() {
  if (!config.GOOGLE_API_KEY || config.GOOGLE_API_KEY === 'PASTE_API_KEY_HERE') {
    console.log('API key not configured');
    return [];
  }

  try {
    const response = await fetch('/api/reviews');
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}
