import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';

import MathSettingsWithScreen from './MathSettingsWithScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MathQuizPage from './MathQuizPage';
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';
import MathCatchEggsScreen from './MathCatchEggsScreen';
import MathAchievmentsScreen from './MathAchievmentsScreen';

const fontMontserratRegular = 'Montserrat-Regular';

const sweetButtons = [
  {
    id: 1,
    sweetScPage: 'Math Quiz',
    sweetScPageImg: require('../assets/icons/sweetButtonsIcons/nonActiveSweetButton/sweetSettings.png'),
    sweetActiveScPageImg: require('../assets/icons/sweetButtonsIcons/activeSweetButton/sweetSettings.png'),
  },
  {
    id: 2,
    sweetScPage: 'Play Game',
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
    sweetScPage: 'Achievments',
    sweetScPageImg: require('../assets/icons/sweetButtonsIcons/nonActiveSweetButton/sweetCircle.png'),
    sweetActiveScPageImg: require('../assets/icons/sweetButtonsIcons/activeSweetButton/sweetCircle.png'),
  },
  {
    id: 4,
    sweetScPage: 'Settings',
    sweetScPageImg: require('../assets/icons/sweetButtonsIcons/nonActiveSweetButton/sweetRewards.png'),
    sweetActiveScPageImg: require('../assets/icons/sweetButtonsIcons/activeSweetButton/sweetRewards.png'),
  },
  
]

const SweetHomeScreenP = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedMathWithScreen, setSelectedMathWithScreen] = useState('Home');
  const [mathWithMusicEnabled, setMathWithMusicEnabled] = useState(true);
  const [vibroMathEnabled, setVibroMathEnabled] = useState(true);

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
      sound.setVolume(mathWithMusicEnabled ? 1 : 0);
    }
  }, [mathWithMusicEnabled, sound]);

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
        const storedMathMusicIs = await AsyncStorage.getItem('mathWithMusicEnabled');

        const storedMathVibrationIs = await AsyncStorage.getItem('chickenVibroEnabled');

        if (storedMathMusicIs !== null) {
          setMathWithMusicEnabled(JSON.parse(storedMathMusicIs));
        }

        if (storedMathVibrationIs !== null) {
          setVibroMathEnabled(JSON.parse(storedMathVibrationIs));
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
      {selectedMathWithScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          alignItems: 'center',
          marginTop: Platform.OS === 'android' ? dimensions.height * 0.03 : 0,
        }}>

        </SafeAreaView>
      ) : selectedMathWithScreen === 'Settings' ? (
        <MathSettingsWithScreen setSelectedMathWithScreen={setSelectedMathWithScreen} mathWithMusicEnabled={mathWithMusicEnabled} setMathWithMusicEnabled={setMathWithMusicEnabled}
          vibroMathEnabled={vibroMathEnabled} setVibroMathEnabled={setVibroMathEnabled}
        />
      ) : selectedMathWithScreen === 'Achievments' ? (
        <MathAchievmentsScreen setSelectedMathWithScreen={setSelectedMathWithScreen} />
      ) : selectedMathWithScreen === 'Math Quiz' ? (
        <MathQuizPage setSelectedMathWithScreen={setSelectedMathWithScreen} />
      ) : selectedMathWithScreen === 'Play Game' ? (
        <MathCatchEggsScreen setSelectedMathWithScreen={setSelectedMathWithScreen} vibroMathEnabled={vibroMathEnabled} />
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
              setSelectedMathWithScreen(sweetBtEdge.sweetScPage);
            }}
            style={{
              backgroundColor: selectedMathWithScreen === sweetBtEdge.sweetScPage ? '#582D45' : '#F3CBCE',
              width: dimensions.width * 0.15,
              height: dimensions.width * 0.15,
              borderColor: '#DAA1C1',
              alignItems: 'center',
              borderRadius: dimensions.width * 0.031,
              borderWidth: selectedMathWithScreen !== sweetBtEdge.sweetScPage ? dimensions.width * 0.0025 : 0,
              justifyContent: 'center',
            }}>
            <Image
              source={selectedMathWithScreen === sweetBtEdge.sweetScPage 
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
