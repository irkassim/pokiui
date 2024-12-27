import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
//import api from '../utils/api'; // Import the Axios instance

export const UsersContext = createContext<any>(null);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (accessToken || refreshToken) {
        try {
          const response = await axios.post('http://localhost:5000/api/profile/user', 
            { refreshToken }, // Send in the body
            {headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,   });
          //setTheData(response.data); 
          const { user } = response.data;
          setUser(user)  
          console.log("Response Data",response.data, user )
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };
    fetchUser();
  }, []);

  return <UsersContext.Provider value={{ user, setUser }}>{children}</UsersContext.Provider>;
};
