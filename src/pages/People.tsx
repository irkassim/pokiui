import React, { useState,useContext } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { FaBolt, FaMapMarkerAlt } from 'react-icons/fa'; // Icons for Boost and Explore
import { FeaturesContext } from '../context/FeaturesContext';

const People: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', avatar: '/path/to/avatar1.jpg', bio: 'Loves hiking and coffee' },
    { id: 2, name: 'Bob', avatar: '/path/to/avatar2.jpg', bio: 'Tech enthusiast and gamer' },
    { id: 3, name: 'Charlie', avatar: '/path/to/avatar3.jpg', bio: 'Dog lover and foodie' },
  ]);

  /*  const { matches, setMatches,
     pokes, setPokes, exploreStatus, 
     handlePoke, user,
    setExploreStatus, boostCount, 
    setBoostCount } = useContext(FeaturesContext); 

    console.log(pokes, matches, user ) */
  
  const [people, setPeople] = useState([
    { id: 1, name: 'Alice', bio: 'Loves hiking and movies', avatar: '/images/alice.jpg' },
    { id: 2, name: 'Bob', bio: 'Avid gamer and foodie', avatar: '/images/bob.jpg' },
    { id: 3, name: 'Charlie', bio: 'Tech enthusiast and coffee lover', avatar: '/images/charlie.jpg' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: string, userId: number) => {
    console.log(`Swiped ${direction} on user ${userId}`);
    if (direction === 'left') {
      console.log(`Skipped user ${userId}`);
     //  setMatches([...matches, people.find((p) => p.id === userId)]); 
    } else if (direction === 'right') {
      console.log(`Matched with user ${userId}`);
    }

    // Move to the next user
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const detectSwipeDirection = (offset: number, velocity: number): string => {
    if (velocity > 0.2 && offset > 100) return 'right';
    if (velocity < -0.2 && offset < -100) return 'left';
    return '';
  };

  const handleDragEnd = (_: any, info: PanInfo, userId: number) => {
    const direction = detectSwipeDirection(info.offset.x, info.velocity.x);

    if (direction) {
      handleSwipe(direction, userId);
    }
  };

  const pokeCurrentUser = () => {
    const currentUser = users[currentIndex];
    if (currentUser) {
     // handlePoke(currentUser.id);
    }
  };
 /*  // Handle poke functionality
  const handlePoke = (userId: number) => {
     setPokes([...pokes, people.find((p) => p.id === userId)]);
    console.log(`Poked user: ${userId}`);
  }; */

  // Handle explore functionality
  const handleExplore = () => {
    //setExploreStatus(!exploreStatus);
    //console.log(`Explore status: ${!exploreStatus}`); 
  };

  // Handle boost functionality
  const handleBoost = () => {
   /*  if (boostCount > 0) {
      setBoostCount(boostCount - 1);
      console.log('Boost activated!');
    } else {
      alert('No boosts left. Purchase more boosts!');
    }  */
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold my-4">Meet People</h1>

      {/* Card Stack */}
      <div className="relative w-full flex items-center justify-center mt-4" style={{ height: '500px' }}>
        {users
          .slice(currentIndex, currentIndex + 1)
          .map((user) => (
            <motion.div
              key={user.id}
              className="w-72 h-96 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center overflow-hidden absolute"
              style={{ zIndex: 10 }}
              drag="x"
              onDragEnd={(event, info) => handleDragEnd(event, info, user.id)}
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              whileDrag={{ scale: 1.05 }}
              exit={{ opacity: 0 }}
            >
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.name}
                className="w-full h-2/3 object-cover"
              />
              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
              </div>
            </motion.div>
          ))}
      </div>
        {/* Bottom Controls */}
        <div className="flex justify-between items-center w-full max-w-md mt-8 px-4">
        {/* Boost Button */}
        <button
          className="bg-yellow-500 p-4 rounded-full shadow-lg text-white hover:bg-yellow-600 transition"
          onClick={() => console.log('Boost activated!')} // Placeholder
        >
          <FaBolt size={24} />
        </button>

        {/* Poke Button */}
        <button
          className="bg-blue-500 p-4 rounded-full shadow-lg text-white hover:bg-blue-600 transition"
          onClick={pokeCurrentUser}
        >
          Poke
        </button>

        {/* Explore Button */}
        <button
          className="bg-green-500 p-4 rounded-full shadow-lg text-white hover:bg-green-600 transition"
          onClick={() => console.log('Explore activated!')} // Placeholder
        >
          <FaMapMarkerAlt size={24} />
        </button>
      </div>
    </div>
  );
};

export default People;
