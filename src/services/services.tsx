import axios from 'axios';

// Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle a poke action
export const sendPoke = async (userId: string) => {
  try {
    const response = await api.post(`/poke`, { targetUserId: userId });
    return response.data;
  } catch (error: any) {
    console.error('Error sending poke:', error.response?.data || error.message);
    throw error;
  }
};

// Handle a match action
export const registerMatch = async (userId: string) => {
  try {
    const response = await api.post(`/match`, { targetUserId: userId });
    return response.data;
  } catch (error: any) {
    console.error('Error registering match:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
