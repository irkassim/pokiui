import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../utils/api'; // Import the Axios instance
import { useAuth } from '../context/AuthContext';

// Signup Component
const Signup: React.FC = () => {
   // State for input fields
   const navigate = useNavigate(); // Hook for navigation
   //const [username, setUsername] = useState<string>(''); // Username state
   const [fName, setFName] = useState<string>(''); // first state
   const [lName, setLName] = useState<string>(''); // first state
   const [email, setEmail] = useState<string>(''); // Email state
   const [password, setPassword] = useState<string>(''); // Password state
   const [dateOfBirth, setDateOfBirth] = useState<string>(''); // Date of Birth state
   const [error, setError] = useState<string | null>(null); // Error state

    //Prevent accident signup whilst loggedin
/*     const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" />; // Redirect logged-in users to the homepage
  }
 */
  //a dummy location
  const location =  {
    type: "Point",
    coordinates: [0, 0] // Default coordinates
  };
  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form behavior
    setError(null); // Clear previous errors

    try {
      // API call to register user
      console.log(email,password)
   const request =   await api.post('/api/auth/signup', {
       
        email,
        password,
        dateOfBirth,
        firstName:fName,
        lastName:lName,
        location
      });
      console.log(request)

      // Redirect to login on success
      navigate('/login');
    } catch (err: any) {
      // Handle errors from backend or validation
      
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      console.log(err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
     
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
      <h1 className="text-2xl font-bold text-center mb-6">Signup</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">

{/* firstName Input */}
<input
 type="text"
 placeholder="first name"
 value={fName}
 onChange={(e) => setFName(e.target.value)} // Update username state
 className="input-field"
 required
/>

{/* lastname Input */}
<input
 type="text"
 placeholder="last name"
 value={lName}
 onChange={(e) => setLName(e.target.value)} // Update username state
 className="input-field"
 required
/>
{/* Username Input 
<input
 type="text"
 placeholder="Username"
 value={username}
 onChange={(e) => setUsername(e.target.value)} // Update username state
 className="input-field"
 required
/>*/}

{/* Email Input */}
<input
 type="email"
 placeholder="Email"
 value={email}
 onChange={(e) => setEmail(e.target.value)} // Update email state
 className="input-field"
 required
/>

{/* Password Input */}
<input
 type="password"
 placeholder="Password"
 value={password}
 onChange={(e) => setPassword(e.target.value)} // Update password state
 className="input-field"
 required
/>

{/* Date of Birth Input */}
<input
 type="date"
 placeholder="Date of Birth"
 value={dateOfBirth}
 onChange={(e) => setDateOfBirth(e.target.value)} // Update DOB state
 className="input-field"
 required
/>

{/* Submit Button */}
<button type="submit" className="btn-primary">
 Signup
</button>
</form>

{/* Error Display */}
{error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;
