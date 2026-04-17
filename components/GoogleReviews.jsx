import React, { useState, useEffect } from 'react';
import { fetchGoogleReviews } from '../services/googleReviews';

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const googleReviews = await fetchGoogleReviews();
        setReviews(googleReviews);
        setError(null);
      } catch (err) {
        setError('Failed to load reviews');
        console.error('Reviews loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 0 1.669.743 1.669h1.682c.921 0 1.669.743 1.669s-.743 1.669-1.669 1.669zm-1.682 13.361h-1.682c-.921 0-1.669-.743-1.669-1.669s.743-1.669 1.669-1.669zm1.682 1.682h1.682c.921 0 1.669.743 1.669s-.743-1.669-1.669-1.669z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-300"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-2">Please check your internet connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center bg-pink-50 border border-pink-200 rounded-lg p-8">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-pink-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 0 1.669.743 1.669h1.682c.921 0 1.669.743 1.669s-.743 1.669-1.669 1.669zm-1.682 13.361h-1.682c-.921 0-1.669-.743-1.669-1.669s.743-1.669 1.669-1.669zm1.682 1.682h1.682c.921 0 1.669.743 1.669s-.743-1.669-1.669-1.669z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-pink-800 mb-2">Reviews Coming Soon</h3>
            <p className="text-pink-600">We're working on bringing you authentic Google Reviews. Check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real reviews from our valued customers in Nairobi</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4 mb-4">
                {review.profile_photo ? (
                  <img
                    src={review.profile_photo}
                    alt={review.author_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-pink-600 font-semibold text-lg">
                      {review.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{review.author_name}</h4>
                  <div className="flex items-center space-x-1 my-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 ml-2">({review.rating})</span>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-700 leading-relaxed mb-3">
                {review.review_text}
              </div>
              
              <div className="text-sm text-gray-500">
                {review.time}
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 0 && (
          <div className="text-center mt-8">
            <a
              href={`https://search.google.com/local/place?q=Floral+Whispers+Gifts+Nairobi`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17h2v-2h-2v2zm1-15h-2v2h2V4zm0 10h2v-2h-2v2z"/>
              </svg>
              View All Reviews on Google
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleReviews;
