import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPeople, resetPeople } from '../reduxstore/slices/peopleSlice';
import { RootState, AppDispatch } from '../reduxstore/store';
import { FaBolt, FaMapMarkerAlt, FaUndo, FaHeart, FaTimes, FaHandPointRight, FaTelegramPlane } from "react-icons/fa";
import CustomTinderCard from '../components/TinderCard'; // Custom TinderCard component
import { fetchUserProfile } from '../reduxstore/slices/userSlice';

// Define the User interface
interface User {
  _id: string;
  firstName: string;
  publicPhotos: string[];
  bio: string;
  hobbies: string[];
  distance: number;
}

const People: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { users, currentPage, totalPages, loading, } = useSelector((state: RootState) => ({
    ...state.people,
    //currentUser: state.user.user,
  }));

  useSelector( (state: RootState) =>
    state.people);
 const currentUser = useSelector((state: RootState) => state.user.user);
  
    // Dispatch fetchUserProfile on app load
    useEffect(() => { 
      if (!currentUser) {
        dispatch(fetchUserProfile() as any);
      }
  
  }, [dispatch, currentUser]);
 
  //UserParams
  const latitude= 5.7297233
  const longitude=  -0.1847117
  const userId =currentUser?.user?._id

  currentUser && console.log("CurrentUserPeople:", currentUser, currentUser.user?.userPreferences.maxDistance,
    currentUser.user?.userPreferences.ageRange, currentUser.user?._id )

  users && console.log("The Users", users)
  // Fetch users on mount
  useEffect(() => {
    if (userId && latitude && longitude) {
      dispatch(resetPeople()); // Reset state when visiting this page
      dispatch(fetchPeople({ userId, latitude, longitude, page: currentPage }));
    } else {
      console.error('Missing required parameters: userId, latitude, or longitude');
    }
  }, [dispatch, userId, latitude, longitude, currentPage]);

  // Infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages && !loading) {
          userId &&  dispatch(fetchPeople({ userId, latitude, longitude, page: currentPage + 1 }));
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [dispatch, currentPage, totalPages, loading, userId, latitude, longitude]);

 /*  const handleDragEnd = (_: any, info: PanInfo, userId: number) => {
    console.log('Drag ended:', userId, info.offset.x > 0 ? 'right' : 'left');
  };
 */

  const handleSwipe = (direction: string) => {
    console.log(`Swiped ${direction} on user ${users[currentIndex]}`);
    if (direction === 'left' ) {
      console.log(" left, user rejected")
      setCurrentIndex((prev) => (prev + 1 < users.length ? prev + 1 : 0)); // Loop back to the first user if end

    }else if( direction === 'right'){
      console.log(" right, user accepted")
      setCurrentIndex((prev) => (prev + 1 < users.length ? prev + 1 : 0))
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 0) {
      handleSwipe('right');
    } else {
      handleSwipe('left');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold my-4">Meet People</h1>

      {/* TinderCard Display */}
      <div className="relative w-full flex flex-col items-center" style={{ height: '500px' }}>
        {users.slice(currentIndex, currentIndex+1).map((user: any) => (
          <CustomTinderCard key={user._id}
          onSwipeComplete={handleSwipe}
          user={user} />
        ))}
        <div ref={observerRef} className="w-full h-1" />
      </div> 

      {/* Controls */}
      <div className="flex justify-between items-center w-full max-w-lg mt-6 px-4">
        <button className="bg-purple-500 p-4 rounded-full text-white"><FaUndo size={24} /></button>

        <button className="bg-gray-500 p-4 rounded-full text-white"><FaTimes size={24} /></button>

        <button className="bg-yellow-500 p-4 rounded-full text-white"><FaBolt size={24} /></button>

        <button className="bg-orange-500 p-4 rounded-full text-white"><FaHandPointRight size={24} />Poke</button>

        <button className="bg-green-500 p-4 rounded-full text-white"><FaHeart size={24} /></button>
        <button className="bg-blue-500 p-4 rounded-full text-white"><FaTelegramPlane size={24} /></button>

        <button className="bg-indigo-500 p-4 rounded-full text-white"><FaMapMarkerAlt size={24} /></button>
      </div>

      {loading && <p>Loading more users...</p>}
    </div>
  );
};

export default People;
