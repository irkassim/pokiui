import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/User';

interface UseSaveProfileProps {
  formData: any; //Replace the any maybe
  updateTextFields: (updates: any) => Promise<{ success: boolean }>;
  user: User | null;
}

const useSaveProfile = ({ formData, updateTextFields, user }: UseSaveProfileProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const saveProfile = async () => {
    try {
         console.log("THEFORM:", formData)
      // Validation for required fields
      const requiredFields = ['bio', 'education', 'preference', 'datingGoals', 'gender'];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        console.error("Validation failed. Missing fields:", missingFields);
        setErrorMessage(`Please complete the following fields: ${missingFields.join(', ')}`);
        return false;
      }

    
        // Create a backend-compatible update object
          const updatedFormData = {
            bio: formData.bio,
            education: formData.education,
            preference: formData.preference,
            datingGoals: formData.datingGoals,
            gender: formData.gender,
            hobbies: formData.hobbies,
            zodiacSigns: formData.zodiacSigns,
            favorite: formData.favorite?.category && formData.favorite?.value ? formData.favorite : undefined, // Only include favorite if complete
            occupation: formData.occupation || '',
            isProfileComplete: true,
          };

          console.log("UPDATED FORM DATA:", updatedFormData);
      // Call the update API
      const result = await updateTextFields(updatedFormData);
      console.log("UpdateResults:", result)

      if (result.success) {
        console.log("Profile updated successfully");
        navigate('/profile/user'); // Redirect after successful update
        return true;
      } else {
        console.error("Profile update failed");
        setErrorMessage("Failed to update profile. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessage("An error occurred while saving. Please try again.");
      return false;
    }
  };

  return { saveProfile, errorMessage };
};

export default useSaveProfile;
