import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import axios from 'axios';

const UserPage: React.FC = () => {
  const { id } = useParams(); // Get the user ID from the route
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  console.log("ID:", id)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:5000/api/profile/user/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const { user } = response.data;
        setUser(user);
        setImages(user.publicPhotos || []);
      } catch (error:any) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleSwipe = (direction: string, imageId: string) => {
    console.log(`Swiped ${direction} on image ${imageId}`);
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4">{user.firstName}'s Profile</h1>

      {/* Tinder Card for Photos */}
      <div className="relative z-10 mb-4">
        <div className="tinder-card-container w-full max-w-lg mx-auto">
          {images.length > 0 ? (
            images.map((image, index) => (
              <TinderCard
                key={index}
                className="absolute"
                onSwipe={(dir) => handleSwipe(dir, image)}
                preventSwipe={['up', 'down']}
              >
                <div
                  className="bg-white shadow-lg rounded-lg flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '400px',
                    width: '300px',
                  }}
                ></div>
              </TinderCard>
            ))
          ) : (
            <p>No public photos available</p>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-2">About {user.firstName}</h2>
        <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
        <p><strong>Dating Goals:</strong> {user.datingGoals || 'Not specified'}</p>
        <p><strong>Education:</strong> {user.education || 'Not specified'}</p>
        <p><strong>Occupation:</strong> {user.occupation || 'Not specified'}</p>
      </div>

      {/* Interests Section */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-2">Interests</h2>
        <p><strong>Zodiac Signs:</strong> {user.zodiacSigns.join(', ') || 'None'}</p>
        <p><strong>Hobbies:</strong> {user.hobbies.join(', ') || 'None'}</p>
      </div>
    </div>
  );
};

export default UserPage;
