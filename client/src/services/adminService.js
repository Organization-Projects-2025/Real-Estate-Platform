import axios from 'axios';

// API Gateway URL - connects to all microservices
const API_URL = 'http://localhost:3000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// User Management
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/users`);
    console.log('Raw API response:', response); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_URL}/auth/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.patch(`${API_URL}/auth/users/${userId}`, userData);
  return response.data;
};

export const deactivateUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/auth/users/${userId}`);
  return response.data;
};

export const reactivateUser = async (userId) => {
  const response = await axios.patch(`${API_URL}/auth/users/${userId}/reactivate`);
  return response.data;
};

// Property Management
export const getAllProperties = async () => {
  const response = await axios.get(`${API_URL}/properties`);
  return response.data;
};

export const getPropertyById = async (propertyId) => {
  const response = await axios.get(`${API_URL}/properties/${propertyId}`);
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await axios.post(`${API_URL}/properties`, propertyData);
  return response.data;
};

export const updateProperty = async (propertyId, propertyData) => {
  const response = await axios.patch(
    `${API_URL}/properties/${propertyId}`,
    propertyData
  );
  return response.data;
};

export const deleteProperty = async (propertyId) => {
  const response = await axios.delete(`${API_URL}/properties/${propertyId}`);
  return response.data;
};

// Review Management
export const getAllReviews = async () => {
  const response = await axios.get(`${API_URL}/reviews`);
  return response.data;
};

export const getReviewById = async (reviewId) => {
  const response = await axios.get(`${API_URL}/reviews/${reviewId}`);
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await axios.patch(
    `${API_URL}/reviews/${reviewId}`,
    reviewData
  );
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axios.delete(`${API_URL}/reviews/${reviewId}`);
  return response.data;
};
