import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types/User';
import { ImageSlot } from '../types/ImageSlot';

export const useFetchUser = (accessToken: string | null, refreshToken: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken || refreshToken) {
        try {
          const response = await axios.post('http://localhost:5000/api/profile/user', 
            { refreshToken },
            { headers: { Authorization: `Bearer ${accessToken}` } });
          setUser(response.data.user);
        } catch (err) {
          console.error('Error fetching user:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [accessToken, refreshToken]);

  return { user, setUser, loading };
  
};


//Fetching User Photos
export const useFetchPhotos = (accessToken: string | null, refreshToken: string | null):{ photos: ImageSlot[] | []; setPhotos: React.Dispatch<React.SetStateAction<ImageSlot[] |[] >> } => {
  const [photos, setPhotos] = useState<ImageSlot[] | []>([]);
 

  useEffect(() => {
    const fetchPhotos = async () => {
      if (accessToken || refreshToken) {
        try {
          const response = await axios.put(
            'http://localhost:5000/api/profile/photos',
            { refreshToken },
            { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
          );
          setPhotos(response.data.user.publicPhotos);
        } catch (err) {
          console.error('Error fetching photos:', err);
        }
      }
    };
    fetchPhotos();
  }, [accessToken, refreshToken, ]);

  return  { photos, setPhotos, };
};


