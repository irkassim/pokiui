export interface User {
  id: string; // User ID
  firstName: string;
  lastName: string;
  username?: string;
  resfreshToken?: string;
  email: string;
  bio?: string;
  avatar?: string; // Avatar image key or URL
  favoriteMovies?: string[];
  favoriteSongs?: string[];
  hobbies?: string[];
  gender?: string;
  zodiacSigns?: string[];
  location?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  education?: string; // Educational level
  occupation?: string;
  datingGoals?: string; // Dating goals
  preference?: string
  isProfileComplete:boolean;
  memories?: {
    url: string;
    isHidden: boolean;
    sharedWith: string[]; // User IDs with whom the memory is shared
  }[];
  accountType: 'Basic' | 'Daily' | 'Premium';
  subscriptionExpiresAt?: string;
  publicPhotos?: string[]; // Public photo URLs or keys
  favorite?: {
    category: string;
    value: string;
  };
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

 interface ImageSlot {
  id: number;
  src: string;
  signedUrl?: string;
}

export interface UsersContextType {
  user: User | null;
  userPhotos: ImageSlot[] | [];
  shldFetchPhotos:boolean;
  images: ImageSlot[] | [];
  photos: ImageSlot[] | []; // Add photos
  setPhotos: React.Dispatch<React.SetStateAction<ImageSlot[] | []>>; // Add setPhotos
  setImages: React.Dispatch<React.SetStateAction<ImageSlot[]>>;
  setUserPhotos: React.Dispatch<React.SetStateAction<ImageSlot[] | []>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setShldFetchPhotos:React.Dispatch<React.SetStateAction<boolean>>;
  /* updateTextFields: (updates: any) => Promise<{ success: boolean }>;
  updateImages: (formData:any) => Promise<{
   imageId: number; 
   success: boolean ;
   imageUrl: string;
}>; */
  //updateGridWithImages: (newImages: ImageSlot[]) => void; // Newly added method
}