import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UsersContext = createContext<any>(null);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/profile/user', {
         method: 'GET', headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      }
    };
    fetchUser();
  }, []);

  return <UsersContext.Provider value={{ user, setUser }}>{children}</UsersContext.Provider>;
};
