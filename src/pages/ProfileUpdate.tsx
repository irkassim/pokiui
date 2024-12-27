import React, { useState, useContext } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import the Axios instance
import { UsersContext } from '../context/UsersContext';
import FavoriteThing from '../components/FavoriteThing';

/* interface ProfileUpdateProps {  
  onSave: (updatedData: FormData) => void;
  onCancel: () => void;
} */
/* type FormData = {
  bio: string;
  education: string;
  datingGoals: string;
  hobbies: string[];
  zodiacSigns: string[];
  email: string;
  subscription: string;
  firstName: string[];
  lastName: string[];
  favorites: {
    movie: string;
    song: string;
    politician: string;
    celebrity: string;
    book: string;
    place: string;
    thing: string;
  };

  profileImages: File[];
  profilePicture: File | null;
}; */

interface FavoriteType {
  category: string;
  value: string;
}

type FormDataType = {
  bio: string;
  education: string;
  datingGoals: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  hobbies: string[];
  zodiacSigns: string[];
   publicPhotos: string[];
   favorites: FavoriteType; // Updated structure   
   profileImages: File[];
};



const ProfileUpdate: React.FC = () => {
  const [bio, setBio] = useState<string>('');
 //const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preference, setPreference] = useState<string>('Everyone'); // New state
  const [gender, setGender] = useState<string>('Male'); // New state
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);
   //const { isAuthenticated } = useAuth();
  //setUser(data )
  user && console.log("Use from PU:", user)

  const images = [
    { id: 1, src: '/images/img1.jpg' },
    { id: 2, src: '/images/img2.jpg' },
    { id: 3, src: '/images/img3.jpg' },
  ];
 
 

 /*  const [user, setUser] = useState({
    firstName: 'Chris',
    lastName: 'Brown',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: "Updating profile for the 5th time.",
    education: 'Bachelors',
    location: 'New York, USA',
    datingGoals: 'Long-term',
    hobbies: ['Movies', 'Music'],
    zodiacSigns: ['Scorpio'],
    favoriteMovies: ['Inception', 'The Dark Knight'],
    favoriteMusic: ['Jazz', 'Pop'],
    email: 'chris.brown@example.com',
    accountType: 'Premium',
    images: Array(9).fill(null), // 9 empty slots initially
  });  */
 
  //const isPremium = user?.accountType === 'Premium';
  const [formData, setFormData] = useState<FormDataType>({
    bio: user.bio || '',
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accountType: user.accountType,
    education: user.education || '',
    datingGoals: user.datingGoals || '',
    hobbies: user.hobbies || [],
    zodiacSigns: user.zodiacSigns || [],
    favorites: user.favorites || { category: '', value: '' }, // Default empty favorite
    profileImages: [],
    publicPhotos:[]
  });
 

  //Submission of data to be updated
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      console.log(accessToken,refreshToken)
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('gender', gender);
      formData.append('preference', preference);
      //attaching refresh token to formData
      formData.append('refreshToken', refreshToken ||"");
      formData.append('avatar', avatar ||"")
    
      console.log(formData)
      /* for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      } */

      //making request to update profile
    const response=  await api.put('/api/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data', // Required for FormData
        },
      });

      console.log('Profile Update Success:', response.data);
      
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      updatedUser.isProfileComplete = true;
      updatedUser.preference = preference;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/home'); // Redirect to Home after profile update
    } catch (err) {
      console.error('Profile Update Error:', err);
    }
  };

  
  const handleInputChange = (field:string, value:string) => {
   // setFormData({ ...formData, [field]: value });
  };

 const handlePreference = (field:string, value:string) => {
  // setFormData({ ...formData, [field]: value });
 };

   //Not so sure of types 
  /*  type FavoriteKeys = keyof typeof formData.favorites;
   type FormDataKeys = keyof FormData;
   const handleFavoriteChange = (field:keyof typeof formData.favorites, value: string) => {
     setFormData({
       ...formData,
       favorites: {
         ...formData.favorites,
         [field]: value,
       },
     });
   }; */

  const handleCheckboxChange = (field: keyof FormDataType, value: string) => {
   /*  const updatedValues = formData[field] as string[]; // Assert type
    const newValues = updatedValues.includes(value)
      ? updatedValues.filter((item) => item !== value)
      : [...updatedValues, value];
  
    const maxLimit = field === "zodiacSigns" ? (isPremium ? 6 : 3) : 3;
  
    if (newValues.length <= maxLimit) {
      setFormData({ ...formData, [field]: newValues });
    } */
  };
  

  const handleImageUpload = (e:any) => {
    const files = Array.from(e.target.files);
   // const updatedImages = [...formData.profileImages, ...files];
   // setFormData({ ...formData, profileImages: updatedImages });
  };

  const handleSetProfilePicture = (image:any) => {
    //setFormData({ ...formData, profilePicture: image });
  };

  const handleSave = () => {
    //onSave(formData as any);
  };

  const handleCancel = () => {
    //onCancel();
  }

  // Handle updating the favorite
  const handleUpdateFavorite = (favorite: { category: string; value: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      favorites: favorite,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-4">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
          onClick={handleSave}
        >
          Save
        </button>
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
        {formData.profileImages.map((image, index) => (
          <div
            key={index}
            className="relative w-28 h-28 bg-gray-200 border rounded-lg"
          >
            <img
              src={URL.createObjectURL(image)}
              alt="profile"
              className="w-full h-full object-cover rounded-lg"
              onClick={() => handleSetProfilePicture(image)}
            />
            <button
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full"
              onClick={() =>
                setFormData({
                  ...formData,
                  profileImages: formData.profileImages.filter(
                    (_, idx) => idx !== index
                  ),
                })
              }
            >
              X
            </button>
          </div>
        ))}
        {formData.profileImages.length < 9 && (
          <label className="w-28 h-28 bg-gray-200 border rounded-lg flex items-center justify-center cursor-pointer">
            <span className="text-sm text-gray-500">+</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>


  
      {/* Relevant Section */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Relevant</h2>
        <textarea
          value={user.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          className="w-full h-20 p-2 border rounded-lg mb-4"
          placeholder="Write something about yourself..."
        ></textarea>
        <select
          value={user.education}
          onChange={(e) => handleInputChange("education", e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        >
          <option value="">Select education level</option>
          {[
            "Bachelors",
            "Masters",
            "In College",
            "High School",
            "PhD",
            "In Grad School",
            "Trade School",
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div>
          <h3 className="font-bold mb-2">Searching For</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Marriage: Traditional Roles",
              "Marriage: 50/50",
              "Long-term",
              "Open-minded",
              "Short-term Fun",
              "Not Sure",
            ].map((goal) => (
              <button
                key={goal}
                onClick={() => handleInputChange("datingGoals", goal)}
                className={`px-2 py-1 text-sm border rounded-lg ${
                  user.datingGoals === goal
                    ? "bg-blue-500 text-white"
                    : "text-gray-600"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
        {/* Separator */}
           <hr className="border-t border-gray-300 my-5" />
        <div>
          <h3 className="font-bold mb-2">show me</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Women",
              "Men",
              "Everyone",
            ].map((choice) => (
              <button
                key={choice}
                onClick={() => handlePreference("preference", choice)}
                className={`px-2 py-1 text-sm border rounded-lg ${
                  user.preference === choice
                    ? "bg-blue-500 text-white"
                    : "text-gray-600"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interest Section */}
      
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-6">
  <h2 className="text-xl font-bold mb-4">Interests</h2>
  
  {/* Hobbies Section */}
  <div className="mb-6">
    <h3 className="font-semibold mb-3">Hobbies</h3>
    <div className="flex flex-wrap gap-3">
      {[
        "Sports",
        "Movies",
        "Music",
        "Art",
        "Literature",
        "Fashion",
        "Cuisine",
        "Travel",
        "Gaming",
        "Gym/Fitness",
        "Nerd",
        "Volunteering",
        "Photography",
      ].map((hobby) => (
        <label
          key={hobby}
          className={`flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-sm hover:bg-blue-100 cursor-pointer transition duration-200 ${
            user.hobbies.includes(hobby) ? "bg-blue-500 text-white" : ""
          }`}
        >
          <input
            type="checkbox"
            value={hobby}
            checked={user.hobbies.includes(hobby)}
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
      {[
        "Aries",
        "Taurus",
        "Gemini",
        "Cancer",
        "Leo",
        "Virgo",
        "Libra",
        "Scorpio",
        "Sagittarius",
        "Capricorn",
        "Aquarius",
        "Pisces",
      ].map((sign) => (
        <label
          key={sign}
          className={`flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-sm hover:bg-blue-100 cursor-pointer transition duration-200 ${
            user.zodiacSigns.includes(sign) ? "bg-blue-500 text-white" : ""
          }`}
        >
          <input
            type="checkbox"
            value={sign}
            checked={user.zodiacSigns.includes(sign)}
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
          user={{FormData }}
          handleUpdateFavorite={handleUpdateFavorite}
        />
      </div>

      {/* Memories Section */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Shared Memories</h2>
        <ul>
          <li>Shared a memory with Alice</li>
          <li>Shared a memory with Bob</li>
        </ul>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">
          Create Vault
        </button>
      </div>

      {/* Account Information Section */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Subscription:</strong> {user.accountType}</p>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4">
          Edit
        </button>
      </div>
    </div>
  ); ;
};

export default ProfileUpdate;
