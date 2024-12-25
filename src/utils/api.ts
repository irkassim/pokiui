import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

/* const api = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend's base URL
}); */

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Request interceptor to attach the access token
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('accessToken');

  // Check token expiration
  if (token) {
    const { exp } = jwtDecode(token) as { exp: number };
    if (Date.now() >= exp * 1000) {
      try {
        // Silent token renewal
        const refreshToken = localStorage.getItem('refreshToken');
      
        const response = await axios.post('http://localhost:5000/api/auth/refresh', { token: refreshToken });
        token = response.data.accessToken;

        // Update token in localStorage
        //localStorage.setItem('accessToken', token);
        if(token){
          localStorage.setItem('accessToken', token);
        }else {
          console.error('Failed to retrieve new access token.');
        }
      } catch (error) {
        console.error('Token renewal failed:', error);
        // Optional: Handle logout if token renewal fails
      }
    }
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('Request Config:', config);
  return config;
});


export default api;
