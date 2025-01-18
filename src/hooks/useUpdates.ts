import axios from 'axios';
import {UploadResponse } from '../types/ImageSlot'

/* interface UploadResponse {
  imageId: number;
  success: boolean;
  imageUrl: string;
  publicPhotos?: Array<{
    id: number;
    signedUrl: string;
    src: string;
  }>;
} */

const useUpdates = (accessToken: string | null, refreshToken: string | null) => {
  const updateTextFields = async (updates: any): Promise<{ success: boolean }> => {

    //console.log("USEUPDATES:", updates)
    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile/update-text',
        {updates, refreshToken},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Text Update Response:', response);

      if (response.data.user) {
        return { success: true };
      } else {
        console.error('Failed to receive updated user data:', response.data);
        return { success: false };
      }
    } catch (error) {
      console.error('Failed to update text fields:', error);
      return { success: false };
    }
  };

  const updateImages = async (formData: FormData): Promise<UploadResponse> => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile/update-images',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      console.log('Image Update Response:', response);
      return response.data as UploadResponse;
    } catch (error) {
      console.error('Error updating images:', error);
      throw error;
    }
  };

  return { updateTextFields, updateImages };
};

export default useUpdates;
