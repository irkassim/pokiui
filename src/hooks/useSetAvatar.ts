import { useState } from 'react';

const useSetAvatar = (accessToken:any) => {
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const refreshToken = localStorage.getItem('refreshToken');
  const [error, setError] = useState(null);

  const setAvatar = async (photoId:any) => {
    try {
      setIsUpdatingAvatar(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/profile/set-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ avatar: photoId._id ,  refreshToken}),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Avatar updated:', data.avatar);
        return { success: true, avatar: data.avatar };
      } else {
        console.error('Error updating avatar:', data.error);
        setError(data.error || 'Failed to update avatar');
        return { success: false };
      }
    } catch (err:any) {
      console.error('Error setting avatar:', err);
      setError(err.message || 'An error occurred while updating avatar');
      return { success: false };
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  return { setAvatar, isUpdatingAvatar, error };
};

export default useSetAvatar;
