
export interface Match {
    id: string;
    name: string;
    avatar: string;
    status: string;
  }
  
export  interface MatchesState {
    matches: Match[];
    loading: boolean;
    error: string | null;
  }
  
  