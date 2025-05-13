import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loadUserData } from '../redux/userSlice';
import { UserContext } from '../context/UserContext';

const SweetAppLoading = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);
  const dispatch = useDispatch();

  const [isSweetLoadingVisibledYet, setSweetLoadingVisibledYet] = useState(false);
  const [isSweetLoadingYet, setSweetLoadingYet] = useState(false);

  const scaleValue = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 2554,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  useEffect(() => {
    const sweetLoadUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const isSweetOnbWas = await AsyncStorage.getItem('isSweetOnbWas');
        const sweetStoredUser = await AsyncStorage.getItem(storageKey);

        if (sweetStoredUser) {
          setUser(JSON.parse(sweetStoredUser));
          setSweetLoadingVisibledYet(false);
        } else if (isSweetOnbWas) {
          setSweetLoadingVisibledYet(false);
        } else {
          setSweetLoadingVisibledYet(true);
          await AsyncStorage.setItem('isSweetOnbWas', 'true');
        }
      } catch (error) {
        console.error('Loading math user has problem', error);
      } finally {
        setSweetLoadingYet(true);
      }
    };

    sweetLoadUser();
  }, [setUser]);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    if (isSweetLoadingYet) {
      const sweetTimer = setTimeout(() => {
        const destination = isSweetLoadingVisibledYet ? 'SweetOnboardingSP' : 'SweetHomeScreenP';
        navigation.replace(destination);
      }, 2554);
      return () => clearTimeout(sweetTimer);
    }
  }, [isSweetLoadingYet, isSweetLoadingVisibledYet, navigation]);

  return (
    <View
      style={{
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#FED9D3',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'center',
      }}
    >
      <Animated.Image
        source={require('../assets/images/edgeOfSweetLogo.png')}
        style={{
          width: '85%',
          height: '40%',
          alignSelf: 'center',
          transform: [{ scale: scaleValue }],
        }}
        resizeMode='contain'
      />
    </View>
  );
};

export default SweetAppLoading;