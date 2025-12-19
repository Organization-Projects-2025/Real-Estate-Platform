import axios from 'axios';

// API Gateway URL - connects to all microservices
const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email: email.trim(),
      password: password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    throw {
      response: {
        status: 500,
        data: {
          message: 'Network error. Please try again.',
        },
      },
    };
  }
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};
