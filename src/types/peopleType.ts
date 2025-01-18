// User type
export interface User {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  }
  
  // State type for the slice
  export interface PeopleState {
    users: User[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
  }
  
  // Arguments for the fetchPeople thunk
  export interface FetchPeopleArgs {
    userId: string;
    latitude: number;
    longitude: number;
    page: number;
  }
  