import React, { useState, useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import api from '../utils/api'; // Import the Axios instance
import { useUsersContext } from '../context/UsersContext';
import FavoriteThing from '../components/FavoriteThing';
import {useFetchUser} from '../hooks/useFetch'; 
import { FormDataType } from '../types/FormDataType';
//import {UploadResponse } from '../types/ImageSlot'
import useUpdates from '../hooks/useUpdates';
import useUpload from '../hooks/useUpload';
import useDeleteImage from '../hooks/useDeleteImage';
import useSaveProfile from '../hooks/useSaveProfile';
import useSetAvatar from '../hooks/useSetAvatar';
import {
  HOBBIES,
  ZODIAC_SIGNS,
  GENDERS,
  SHOW_ME,
  DATING_GOALS,
  EDUCATION_LEVELS,
} from '../utils/Constants';



/* interface ProfileUpdateProps {  
  onSave: (updatedData: FormData) => void;
  onCancel: () => void;
} */

const ProfileUpdate: React.FC = () => {
 const [chseProfilePic, setChseProfiePic] = useState(false);
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');
 const { user, setUser, loading } = useFetchUser(accessToken, refreshToken);
 //usersContext
 const { images, setImages, photos, setShldFetchPhotos  } = useUsersContext();
 const { updateTextFields } = useUpdates(accessToken, refreshToken);
 const { handleImageUpload,setRefreshFlag, refreshFlag } = useUpload(accessToken, refreshToken)
 const { deleteImage, isDeleting } = useDeleteImage(accessToken,refreshToken,  images || [], setImages);
 //const { updateImages } = useUpdates(accessToken, refreshToken);
 const { setAvatar, isUpdatingAvatar, error } = useSetAvatar(accessToken);
 const navigate = useNavigate();
  
 
  
   user && console.log("profileUpUser:", user)

     //Setting Images from userPhotos
    useEffect(() => {
      if (photos) {
        const updatedGrid = Array(9)
          .fill(null)
          .map((_, index) => photos[index] || { id: -1, src: '' });
          
        // Only update state if there is an actual change
        setImages((prevImages) => {
          const isSame = prevImages.every((img, idx) => img.src === updatedGrid[idx]?.src);
          if (!isSame) {
            return updatedGrid;
          }
          return prevImages;
        });
        setRefreshFlag(false)
      }
    }, [photos]); // No need to include images
    

     //User info formData
   const [formData, setFormData] = useState<FormDataType>({
    bio: user?.bio || '',
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    accountType: user?.accountType || "",
    education: user?.education || '',
    gender: user?.gender || '',
    refreshToken:refreshToken || '',
    occupation: user?.occupation || '',
   preference: user?.preference || '',
  isProfileComplete:user?.isProfileComplete || false,
    datingGoals: user?.datingGoals || '',
    hobbies: user?.hobbies || [],
    zodiacSigns: user?.zodiacSigns || [],
    favorite: user?.favorite || { category: '', value: '' }, // Default empty favorite
    profileImages: [],
    publicPhotos:[]
  });

  //Calling save Profile Hook
  const { saveProfile, errorMessage } = useSaveProfile({
    formData,
    updateTextFields,
    user,
  });

// Sync formData with user when user is fetched
useEffect(() => {
  if (user) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      bio: user.bio || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      accountType: user.accountType || '',
      education: user.education || '',
      isProfileComplete:user?.isProfileComplete || false,
      gender: user.gender || '',
      occupation: user.occupation || '',
      preference: user.preference || '',
      datingGoals: user.datingGoals || '',
      hobbies: user.hobbies || [],
      zodiacSigns: user.zodiacSigns || [],
      favorite: user.favorite || { category: '', value: '' },
    }));
  }
}, [user]); // Runs whenever `user` changes
  
  //loading if no user
  if (loading) {
    return <div>Loading user data...</div>;
  }

  //
  if (!user) {
    return <div>Error: User Data not available</div>; // Show a loading state until user is fetched
  }

  const isPremium = user?.accountType === 'Premium';
   
  
  //Deleting images in grid 
  const handleImageDelete = (index: number) => {
    const imageToDelete = images?.[index];
   // console.log("Image to delete:", imageToDelete)
    if (imageToDelete && imageToDelete.id !== -1) {
    // console.log("ID of image to Delete:", imageToDelete.id)
      deleteImage(imageToDelete.id, index);
    }
    /* if(images){
      const updatedImages = [...images];
      updatedImages[index] = { id: -1, src: ''  }; // Replace with a placeholder
      setImages(updatedImages);
    } */
  };

  //Handling text inputs
  const handleInputChange = (field:string, value:string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    })); 
  };

  //Handle interest and Hobbies
  const handleCheckboxChange = (field: keyof FormDataType, value: string) => {
    const updatedValues = formData[field] as string[];
    // Normalize the value to prevent duplicates
    const normalizedValue = value.toLowerCase();
    const normalizedUpdatedValues = updatedValues.map((item) => item.toLowerCase());
    const newValues = normalizedUpdatedValues.includes(normalizedValue)
      ? updatedValues.filter((item) => item.toLowerCase() !== normalizedValue)
      : [...updatedValues, value]; // Use original value for display consistency
  
    const maxLimit = field === "zodiacSigns" ? (isPremium ? 6 : 3) : 3;
  
    if (newValues.length <= maxLimit) {
      setFormData({ ...formData, [field]: newValues });
    }
  };
  

  // console.log("Updated FormData:", formData);

  // Handle updating the favorite
  const handleUpdateFavorite = (favorite: { category: string; value: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      favorite: favorite,
    })); 
  };

  const handleProfilePic = async (photoId: any) => {
    const result = await setAvatar(photoId);
    if (result.success) {
      console.log('Avatar updated successfully:', result.avatar);
      // Optionally refresh user data or update UI state here
    }
    
  };
  

  //findal Save
  const handleSave = async () => {
    console.log("begin save")
    const success = await saveProfile();
    console.log("end save")
    if (!success) {
      console.error("Save profile failed.", errorMessage );
    }else {
      console.log("Profile Successufully Updated:",success)
      setChseProfiePic(false)
      navigate("/profile/user")
    }
  
  };
  

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      'You have unsaved changes. Are you sure you want to discard them?'
    );
    if (confirmCancel && user) {
      setFormData({
        bio: user.bio || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        accountType: user.accountType || '',
        education: user.education || '',
        gender: user.gender || '',
        isProfileComplete:user?.isProfileComplete || false,
        refreshToken: refreshToken || '',
        occupation: user.occupation || '',
        preference: user.preference || '',
        datingGoals: user.datingGoals || '',
        hobbies: user.hobbies || [],
        zodiacSigns: user.zodiacSigns || [],
        favorite: user.favorite || { category: '', value: '' },
        profileImages: [],
        publicPhotos: [],
      });
      navigate('/profile/user'); // Redirect or close the modal
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-4">
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg"
          onClick={handleSave}>
              Save
            </button>

            {error && <p className="text-red-500">{error}</p>}

            {!chseProfilePic && <button
              className=" top-2 left-2 bg-blue-500 text-white text-xs py-1 px-3 rounded-full"
              onClick={() => setChseProfiePic(true)}
            >
              Choose Profile Pic
            </button>}
            <div className="border-l h-full mx-2"></div>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg"
              onClick={handleCancel}
            >
          Cancel
        </button>
      </div>
      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 mb-9 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg" style={{ height: '600px' }}>
      {/* Ensure all 9 slots are displayed */}
      
      {images?.map((photo:any, index:number) => (
      <div key={index} className="relative bg-gray-200 h-40 flex items-center justify-center border rounded-lg">
       {photo.src  ? (
       <div className="relative bg-gray-200 h-40 flex items-center justify-center border rounded-lg">
       <img
         src={photo.src}
         alt={`Slot ${index}`}
         className="h-full w-full object-cover rounded-lg"
       />
       <button
         className="absolute bottom-2 bg-red-500 text-white p-1 rounded shadow-lg"
         onClick={() => handleImageDelete(index) } disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "x"}
        x
       </button>

         {images.length > 1 && chseProfilePic && (
            <button
              className="absolute top-2 left-2 bg-blue-500 text-white text-xs py-1 px-3 rounded-full"
              onClick={() => handleProfilePic(photo)}
              disabled={isUpdatingAvatar}
            >
               {isUpdatingAvatar && chseProfilePic ? 'Updating...' : 'this'}
            </button>
          )}
          {/* Show error if any CHANGE POSITION OR NOT */}
            
         </div>
                ) : ( <button  className="bg-blue-500 text-white p-2 rounded"
                    onClick={() => {handleImageUpload(index, setImages); setShldFetchPhotos(true)}}
                  >
                    +
                  </button>
                 )}
           </div>
              ))}

          </div>
  
           {/* Relevant Section */}
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Relevant</h2>
        <textarea
          value={formData.bio }
          onChange={(e) => handleInputChange("bio", e.target.value)}
          className="w-full h-20 p-2 border rounded-lg mb-4"
          placeholder="Write something about yourself..."
        ></textarea>
        <select
          value={formData.education}
          onChange={(e) => handleInputChange("education", e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        >
          <option value="">Select education level</option>
          { EDUCATION_LEVELS.map((option) => (
            <option key={option} value={option}>
              {option }
               </option>
              ))}
             </select>
          <div>
          <h4 className="font-bold mb-2">Searching For</h4>
          <div className="flex flex-wrap gap-2">
            {DATING_GOALS.map((goal) => (
              <button
                key={goal}
                onClick={() => handleInputChange("datingGoals", goal)}
                className={`px-2 py-1 text-sm border rounded-lg ${
                  formData.datingGoals ===goal
                    ? "bg-blue-500 text-white"
                    : "text-gray-600"
                }`}
              >
                {goal }
              </button>
            ))}
          </div>  
        </div>

        {/* Separator */}
           <hr className="border-t border-gray-300 my-5" />
           <div>
           <h4 className="font-bold mb-2"> Gender</h4>
           <select
          value={formData.gender}
          onChange={(e) => handleInputChange("gender", e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        >
          <option value="">Select your gender</option>
          { GENDERS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
             </select>
           </div>

           {/* Separator */}
           <hr className="border-t border-gray-300 my-5" />
        <div>
          <h3 className="font-bold mb-2">show me</h3>
          <div className="flex flex-wrap gap-2">
            { SHOW_ME.map((choice) => (
              <button
                key={choice}
                onClick={() => handleInputChange("preference", choice)}
                className={`px-2 py-1 text-sm border rounded-lg ${
                  formData.preference === choice
                    ? "bg-blue-500 text-white"
                    : "text-gray-600"
                }`}
              >
                {choice}
              </button>
            ))}
          </div> 
        </div>
         {/* Separator */}
         <hr className="border-t border-gray-300 my-5" />
         <div>
          <p>Occupation / Job Title </p>
          <input
              type="text"
              value={formData.occupation}
              onChange={(e) =>handleInputChange("occupation",e.target.value )}
              className="border p-2 w-full rounded-md mt-2"
              placeholder={`About your job title or work`}
              />
                </div>
             </div>

             {/* Interest Section */}
      
              <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-6">
           <h2 className="text-xl font-bold mb-4">Interests</h2>
  
       {/* Hobbies Section */}
           <div className="mb-6">
          <h3 className="font-semibold mb-3">Hobbies</h3>
          <div className="flex flex-wrap gap-3">
            {HOBBIES.map((hobby) => (
        <label
          key={hobby}
          className={`flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-sm hover:bg-blue-100 cursor-pointer transition duration-200 ${
            formData.hobbies.includes(hobby) ? "bg-blue-500 text-white" : ""
          }`}
        >
          <input
            type="checkbox"
            value={hobby}
            checked={formData.hobbies.includes(hobby)}
            onChange={() => handleCheckboxChange("hobbies", hobby)}
            className="hidden"
          />
          {hobby}
        </label>
      ))}
    </div>
  </div> 

  {/* Separator */}
  <hr className="border-t border-gray-300 my-4" />

  {/* Zodiac Signs Section */}
  <div className="mb-6">
    <h3 className="font-semibold mb-3">Zodiac Signs</h3>
    <p className="text-sm text-gray-500 mb-3">
      {/* Select up to {isPremium ? 6 : 3} zodiac signs. */}
    </p>
    <div className="flex flex-wrap gap-3">
      {ZODIAC_SIGNS.map((sign) => (
        <label
          key={sign}
          className={`flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-sm hover:bg-blue-100 cursor-pointer transition duration-200 ${
            formData.zodiacSigns.includes(sign) ? "bg-blue-500 text-white" : ""
          }`}
        >
          <input
            type="checkbox"
            value={sign}
            checked={formData.zodiacSigns.includes(sign)}
            onChange={() => handleCheckboxChange("zodiacSigns", sign)}
            className="hidden"
          />
          {sign}
        </label>
      ))}
    </div> 
  </div>
  
  {/* Separator */}
  <hr className="border-t border-gray-300 my-4" />

   {/* Single Favorite Section */}
   <FavoriteThing
          user={formData}
          handleUpdateFavorite={handleUpdateFavorite}
        />
      </div>

      {/* Memories Section */}
      {/* <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Shared Memories</h2>
        <ul>
          <li>Shared a memory with Alice</li>
          <li>Shared a memory with Bob</li>
        </ul>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">
          Create Vault
        </button>
      </div> */}

      {/* Account Information Section */}
      {/* <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Subscription:</strong> {formData.accountType}</p>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4">
          Edit
        </button>
      </div> */}
    </div>
  ); ;
};

export default ProfileUpdate;
