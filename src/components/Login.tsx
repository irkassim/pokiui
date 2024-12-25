import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import the Axios instance
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';



// Login Component
const Login = () => {
  const [email, setEmail] = useState<string>(''); // State for email input
  const [password, setPassword] = useState<string>(''); // State for password input
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const navigate = useNavigate(); // Hook to navigate between pages
  const { login } = useAuth(); // Access login function from AuthContext
  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await api.post('/api/auth/login', { email, password });
  
      console.log('Login Response:', response.data);
      const { accessToken, refreshToken } = response.data.token;
  
      // Save tokens to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
  
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
  
      // Update AuthContext
      login(accessToken);
      navigate('/home');
    } catch (err: any) {
      console.error('Login Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };
  
  return (
    <div  className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          className="input-field"
        />
        <button type="submit" className="btn-primary">Login</button>
      </form>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error */}
    </div>
  );
};

export default Login;
