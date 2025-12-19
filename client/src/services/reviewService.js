import axios from 'axios';

// API Gateway URL - connects to all microservices
const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getRandomReviews = async (limit = 3) => {
  try {
    const response = await api.get(`/reviews/random?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random reviews:', error);
    throw error;
  }
};
