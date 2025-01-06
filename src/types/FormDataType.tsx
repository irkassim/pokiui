
export interface FavoriteType {
    category: string;
    value: string;
  } 

export type FormDataType = {
    bio: string;
    education: string;
    datingGoals: string;
    email: string;
    firstName: string;
    lastName: string;
    occupation: string;
    preference: string;
    refreshToken: string;
    gender: string;
    accountType: string;
    isProfileComplete:boolean;
    hobbies: string[];
    zodiacSigns: string[];
     publicPhotos: string[];
    favorite: FavoriteType; // Updated structure   
     profileImages: File[];
  };