import React, { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import the Axios instance

const ProfileUpdate = () => {
  const [bio, setBio] = useState<string>('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preference, setPreference] = useState<string>('Everyone'); // New state
  const [gender, setGender] = useState<string>('Male'); // New state
  const navigate = useNavigate();

  //Submission of data to be updated
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      console.log(accessToken,refreshToken)
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('gender', gender);
      formData.append('preference', preference);
      //attaching refresh token to formData
      formData.append('refreshToken', refreshToken ||"");
      formData.append('avatar', avatar ||"")
    
      console.log(formData)
      
      /* for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      } */

      //making request to update profile
    const response=  await api.put('/api/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data', // Required for FormData
        },
      });

      console.log('Profile Update Success:', response.data);
      
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      updatedUser.isProfileComplete = true;
      updatedUser.preference = preference;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/home'); // Redirect to Home after profile update
    } catch (err) {
      console.error('Profile Update Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-xl font-bold text-center">Update Your Profile</h1>
        <textarea
          placeholder="Tell us about yourself"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
         <select
          value={gender}
          onChange={(e) => setGender(e.target.value)} // Update preference state
          className="w-full p-2 border rounded-md"
        >
          
          <option value="Male">Male </option>
          <option value="Female">Female </option>
          <option value="Everyone">non-binary</option>
          <option value="other">other</option>
        </select>
        
        <select
          value={preference}
          onChange={(e) => setPreference(e.target.value)} // Update preference state
          className="w-full p-2 border rounded-md"
        >
          <option value="Men">Man </option>
          <option value="Women">Woman </option>
          <option value="Everyone">Everyone</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          className="w-full p-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
