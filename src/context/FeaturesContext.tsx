import React, { createContext, useState,useEffect } from 'react';
import { sendPoke, registerMatch } from '../services/services';
import axios from 'axios';

// Define the context type
interface FeaturesContextType {
  matches: any[];
  setMatches: React.Dispatch<React.SetStateAction<any[]>>;
  pokes: any[];
  setPokes: React.Dispatch<React.SetStateAction<any[]>>;
  exploreStatus: boolean;
  setExploreStatus: React.Dispatch<React.SetStateAction<boolean>>;
  boostCount: number;
  setBoostCount: React.Dispatch<React.SetStateAction<number>>;
}

export const FeaturesContext = createContext<any>(null);

export const FeaturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [pokes, setPokes] = useState<any[]>([]);
  const [exploreStatus, setExploreStatus] = useState(false);
  const [boostCount, setBoostCount] = useState(3);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/profile/user', {
         method: 'GET', headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setPokes(response.data.pokes)
        setPokes(response.data.matches)
        setBoostCount(response.data.matches)
      }
    };
    fetchUser();
  }, []);
 
  const handlePoke = async (targetUserId: string) => {
    try {
      const pokeResponse = await sendPoke(targetUserId);
      setPokes((prev) => [...prev, pokeResponse.targetUser]); // Assuming the API returns the user data
    } catch (error) {
      console.error('Poke failed:', error);
    }
  };

  const handleMatch = async (targetUserId: string) => {
    try {
      const matchResponse = await registerMatch(targetUserId);
      setMatches((prev) => [...prev, matchResponse.match]); // Assuming the API returns match details
    } catch (error) {
      console.error('Match failed:', error);
    }
  };

  return (
    <FeaturesContext.Provider
      value={{
        pokes,
        setPokes,
        matches,
        setMatches,
        exploreStatus,
        setExploreStatus,
        boostCount,
        setBoostCount,
        handleMatch,
        handlePoke,
        user,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  );
};
