import { useState, useEffect } from 'react';
import pickFile from '../utils/picker';
import useUpdates from './useUpdates';
import {ImageSlot } from '../types/ImageSlot'

const useUpload = (accessToken: string | null, refreshToken: string | null) => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { updateImages } = useUpdates(accessToken, refreshToken);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleImageUpload = async (index: number, setImages: React.Dispatch<React.SetStateAction<ImageSlot[]>>) => {
    try {
      const file = await pickFile(); // Custom file picker logic
      if (!file) {
        console.warn("No file selected for upload.");
        return;
      }
  
      const formData = new FormData();
      formData.append("publicPhoto", file);
      formData.append("refreshToken", refreshToken ?? "");
  
      const response = await updateImages(formData);
  
      if (!response || !response.publicPhotos || response.publicPhotos.length === 0) {
        console.error("No updated photos returned in response.");
        return;
      }
  
  // Get all public photos with the newly uploaded photo highlighted
  const publicPhotos = response.publicPhotos;
  console.log("Updated Public Photos:", publicPhotos);

      // Update grid state
      // Update grid state
    setImages(() => {
      const updatedGrid = Array(9).fill({ id: -1, src: '' });
      publicPhotos.forEach((photo, idx) => {
        if (idx < 9) {
          updatedGrid[idx] = {
            id: photo._id,
            src: photo.src,
          };
        }
      });
      return updatedGrid;
    });
      console.log("Image uploaded successfully:", );
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    }
  };
  

 /*  useEffect(() => {
    console.log("Grid refreshed!");
  }, [refreshFlag]); */

  return { handleImageUpload, uploadError,setRefreshFlag, refreshFlag };
};

export default useUpload;
