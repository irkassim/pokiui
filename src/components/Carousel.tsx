import React from 'react';
import { motion } from 'framer-motion';

interface CarouselProps {
  images: string[];
}

export const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <div className="relative w-full h-64 bg-gray-200 rounded overflow-hidden">
      <motion.div
        className="flex"
        drag="x"
        dragConstraints={{ left: -((images.length - 1) * 300), right: 0 }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-64 h-64 flex-shrink-0 flex items-center justify-center"
          >
            <img
              src={image}
              alt={`Public Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
