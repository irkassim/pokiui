import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { User } from '../types/User'; // Define your user type in a separate file
import { useFetchUser, useFetchPhotos } from '../hooks/useFetch'; 
//import useFetchPhotos from '../hooks/useFetchPhotos';
import {ImageSlot } from '../types/ImageSlot'
import {UploadResponse } from '../types/ImageSlot'
import {UsersContextType} from '../types/User'
import { useNavigate } from 'react-router-dom';
//import api from '../utils/api'; // Import the Axios instance

/* type UpdateTextFields = (updates: Partial<User>) => Promise<{ success: boolean }>;
type UpdateImages = (formData: FormData) => Promise<{ success: boolean }>;
 */

export const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //const [user, setUser] = useState<User | null>(null);
  const [userPhotos, setUserPhotos] = useState<any | null>(null);
  const [images, setImages] = useState<ImageSlot[]>(Array(9).fill({ id: -1 , src: '' }));
  const [shldFetchPhotos, setShldFetchPhotos]=useState(false);
  const navigate = useNavigate();
 // const [refreshFlag, setRefreshFlag] = useState(false);

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const { user, setUser } = useFetchUser(accessToken, refreshToken);
 // user && console.log("userCon:", user)
  //const { photos: userPhotos, setPhotos: setUserPhotos } = useFetchPhotos(accessToken, refreshToken)
   const { photos, setPhotos } = useFetchPhotos(
    localStorage.getItem('accessToken'),
    localStorage.getItem('refreshToken'),shldFetchPhotos
  ); 
  
  const fetchPhotos = async () => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile/photos',
        { refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      );
      setUserPhotos(response.data.user.publicPhotos);
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  };

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      navigate('/login');
    }
  }, [accessToken, refreshToken]);

  /* useEffect(() => {
    if (shldFetchPhotos) {
      fetchPhotos();
      setShldFetchPhotos(false);
    }
  }, [shldFetchPhotos]);

  // Update images grid
      useEffect(() => {
      if(userPhotos){
        const updatedGrid = Array(9)
        .fill(null)
        .map((_, index) => userPhotos[index] || { id: -1, src: '' });

     setImages((prevImages) => {
    const isSame = prevImages.every((img, idx) => img.src === updatedGrid[idx]?.src);
    return isSame ? prevImages : updatedGrid;
  });
   }
  }, [userPhotos]); */
  
  return <UsersContext.Provider value={{ 
    user, setUser, images,userPhotos,setUserPhotos,
      photos, setPhotos,  
    setImages, shldFetchPhotos, setShldFetchPhotos,
      /* updateTextFields, updateImages  */}}>{children}
     </UsersContext.Provider>;
};

export const useUsersContext = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsersContext must be used within a UsersProvider');
  }
  return context;
};
