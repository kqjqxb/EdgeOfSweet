import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';

import SweetSettingsScreen from './SweetSettingsScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MathQuizPage from './MathQuizPage';
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';
import MathCatchEggsScreen from './MathCatchEggsScreen';
import MathAchievmentsScreen from './MathAchievmentsScreen';
import SweetProgressScreen from './SweetProgressScreen';
import SweetSavedScreen from './SweetSavedScreen';

const fontMontserratRegular = 'Montserrat-Regular';

const sweetButtons = [
  {
    id: 1,
    sweetScPage: 'Settings',
    sweetScPageImg: require('../assets/icons/sweetButtonsIcons/nonActiveSweetButton/sweetSettings.png'),
    sweetActiveScPageImg: require('../assets/icons/sweetButtonsIcons/activeSweetButton/sweetSettings.png'),
  },
  {
    id: 2,
    sweetScPage: 'Saved',
    sweetScPageImg: require('../assets/icons/sweetButtonsIcons/nonActiveSweetButton/sweetHeart.png'),
    sweetActiveScPageImg: require('../assets/icons/sweetButtonsIcons/activeSweetButton/sweetHeart.png'),
  },
  {
    id: 5,
    sweetScPage: 'Home',
    sweetScPageImg: require('../assets/icons/sweetButtonsIcons/nonActiveSweetButton/sweetHome.png'),
    sweetActiveScPageImg: require('../assets/icons/sweetButtonsIcons/activeSweetButton/sweetHome.png'),
  },
  {
    id: 3,
    sweetScPage: 'My progress',
    sweetScPageImg: require('../assets/icons/sweetButtonsIcons/nonActiveSweetButton/sweetCircle.png'),
    sweetActiveScPageImg: require('../assets/icons/sweetButtonsIcons/activeSweetButton/sweetCircle.png'),
  },
  {
    id: 4,
    sweetScPage: 'My rewards',
    sweetScPageImg: require('../assets/icons/sweetButtonsIcons/nonActiveSweetButton/sweetRewards.png'),
    sweetActiveScPageImg: require('../assets/icons/sweetButtonsIcons/activeSweetButton/sweetRewards.png'),
  },

]

const SweetHomeScreenP = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [choosedSweetScreen, setChoosedSweetScreen] = useState('Home');

  const [isSweetMusicOn, setSweetMusicOn] = useState(true);
  const [isSweetNotificationsOn, setSweetNotificationsOn] = useState(true);
  const [isSweetVibrOn, setSweetVibrOn] = useState(true);

  const { volume } = useAudio();
  const [mathWithIndOfTrack, setMathWithIndOfTrack] = useState(0);
  const [sound, setSound] = useState(null);

  const mathTracks = ['mathWithChickensBackgroundMusic.mp3', 'mathWithChickensBackgroundMusic.mp3'];

  useEffect(() => {
    playMathTracksWith(mathWithIndOfTrack);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [mathWithIndOfTrack]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(isSweetMusicOn ? 1 : 0);
    }
  }, [isSweetMusicOn, sound]);

  const playMathTracksWith = (index) => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const newMathSound = new Sound(mathTracks[index], Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Error math sound:', error);
        return;
      }
      newMathSound.setVolume(volume);
      newMathSound.play((success) => {
        if (success) {
          setMathWithIndOfTrack((prevIndex) => (prevIndex + 1) % mathTracks.length);
        } else {
          console.log('Error play track');
        }
      });
      setSound(newMathSound);
    });
  };

  useEffect(() => {
    const loadMathSettingsParams = async () => {
      try {
        const sweetMusicFromStorage = await AsyncStorage.getItem('isSweetMusicOn');

        const sweetVibrationFromStorage = await AsyncStorage.getItem('isSweetVibrationOn');

        const sweetNotificationsFromStorage = await AsyncStorage.getItem('isSweetNotificationsOn');

        if (sweetMusicFromStorage !== null) {
          setSweetMusicOn(JSON.parse(sweetMusicFromStorage));
        }

        if (sweetVibrationFromStorage !== null) {
          setSweetVibrOn(JSON.parse(sweetVibrationFromStorage));
        }

        if (sweetNotificationsFromStorage !== null) {
          setSweetNotificationsOn(JSON.parse(sweetNotificationsFromStorage));
        }
      } catch (error) {
        console.error('Error loading math params:', error);
      }
    };

    loadMathSettingsParams();
  }, [])

  return (
    <View style={{
      backgroundColor: '#FED9D3',
      width: '100%',
      flex: 1,
      height: dimensions.height,
    }}>
      {choosedSweetScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          alignItems: 'center',
          marginTop: Platform.OS === 'android' ? dimensions.height * 0.03 : 0,
        }}>

        </SafeAreaView>
      ) : choosedSweetScreen === 'Settings' ? (
        <SweetSettingsScreen setChoosedSweetScreen={setChoosedSweetScreen}

          isSweetMusicOn={isSweetMusicOn}
          setSweetMusicOn={setSweetMusicOn}
          isSweetNotificationsOn={isSweetNotificationsOn}
          setSweetNotificationsOn={setSweetNotificationsOn}
          isSweetVibrOn={isSweetVibrOn}
          setSweetVibrOn={setSweetVibrOn}
        />
      ) : choosedSweetScreen === 'My progress' ? (
        <SweetProgressScreen setChoosedSweetScreen={setChoosedSweetScreen} />
      ) : choosedSweetScreen === 'Saved' ? (
        <SweetSavedScreen setChoosedSweetScreen={setChoosedSweetScreen} />
      ) : choosedSweetScreen === 'Play Game' ? (
        <MathCatchEggsScreen setChoosedSweetScreen={setChoosedSweetScreen} isSweetVibrOn={isSweetVibrOn} />
      ) : null}

      <View style={{
        position: 'absolute',
        bottom: '5%',
        height: dimensions.width * 0.18,
        width: '90%',
        borderRadius: dimensions.width * 0.035,
        backgroundColor: '#F3CBCE',
        borderWidth: dimensions.width * 0.002,
        borderColor: '#582D45',
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: dimensions.width * 0.03,
      }}>
        {sweetButtons.map((sweetBtEdge, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setChoosedSweetScreen(sweetBtEdge.sweetScPage);
            }}
            style={{
              backgroundColor: choosedSweetScreen === sweetBtEdge.sweetScPage ? '#582D45' : '#F3CBCE',
              width: dimensions.width * 0.15,
              height: dimensions.width * 0.15,
              borderColor: '#DAA1C1',
              alignItems: 'center',
              borderRadius: dimensions.width * 0.031,
              borderWidth: choosedSweetScreen !== sweetBtEdge.sweetScPage ? dimensions.width * 0.0025 : 0,
              justifyContent: 'center',
            }}>
            <Image
              source={choosedSweetScreen === sweetBtEdge.sweetScPage
                ? sweetBtEdge.sweetActiveScPageImg
                : sweetBtEdge.sweetScPageImg
              }
              style={{
                width: dimensions.height * 0.04,
                height: dimensions.height * 0.04,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}

      </View>
    </View>
  );
};

export default SweetHomeScreenP;
