import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/User';

interface UseSaveProfileProps {
  formData: any; // Replace with your actual form data type if available
  updateTextFields: (updates: any) => Promise<{ success: boolean }>;
  user: User | null;
}

const useSaveProfile = ({ formData, updateTextFields, user }: UseSaveProfileProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const saveProfile = async () => {
    try {
      // Validation for required fields
      const requiredFields = ['bio', 'education', 'preference', 'datingGoals', 'gender'];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        console.error("Validation failed. Missing fields:", missingFields);
        setErrorMessage(`Please complete the following fields: ${missingFields.join(', ')}`);
        return false;
      }

    
      let updatedFormData = { ...formData };

      // Ensure favorite section is only saved when both category and value are provided
      if (formData.favorite) {
        const { category, value } = formData.favorite;
        if (!category || !value) {
          console.warn("Incomplete favorite section. Removing from updated data.");
          delete updatedFormData.favorite; // Exclude favorite if not completely filled
        }
      }

       // Check and update isProfileComplete
      if (user && !user.isProfileComplete) {
        const allFieldsFilled = requiredFields.every((field) => formData[field]);
        if (allFieldsFilled) {
          updatedFormData.isProfileComplete = true;
        }
      } 

      // Call the update API
      const result = await updateTextFields(updatedFormData);

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
