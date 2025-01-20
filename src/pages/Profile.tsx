import React, { useState,useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanInfo } from "framer-motion";
import axios from 'axios';
//import { useAuth } from '../context/AuthContext';
import {useFetchUser} from '../hooks/useFetch'; 
import { useUsersContext } from '../context/UsersContext';
//import {ImageSlot } from '../types/ImageSlot'
//import  LocationModal from '../components/LocationModal'; 
//import  GeneralModal from '../components/GeneralModal'; 

const ProfilePage: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined); 
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const { user, setUser, loading } = useFetchUser(accessToken, refreshToken);
   const { images, setImages, photos, setShldFetchPhotos  } = useUsersContext();
   const navigate = useNavigate();
  //const [showLocationModal, setShowLocationModal] = useState(true);
 /*  
  user && console.log("profboy:", user)
  photos && console.log("proPhotos:", photos)
 */
   //Setting Images from userPhotos
      useEffect(() => {
        if (photos) {
          const updatedGrid = Array(9)
            .fill(null)
            .map((_, index) => photos[index] || { id: -1, src: '' });
            
          // Only update state if there is an actual change
          setImages((prevImages) => {
            const isSame = prevImages.every((img, idx) => img.src === updatedGrid[idx]?.src);
            if (!isSame) {
              return updatedGrid;
            }
            return prevImages;
          });
        }
      }, [photos]); // No need to include images
      
//Getting uSER PHOTOS
    useEffect(() => {
        if (user && photos.length > 0) {
          // Search for the avatar photo in userPhotos
          const avatarPhoto = photos.find((photo:any) => photo._id === user.avatar);
          if (avatarPhoto) {
            setAvatarUrl(avatarPhoto.src  ); // Use the signed URL or fallback to the direct URL
          } else {
            setAvatarUrl(undefined); // Clear avatar if no match is found
          }
        }
      }, [user, photos]); 
         

  //construct image URL
  //user.avatarUrl = `https://pokistorage.s3.eu-central-1.amazonaws.com/${user.avatar}`;


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
             
     {/* Header */}
  <div className="w-full max-w-lg flex justify-between items-center mb-4">
    <button
      onClick={()=>navigate('/profile/update')}
     className="bg-green-500 text-white py-2 px-4 rounded-lg">
      Edit</button>
    <div className="border-l h-full mx-2"></div>
  </div>

  {/* Image Grid */}
  <div
    className="grid grid-cols-3 gap-4 mb-9 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
    style={{ height: '600px' }}
  >
    {/* Ensure all 9 slots are displayed */}
    {photos && images?.map((photo: any, index: number) => (
      <div key={index} className="relative bg-gray-200 h-40 flex items-center justify-center border rounded-lg">
        {photo.src ? (
          <div className="relative bg-gray-200 h-40 flex items-center justify-center border rounded-lg">
            <img
              src={photo.src}
              alt={`Slot ${index}`}
              className="h-full w-full object-cover rounded-lg"
            />
    
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full text-gray-500 text-xl">
            Empty
          </div>
        )}
      </div>
    ))}
  </div>


    {/* Relevant Section */}
   <div className="w-full relative z-0 max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6 ">
      <h2 className="text-xl font-bold mb-2">Relevant</h2>
     {user &&  <p><strong>Bio:</strong> {user.bio || " no bio"}</p>}
      <p><strong>Dating Goals:</strong> {user.datingGoals}</p>
      <p><strong>Education:</strong> {user.education}</p>
      <p><strong>Occupation:</strong> {user.occupation || "N/A"}</p>
    </div>

    {/* Interest Section */}
   {user &&( <div className="w-full relative z-0 max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-2">Interests</h2>
      <p><strong>Zodiac Signs:</strong> {user.zodiacSigns}</p>
      <p><strong>Hobbies:</strong> {user.hobbies},</p>
      <p><strong>Favorite :</strong>{user.favorite?.category} Right Now is {user.favorite?.value}</p>
     
    </div>)}

    <div className="w-full relative z-0 max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-2">  Comapatibility test</h2>
      <p>Answer these questions to find to help us find you the best match 😊 </p>
      
      <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
       onClick={()=>navigate("/questions")}>
      start
      </button>
    </div> 

    {/* Memories Section */}
   {/*  <div className="w-full relative z-0 max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-2">Memories</h2>
      <ul>
        <li>Shared a memory with Alice</li>
        <li>Shared a memory with Bob</li>
        <li>Added a hidden memory</li>
      </ul>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">
        Access Vault
      </button>
    </div> */}

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
