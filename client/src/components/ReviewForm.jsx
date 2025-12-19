import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaUser, FaBuilding } from 'react-icons/fa';
import Navbar from './Navbar';
const ReviewForm = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [hover, setHover] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchAgents();
    setIsLoading(false);
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/agents');
      const data = await response.json();
      if (data.status === 'success') {
        setAgents(data.data.agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Failed to load agents. Please try again later.');
    }
  };

  const handleAgentSelect = (e) => {
    const agentId = e.target.value;
    setSelectedAgent(agentId);
    const agent = agents.find(a => a._id === agentId);
    setSelectedAgentDetails(agent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAgent || !rating || !reviewText || !reviewerName) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: selectedAgent,
          reviewerName,
          rating,
          reviewText,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setSuccess('Review submitted successfully!');
        setRating(0);
        setReviewText('');
        setReviewerName('');
        setSelectedAgent('');
        setSelectedAgentDetails(null);
        // Redirect to reviews page after 2 seconds
        setTimeout(() => {
          navigate('/reviews');
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#703BF7] mx-auto mb-4"></div>
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
            Write a Review
          </span>
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Your Name</label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#703BF7]"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Select Agent</label>
            <select
              value={selectedAgent}
              onChange={handleAgentSelect}
              className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#703BF7]"
              required
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.firstName} {agent.lastName}
                </option>
              ))}
            </select>
          </div>

          {selectedAgentDetails && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333] mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#703BF7] p-3 rounded-full">
                  <FaUser className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#703BF7]">
                    {selectedAgentDetails.firstName} {selectedAgentDetails.lastName}
                  </h3>
                  <p className="text-gray-400">Real Estate Agent</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <FaBuilding className="text-[#703BF7]" />
                <span>{selectedAgentDetails.properties?.length || 0} Properties Listed</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Rating</label>
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="text-2xl cursor-pointer"
                    color={ratingValue <= (hover || rating) ? '#FFD700' : '#4B5563'}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#703BF7] min-h-[150px]"
              placeholder="Write your review here..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] text-white py-3 rounded-lg hover:from-[#5f2cc6] hover:to-[#703BF7] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm; 