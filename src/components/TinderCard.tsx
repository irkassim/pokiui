import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface TinderCardProps {
  user: {
    _id: string;
    firstName: string;
    bio: string;
    hobbies: string[];
    publicPhotos: string[];
    distance: number;
  };
  onSwipeComplete: (direction: string) => void;
}

const CustomTinderCard: React.FC<TinderCardProps> = ({ user, onSwipeComplete }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Motion values
  const x = useMotionValue(0); // Track horizontal position
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]); // Map `x` to rotation degrees
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]); // Adjust opacity during dragging

  // Swipe feedback based on `x`
  const swipeFeedback = useTransform(x, [-200, 200], ['Nope', 'Yup']);

  const nextPhoto = () => {
    setActivePhotoIndex((prevIndex) => (prevIndex + 1) % user.publicPhotos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prevIndex) => (prevIndex - 1 + user.publicPhotos.length) % user.publicPhotos.length);
  };

  // Handle drag end and determine swipe direction
  const handleDragEnd = (_:any, info: { offset: { x: number } }) => {
    const swipeThreshold = 150; // Threshold to trigger swipe

    if (info.offset.x > swipeThreshold) {
      onSwipeComplete('right'); // Swiped right
    } else if (info.offset.x < -swipeThreshold) {
      onSwipeComplete('left'); // Swiped left
    }else {
        x.set(0); // Reset to original position if not discarded
      }
  };

  return (
    <motion.div
      className="w-72 h-96 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center overflow-hidden"
      drag="x"
      dragElastic={0.7}
      dragConstraints={{ left: 0, right: 0 }} // Limit drag movement
      style={{ x, rotate, opacity }} // Apply motion values
      onDragEnd={handleDragEnd} // Handle end of drag
      whileHover={{ cursor: 'grab' }} // Add hover effect
    >
      {/* Toast for swipe feedback */}
      <motion.div
        className={`absolute top-4 ${
          swipeFeedback.get() === 'Nope' ? 'text-red-500' : 'text-green-500'
        } text-2xl font-bold`}
      >
        {swipeFeedback.get()}
      </motion.div>

      {/* User photo */}
      <div className="relative w-full h-2/3 hover:cursor-grab active:cursor-grabbing">
        <img
          src={user.publicPhotos[activePhotoIndex]}
          alt={`${user.firstName}'s photo`}
          className="w-full h-full object-contain pointer-events-none" // Ensure the image doesn't block drag
        />
        {user.publicPhotos.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between">
            <button
              className="bg-white p-2 rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
            >
              &#8592;
            </button>
            <button
              className="bg-white p-2 rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
            >
              &#8594;
            </button>
          </div>
        )}
      </div>

      {/* User info */}
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold">{user.firstName}</h2>
        <p className="text-sm text-gray-600">
          {user.bio.length > 50 ? `${user.bio.slice(0, 50)}...` : user.bio}
        </p>
        <p className="text-sm text-gray-500">{user.hobbies[0] || 'No hobbies listed'}</p>
        <p className="text-sm text-gray-500">{user.distance} km away</p>
      </div>
    </motion.div>
  );
};

export default CustomTinderCard;
