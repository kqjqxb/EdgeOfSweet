import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadingOfSweetUser = async () => {
      try {
        const sweetUserFromStorage = await AsyncStorage.getItem('currentUser');
        if (sweetUserFromStorage) {
          setUser(JSON.parse(sweetUserFromStorage));
        }
      } catch (error) {
        console.error('Error loading sweet User From Storage:', error);
      }
    };
    loadingOfSweetUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
