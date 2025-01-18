import React, { useState, useEffect } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import { useSelector, useDispatch } from 'react-redux';
import { acceptMatch, rejectMatch } from '../reduxstore/slices/matchSlice';
import { RootState } from '../reduxstore/store'; // Assuming you have a RootState type for your Redux st
import axios from 'axios';
import { AppDispatch } from '../reduxstore/store'; // Import your AppDispatch type
import { motion, PanInfo } from 'framer-motion';

const UserPage: React.FC = () => {
  const { id: userId } = useParams(); // Extract userId from the route
  const location = useLocation();
  const matchId= new URLSearchParams(location.search).get('use'); // Extract matchId 
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [matchDetails, setMatchDetails] = useState<any>(null); // Match-specific data
  const accessToken = localStorage.getItem('accessToken');
  const dispatch: AppDispatch = useDispatch();
  const matchesState = useSelector((state: RootState) => state.matches); // Access matches from Redux store

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
       const url= `http://localhost:5000/api/profile/user/${userId}?use=${matchId}`
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data.user);
        setImages(response.data.user.publicPhotos || []);
        setMatchDetails(response.data.matchDetails || null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUserProfile();
  }, [userId, matchId]);

  //user && console.log("updateUserpage", user)
//  matchDetails && console.log("userMatch", matchDetails)
  //matchId && console.log("matchId", matchId)
 // matchesState && console.log("matchesState", matchesState)

  // Handle TinderCard swipe
  const handleSwipe = (direction: string) => {
    const nextIndex = currentImageIndex + 1;
    if (nextIndex >= images.length) {
      setCurrentImageIndex(0); // Reset to first image
    } else {
      setCurrentImageIndex(nextIndex);
    }
  };

  // Dispatch accept match
  const handleAcceptMatch = () => {
    console.log('Accept button clicked');
    if (matchId) {
      const sendRes=   dispatch(acceptMatch(matchId) as any );
      console.log("Match Accept Successfully",  sendRes)
    }
  };

  // Dispatch reject match
  const handleRejectMatch = () => {
    console.log("Reject", matchId)
    console.log('Reject button clicked');
     if (matchId) {
      console.log("Reject", matchId)
     const sendRes= dispatch(rejectMatch(matchId) as any );
      console.log("Match Rejected Successfully", sendRes)
    } 
  };
  const handleDragEnd = (_: any, info: PanInfo, userId: number) => {
      console.log('Drag ended:', userId, info.offset.x > 0 ? 'right' : 'left');
    };

  // Conditional rendering for loading
  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4">{user.firstName}'s Profile </h1>

      {/* TinderCard Section */}
      <div className="relative mb-6 flex flex-col items-center" style={{ height: '400px' }}>
        <div className="tinder-card-container w-full max-w-lg flex justify-center mb-4">
          {images.map((image, index) => (
            <TinderCard
              key={`${image}-${index}-${currentImageIndex}`} // Ensure unique keys for re-rendering
              className={`absolute ${index === currentImageIndex ? 'z-10' : 'z-0'}`}
              onSwipe={handleSwipe}
              preventSwipe={['up', 'down']}
            >
              <div
                className="bg-white shadow-lg rounded-lg flex items-center justify-center"
                style={{ backgroundImage: `url(${image})`,backgroundSize: 'cover',backgroundPosition: 'center',
                  height: '400px', width: '300px',}}>
                {/* Footer overlay */}
                <div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-sm p-2 rounded-b-lg w-full">
                  <p>{matchDetails?.duration || ''}</p>
                  <p>{matchDetails?.commonInterests || ''}</p>
                </div>
              </div>
            </TinderCard>
           ))}
          </div>
        
        </div>

      {/* Match Actions */}
     {/*  {matchDetails && (
        <div className="flex justify-between items-center w-full max-w-lg mb-4">
          {matchDetails.status === 'pending' ? (
            <button
               onClick={handleAcceptMatch} 
              className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Accept Match
            </button>
          ) : (
            <p className="text-green-500 font-bold">Match Accepted</p>
          )}
          <button
          onClick={handleRejectMatch}
           className="bg-red-500 text-white px-4 py-2 rounded-lg">Reject Match</button>
        </div>
      )} */}

      {/* User Details */}
       <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">About {user.firstName}</h2>
        <p><strong>Bio:</strong> {user.bio || 'N/A'}</p>
        <p><strong>Dating Goals:</strong> {user.datingGoals || 'N/A'}</p>
        <p><strong>Education:</strong> {user.education || 'N/A'}</p>
        <p><strong>Occupation:</strong> {user.occupation || 'N/A'}</p>
      </div> 

      {/* Interests Section */}
       <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Interests</h2>
        <p><strong>Zodiac Signs:</strong> {user.zodiacSigns?.join(', ') || 'N/A'}</p>
        <p><strong>Hobbies:</strong> {user.hobbies?.join(', ') || 'N/A'}</p>
      </div> 

      {/* Memories Section */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Memories</h2>
        <ul>
          {user.memories?.length
            ? user.memories.map((memory: string, idx: number) => <li key={idx}>{memory}</li>)
            : 'No memories available.'}
        </ul>
      </div>
    </div>
  );
};

export default UserPage;
