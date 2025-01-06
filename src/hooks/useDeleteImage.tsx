import { useState } from 'react';
import axios from 'axios';

interface UseDeleteImageReturn {
  deleteImage: (imageId: number, index: number) => Promise<void>;
  isDeleting: boolean;
}

const useDeleteImage = (accessToken: string | null, refreshToken: string | null, images: any[], setImages: React.Dispatch<React.SetStateAction<any[]>>): UseDeleteImageReturn => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteImage = async (imageId: number, index: number): Promise<void> => {
    if (!images || imageId === -1) {
      console.log("No image in this slot to delete.");
      return;
    }

    try {
      setIsDeleting(true);

      // Backend call to delete the image
      const response = await axios.delete(`http://localhost:5000/api/profile/delete-image`, {
        data: { imageId , refreshToken}, // Pass the image ID
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Include the access token
        },
      });

      if (response.status === 200) {
        // Update the frontend state after successful deletion
        const updatedImages = [...images];
        updatedImages[index] = { id: -1, src: '' }; // Replace with a placeholder
        setImages(updatedImages);

        console.log("Image successfully deleted:", imageId);
      } else {
        console.error("Failed to delete image from the server:", response.data);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteImage, isDeleting };
};

export default useDeleteImage;
