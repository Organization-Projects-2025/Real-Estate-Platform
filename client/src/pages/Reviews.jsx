import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUser, FaBuilding } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/reviews');
      const data = await response.json();
      
      if (data.status === 'success') {
        setReviews(data.data.reviews);
      } else {
        setError('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className="text-xl"
        color={index < rating ? '#FFD700' : '#4B5563'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#703BF7]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-red-500 text-center">
            <p className="text-xl mb-4">{error}</p>
            <button
              onClick={fetchReviews}
              className="bg-[#703BF7] text-white px-6 py-2 rounded-lg hover:bg-[#5f2cc6] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
              Reviews
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover what our clients have to say about their experience with our agents
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No reviews yet. Be the first to write one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#1a1a1a] rounded-lg p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-[#333] hover:border-[#703BF7]"
              >
                {/* Agent Section */}
                <div className="mb-6 pb-6 border-b border-[#333]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#703BF7] p-2 rounded-full">
                      <FaUser className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#703BF7]">
                        {review.agent ? `${review.agent.firstName} ${review.agent.lastName}` : 'Unknown Agent'}
                      </h3>
                      <p className="text-sm text-gray-400">Real Estate Agent</p>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-[#703BF7]" />
                      <span className="text-gray-300">{review.reviewerName}</span>
                    </div>
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-gray-300 text-center italic mb-4">"{review.reviewText}"</p>
                  <div className="text-sm text-gray-400 text-right">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/write-review"
            className="inline-block bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] text-white px-8 py-3 rounded-lg hover:from-[#5f2cc6] hover:to-[#703BF7] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Write a Review
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reviews; 