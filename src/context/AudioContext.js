import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [volume, setVolume] = useState(1.0); 

  useEffect(() => {
    const loadSweetVolumeFromeStorage = async () => {
      try {
        const weetVolumeFromeStorage = await AsyncStorage.getItem('volume');
        if (weetVolumeFromeStorage !== null) {
          setVolume(parseFloat(weetVolumeFromeStorage));
        }
      } catch (error) {
        console.log('Error loading the math volume:', error);
      }
    };
    loadSweetVolumeFromeStorage();
  }, []);

  const handleChangeThisVolume = async (thisVolume) => {
    try {
      await AsyncStorage.setItem('volume', thisVolume.toString());
      
      setVolume(thisVolume);
    } catch (error) {
      console.log('Error saving math volume:', error);
    }
  };

  return (
    <AudioContext.Provider value={{ volume, setVolume: handleChangeThisVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
