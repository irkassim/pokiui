import React, { useState,useContext, useEffect } from 'react';
import  {motion}  from "motion/react"
import { PanInfo } from "framer-motion";

import axios from 'axios';
import TinderCard from 'react-tinder-card';
import { useAuth } from '../context/AuthContext';
import { Carousel } from '../components/Carousel'; 
//import  LocationModal from '../components/LocationModal'; 
import  GeneralModal from '../components/GeneralModal'; 

const ProfilePage: React.FC = () => {
  //const { user } = useContext(UsersContext);
  const [user, setUser] = useState<any>(null);
  //const [showLocationModal, setShowLocationModal] = useState(true);

  const publicImages = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg',
  ]; // Example public images
  const images = [
    { id: 1, src: '/images/img1.jpg' },
    { id: 2, src: '/images/img2.jpg' },
    { id: 3, src: '/images/img3.jpg' },
  ];

  const recentMemories = [
    'Uploaded a photo at the park',
    'Shared a video with Alex',
    'Added a new memory',
    'Updated a hidden memory',
    'Uploaded a group photo',
  ]; // Example recent memories
  const handleSwipe = (direction: string, imageId: number) => {
    console.log(`Swiped ${direction} on image ${imageId}`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
    
      if (accessToken || refreshToken) {
        try {
          const response = await axios.post('http://localhost:5000/api/profile/user', 
            { refreshToken }, // Send in the body
            {headers: { Authorization: `Bearer ${accessToken}` },});
          setUser(response.data);   
          console.log("Response Data",response.data)
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };
    
    fetchUser();
  }, []);
        
  if(user){
    console.log(user)
  }

  //HandledragTinder
  const handleDragEnd = (
   event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    userId: string
  ) => {
    console.log(`Swiped! Offset: ${info.offset.x}, Velocity: ${info.velocity.x}, User ID: ${userId}`);
  };
  

    // Conditional rendering to avoid accessing `user` when null
    if (!user) {
      return <div>Loading profile...</div>; // Show a loading indicator until `user` is fetched
    }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 overflow-y-auto ">
    <h1 className="text-3xl font-bold mb-4">User's Profile</h1>
             
    <div className="relative z-10 mb-0">
  <div className="tinder-card-container w-full max-w-lg mx-auto">
  <h1>{user.firstName} {user.lastName}</h1>
   
    {/* Tinder Card */}
    {images.map((image, index) => (
        <TinderCard
          key={image.id}
          className="absolute"
          onSwipe={(dir) => handleSwipe(dir, image.id)}
          preventSwipe={['up', 'down']}
        >
          <div
            className="bg-white shadow-lg rounded-lg flex items-center justify-center"
            style={{
              backgroundImage: `url(${image.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '400px',
              width: '300px',
            }}
          ></div>
        </TinderCard>
      ))}
    <motion.div
      key={user?.id}
      className="w-72 h-96 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 10 }}
      drag="x"
      onDragEnd={(event, info) => handleDragEnd(event, info, user.id)}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      whileDrag={{ scale: 1.05 }}
      exit={{ opacity: 0 }}
    >
  {/* Profile Details */}
  <div className="profile text-center p-4">
    <h1 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h1>
     {user?.avatar ? (
      <img
     
       src={`http://localhost:5000/${user.avatar}`}
     
        alt={`${user?.firstName}'s avatar`}
        className="w-32 h-32 rounded-full shadow-lg my-4"
      />
    ) : (
      <p className="text-sm text-gray-500">No avatar available</p>
    )} 
  </div>

  {/* Bio or Additional Info */}
  <div className="text-sm text-gray-600">
    <p>{user?.bio || 'No bio available'}</p>
  </div>
</motion.div>

  </div>
  {/* Spacer */}
  <div className="mt-10"></div>
  
</div>


    {/* Relevant Section */}
    <div className="w-full relative z-0 max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6 ">
      <h2 className="text-xl font-bold mb-2">Relevant</h2>
      <p><strong>Bio:</strong> {user.bio}</p>
      <p><strong>Occupation:</strong> Software Developer</p>
      <p><strong>Location:</strong> New York, USA</p>
    </div>

    {/* Interest Section */}
    <div className="w-full relative z-0 max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-2">Interests</h2>
      <p><strong>Zodiac Sign:</strong> Scorpio</p>
      <p><strong>Favorite Movies:</strong> Inception, The Dark Knight</p>
      <p><strong>Favorite Music:</strong> Jazz, Pop</p>
      <p><strong>Hobbies:</strong> Painting, Reading</p>
    </div>

    {/* Memories Section */}
    <div className="w-full relative z-0 max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-2">Memories</h2>
      <ul>
        <li>Shared a memory with Alice</li>
        <li>Shared a memory with Bob</li>
        <li>Added a hidden memory</li>
      </ul>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">
        Access Vault
      </button>
    </div>

    {/* Account Information Section */}
    <div className="w-full relative z-0 max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-2">Account Information</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Subscription:</strong> Premium</p>
      <button className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4">
        Edit
      </button>
    </div>
  </div>)
};

export default ProfilePage;
