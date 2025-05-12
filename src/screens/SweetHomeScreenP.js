import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/solid';
import SweetSettingsScreen from './SweetSettingsScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';
import SweetProgressScreen from './SweetProgressScreen';
import SweetSavedScreen from './SweetSavedScreen';
import SweetMyRewardsScreen from './SweetMyRewardsScreen';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import sweetTasksData from '../components/sweetTasksData';

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

const levels = [
  {
    id: 1,
    name: 'Level 1',
    image: require('../assets/images/levels/level1.png'),
  },
  {
    id: 2,
    name: 'Level 2',
    image: require('../assets/images/levels/level2.png'),
  },
  {
    id: 3,
    name: 'Level 3',
    image: require('../assets/images/levels/level3.png'),
  },
  {
    id: 4,
    name: 'Level 4',
    image: require('../assets/images/levels/level4.png'),
  },
  {
    id: 5,
    name: 'Level 5',
    image: require('../assets/images/levels/level5.png'),
  },
]

const SweetHomeScreenP = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [choosedSweetScreen, setChoosedSweetScreen] = useState('Home');

  const [isSweetMusicOn, setSweetMusicOn] = useState(true);
  const [isSweetNotificationsOn, setSweetNotificationsOn] = useState(true);
  const [isSweetVibrOn, setSweetVibrOn] = useState(true);

  const [isTasksGiven, setIsTasksGiven] = useState(false);
  const [isTasksVisible, setIsTasksVisible] = useState(false);
  const [isTaskOpened, setIsTaskOpened] = useState(false);

  const [sweetTasks, setSweetTasks] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    console.log('sweetTasks', sweetTasks);
  }, [sweetTasks]);

  useEffect(() => {
    const loadCurrentChallenge = async () => {
      try {
        const storedChallenge = await AsyncStorage.getItem('sweetTasks');
        if (storedChallenge) {
          setSweetTasks(JSON.parse(storedChallenge));
        }
      } catch (error) {
        console.error('Error loading sweetTasks:', error);
      }
    };

    loadCurrentChallenge();

  }, [choosedSweetScreen]);


  const handleAcceptChallenge = async (index) => {
    if (isVibrationEnabled) {
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
    
    const updatedChallenges = [...sweetTasks.tasks];
  
    // Якщо статус уже 'in progress', тоді ставимо 'done'
    if (updatedChallenges[index].status === 'in progress') {
      updatedChallenges[index].status = 'done';
      updatedChallenges[index].endTime = new Date().toISOString();
      updatedChallenges[index].elapsedTime = getElapsedTime(updatedChallenges[index].startTime);
    }
    // Якщо статус не 'done' (і не 'in progress'), тоді встановлюємо 'in progress'
    else if (updatedChallenges[index].status !== 'done') {
      updatedChallenges[index].status = 'in progress';
      updatedChallenges[index].startTime = new Date().toISOString();
      setElapsedTime('00:00:00');
    }
  
    // Якщо немає активної задачі зі статусом 'accept' – призначаємо наступну, що ще не виконана
    const activeChallenge = updatedChallenges.find(ch => ch.status === 'accept');
    if (!activeChallenge) {
      const nextIndex = updatedChallenges.findIndex((ch, i) => i > index && ch.status !== 'done');
      if (nextIndex !== -1) {
        updatedChallenges[nextIndex].status = 'accept';
        updatedChallenges[nextIndex].startTime = new Date().toISOString();
        setElapsedTime('00:00:00');
      } else {
        const firstNotDone = updatedChallenges.findIndex(ch => ch.status !== 'done');
        if (firstNotDone !== -1) {
          updatedChallenges[firstNotDone].status = 'accept';
          updatedChallenges[firstNotDone].startTime = new Date().toISOString();
          setElapsedTime('00:00:00');
        }
      }
    }
  
    const updatedCurrentChallenge = {
      ...sweetTasks,
      tasks: updatedChallenges,
    };
  
    setSweetTasks(updatedCurrentChallenge);
    await saveCurrentChallenge(updatedCurrentChallenge);
  
    if (updatedChallenges.every(swTask => swTask.status === 'done')) {
      const completedEntry = {
        tasks: updatedChallenges,
        allCompletedDate: new Date().toISOString(),
      };
  
      try {
        const storedJournal = await AsyncStorage.getItem('sweetTasks');
        const storedTasks = storedJournal ? JSON.parse(storedJournal) : [];
        storedTasks.unshift(completedEntry);
        await AsyncStorage.setItem('sweetTasks', JSON.stringify(storedTasks));
        setSelectedUpBtn('Growth journal');
        setSweetTasks(null);
        setIsBeginWasVisible(false);
        setIsDifficultWasVisible(false);
        setSelectedDifficulty('');
        setSelectedChallengeCategory('');
        setElapsedTime('00:00:00');
      } catch (error) {
        console.error('Error saving to sweetTasks:', error);
      }
  
      await AsyncStorage.removeItem('sweetTasks');
      setSweetTasks(null);
    }
  };

  const saveCurrentChallenge = async (swTask) => {
    try {
      await AsyncStorage.setItem('currentChallenge', JSON.stringify(swTask));
    } catch (error) {
      console.error('Error saving currentChallenge:', error);
    }
  };

  const generateSweetTasks = async () => {
    const availableTasks = [...sweetTasksData];
    for (let i = availableTasks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableTasks[i], availableTasks[j]] = [availableTasks[j], availableTasks[i]];
    }
    const selectedTasks = availableTasks.slice(0, 3).map(task => ({
      ...task,
      status: 'pending'
    }));
    // Створюємо об'єкт, що містить масив тасок у властивості tasks
    const data = { tasks: selectedTasks };
    try {
      await AsyncStorage.setItem('sweetTasks', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving sweetTasks:', error);
    }
    setSweetTasks(data);
    return data;
  }

  // useEffect(() => {
  //   generateSweetTasks();
  // }, [])

  const styles = mathSettingsStyles(dimensions);

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
          <View style={{
            width: '90%',
            alignSelf: 'center',
            height: dimensions.height * 0.07,
            backgroundColor: 'rgba(243, 203, 206, 1)',
            marginTop: dimensions.height * 0.02,
            borderRadius: dimensions.width * 0.04,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
            <View style={{
              height: dimensions.height * 0.07,
              width: dimensions.height * 0.07,
              borderRadius: dimensions.width * 0.04,
              backgroundColor: '#582D45',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                source={levels[0].image}
                style={{
                  width: dimensions.height * 0.04,
                  height: dimensions.height * 0.04,
                }}
                resizeMode="contain"
              />
            </View>

            <View style={{
              width: '100%',
              height: '100%',
              marginLeft: dimensions.width * 0.04,
              paddingVertical: dimensions.height * 0.008,
            }}>
              <Text style={[styles.montserratText, {
                fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500',
                color: '#582D45'
              }]}>
                {levels[0].name}
              </Text>

              <View style={{
                width: dimensions.width * 0.65,
                height: dimensions.height * 0.019,
                backgroundColor: 'white',
                borderRadius: dimensions.width * 0.04,
                marginTop: dimensions.height * 0.01,
                position: 'relative',
              }}>
                <View style={{
                  width: dimensions.width * 0.65 * 0.5,
                  height: dimensions.height * 0.019,
                  backgroundColor: '#582D45',
                  borderRadius: dimensions.width * 0.04,
                  position: 'absolute',
                  left: 0,
                }} />
              </View>
            </View>
          </View>
          {!sweetTasks || sweetTasks.length === 0 ? (
            <>
              <Image
                source={require('../assets/images/taskImage.png')}
                style={{
                  width: dimensions.width * 0.6,
                  height: dimensions.width * 0.6,
                  marginVertical: dimensions.height * 0.03,
                }}
                resizeMode="contain"
              />

              <View style={styles.header}>
                <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500' }]}>
                  Your tasks today:
                </Text>
              </View>

              <TouchableOpacity onPress={() => {
                setIsTasksGiven(true);
                generateSweetTasks();
              }} style={{
                width: '90%',
                height: dimensions.height * 0.07,
                backgroundColor: '#D99CBE',
                marginTop: dimensions.height * 0.02,
                borderRadius: dimensions.width * 0.04,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Image
                  source={require('../assets/images/generateTaskImage.png')}
                  style={{
                    width: dimensions.height * 0.03,
                    height: dimensions.height * 0.03,
                    marginRight: dimensions.width * 0.03,
                  }}
                  resizeMode="contain"
                />
                <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.045, textAlign: 'center', fontWeight: '500' }]}>
                  Get my daily tasks
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.header, {
                marginTop: dimensions.height * 0.03,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }]}
                onPress={() => {
                  setIsTasksVisible((prev) => !prev);
                }}
              >
                <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.04, textAlign: 'left', fontWeight: '500' }]}>
                  Your tasks today:
                </Text>

                {isTasksVisible ? (
                  <ChevronUpIcon size={dimensions.width * 0.07} color='white' />
                ) : (
                  <ChevronDownIcon size={dimensions.width * 0.07} color='white' />
                )}
              </TouchableOpacity>

              {/* {isTasksVisible && (
                [1, 2, 3].map((task, index) => (
                  <View key={index} style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.02,
                    borderRadius: dimensions.width * 0.04,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                    <View style={{
                      height: dimensions.height * 0.05,
                      width: dimensions.height * 0.05,
                      borderRadius: dimensions.width * 0.04,
                      borderColor: '#582D45',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: dimensions.width * 0.0025,
                      alignSelf: 'flex-start',
                    }}>
                      <Text style={[styles.montserratText, {
                        fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: '500',
                        color: '#582D45',
                      }]}>
                        {index + 1}
                      </Text>
                    </View>

                    <View key={index} style={{
                      width: dimensions.width * 0.75,
                      alignSelf: 'center',
                      backgroundColor: 'rgba(243, 203, 206, 1)',
                      borderRadius: dimensions.width * 0.04,
                      alignItems: 'center',
                      marginLeft: dimensions.width * 0.04,
                      paddingHorizontal: dimensions.width * 0.04,
                      paddingVertical: dimensions.height * 0.015,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        alignSelf: 'flex-start',
                      }}>
                        <Image
                          source={isTaskOpened
                            ? require('../assets/icons/timeIcon.png')
                            : require('../assets/icons/lockIcon.png')
                          }
                          style={{
                            width: dimensions.width * 0.06,
                            height: dimensions.width * 0.06,
                            marginRight: dimensions.width * 0.015,
                          }}
                          resizeMode="contain"
                        />
                        <Text style={[styles.montserratText, {
                          fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '400',
                          color: '#B27396'
                        }]}>
                          {isTaskOpened ? '10 minutes' : 'Locked'}
                        </Text>
                      </View>
                      <Text style={[styles.montserratText, {
                        fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500',
                        marginTop: dimensions.height * 0.01,
                        color: '#582D45'
                      }]}>
                        {isTaskOpened
                          ? 'Look through old photos and remember a good moment.'
                          : 'Finish first task to open this'
                        }
                      </Text>

                      {isTaskOpened && (
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          width: '100%',
                          marginTop: dimensions.height * 0.01,
                        }}>
                          <TouchableOpacity style={{
                            paddingHorizontal: dimensions.width * 0.04,
                            height: dimensions.height * 0.05,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: dimensions.width * 0.03,
                            backgroundColor: '#582D45',
                          }}>
                            <Text style={[styles.montserratText, {
                              fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: '500',
                              color: 'white'
                            }]}>
                              Start task
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={{
                            width: dimensions.height * 0.05,
                            height: dimensions.height * 0.05,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: dimensions.width * 0.03,
                            borderWidth: dimensions.width * 0.003,
                            borderColor: '#582D45',
                            marginHorizontal: dimensions.width * 0.02,
                          }}>
                            <Image
                              source={require('../assets/icons/shareSweetIcon.png')}
                              style={{
                                width: dimensions.height * 0.025,
                                height: dimensions.height * 0.025,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>

                          <TouchableOpacity style={{
                            width: dimensions.height * 0.05,
                            height: dimensions.height * 0.05,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: dimensions.width * 0.03,
                            backgroundColor: '#582D45',
                          }}>
                            <Image
                              source={require('../assets/icons/fullSweetHeartIcon.png')}
                              style={{
                                width: dimensions.height * 0.028,
                                height: dimensions.height * 0.028,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              )} */}


              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: dimensions.height * 0.05,
                  paddingBottom: dimensions.height * 0.14,
                  width: dimensions.width,
                }}
                disabled={!isTasksVisible}
              >
                {sweetTasks && isTasksVisible &&
                  sweetTasks.tasks.map((swTask, index) => {
                    // Таска розблокована, якщо це перша або попередня таска виконана:
                    const unlocked =
                      index === 0 || sweetTasks.tasks[index - 1].status === 'done';
                    return (
                      <View key={swTask.id} style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.02,
                        borderRadius: dimensions.width * 0.04,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}>
                        <View style={{
                          height: dimensions.height * 0.05,
                          width: dimensions.height * 0.05,
                          borderRadius: dimensions.width * 0.04,
                          borderColor: '#582D45',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: dimensions.width * 0.0025,
                          alignSelf: 'flex-start',
                        }}>
                          <Text style={[styles.montserratText, {
                            fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: '500',
                            color: '#582D45',
                          }]}>
                            {index + 1}
                          </Text>
                        </View>

                        <View style={{
                          width: dimensions.width * 0.75,
                          alignSelf: 'center',
                          backgroundColor: 'rgba(243, 203, 206, 1)',
                          borderRadius: dimensions.width * 0.04,
                          alignItems: 'center',
                          marginLeft: dimensions.width * 0.04,
                          paddingHorizontal: dimensions.width * 0.04,
                          paddingVertical: dimensions.height * 0.015,
                        }}>
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start',
                          }}>
                            <Image
                              source={isTaskOpened
                                ? require('../assets/icons/timeIcon.png')
                                : require('../assets/icons/lockIcon.png')
                              }
                              style={{
                                width: dimensions.width * 0.06,
                                height: dimensions.width * 0.06,
                                marginRight: dimensions.width * 0.015,
                              }}
                              resizeMode="contain"
                            />
                            <Text style={[styles.montserratText, {
                              fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '400',
                              color: '#B27396'
                            }]}>
                              {unlocked && swTask.status !== 'done' ? '10 minutes' : swTask.status === 'done' ? 'Done' : 'Locked'}
                            </Text>
                          </View>
                          <Text style={[styles.montserratText, {
                            fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500',
                            marginTop: dimensions.height * 0.01,
                            color: '#582D45'
                          }]}>
                            {unlocked
                              ? swTask.sweetTask
                              : 'Finish previous task to unlock'}
                          </Text>

                          {unlocked && swTask.status !== 'done' && (
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              width: '100%',
                              marginTop: dimensions.height * 0.01,
                            }}>
                              <TouchableOpacity style={{
                                paddingHorizontal: dimensions.width * 0.04,
                                height: dimensions.height * 0.05,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: dimensions.width * 0.03,
                                backgroundColor: '#582D45',
                              }}
                                onPress={() => handleAcceptChallenge(index)}
                                disabled={swTask.status === 'done'}
                              >
                                <Text style={[styles.montserratText, {
                                  fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: '500',
                                  color: 'white'
                                }]}>
                                  Start task
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={{
                                width: dimensions.height * 0.05,
                                height: dimensions.height * 0.05,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: dimensions.width * 0.03,
                                borderWidth: dimensions.width * 0.003,
                                borderColor: '#582D45',
                                marginHorizontal: dimensions.width * 0.02,
                              }}>
                                <Image
                                  source={require('../assets/icons/shareSweetIcon.png')}
                                  style={{
                                    width: dimensions.height * 0.025,
                                    height: dimensions.height * 0.025,
                                  }}
                                  resizeMode="contain"
                                />
                              </TouchableOpacity>

                              <TouchableOpacity style={{
                                width: dimensions.height * 0.05,
                                height: dimensions.height * 0.05,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: dimensions.width * 0.03,
                                backgroundColor: '#582D45',
                              }}>
                                <Image
                                  source={require('../assets/icons/fullSweetHeartIcon.png')}
                                  style={{
                                    width: dimensions.height * 0.028,
                                    height: dimensions.height * 0.028,
                                  }}
                                  resizeMode="contain"
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>

                        <View style={{ width: dimensions.width * 0.9, alignSelf: 'center' }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              width: dimensions.width * 0.9,
                              alignSelf: 'center',
                            }}
                          >
                            <View style={{ marginLeft: dimensions.width * 0.03, top: -dimensions.height * 0.005 }}>
                              <Text
                                style={{
                                  fontFamily: fontMontserratRegular,
                                  color: 'white',
                                  fontSize: dimensions.width * 0.04,
                                  textAlign: 'left',
                                  fontWeight: 500,
                                  maxWidth: dimensions.width * 0.7,
                                }}
                              >
                                {unlocked ? swTask.title : 'Locked'}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: fontMontserratRegular,
                                  color: 'white',
                                  fontSize: dimensions.width * 0.04,
                                  textAlign: 'left',
                                  fontWeight: 500,
                                  maxWidth: dimensions.width * 0.7,
                                }}
                              >
                                {unlocked
                                  ? swTask.sweetTask
                                  : 'Finish previous task to unlock'}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            width: dimensions.width * 0.9,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.019,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: dimensions.height * 0.025,
                          }}
                        >
                          {unlocked ? (
                            <TouchableOpacity
                              disabled={swTask.status === 'done'}
                              onPress={() => handleAcceptChallenge(index)}
                              style={{
                                width: dimensions.width * 0.43,
                                backgroundColor: swTask.status === 'done' ? '#FB8A8A' : '#9FE7B3',
                                borderRadius: dimensions.width * 0.025,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: dimensions.height * 0.05,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: fontMontserratRegular,
                                  color: 'black',
                                  fontSize: dimensions.width * 0.04,
                                  textAlign: 'left',
                                  fontWeight: 600,
                                }}
                              >
                                {swTask.status === 'done' ? 'Done' : 'Accept'}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={{
                                width: dimensions.width * 0.43,
                                backgroundColor: 'gray',
                                borderRadius: dimensions.width * 0.025,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: dimensions.height * 0.05,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: fontMontserratRegular,
                                  color: 'white',
                                  fontSize: dimensions.width * 0.04,
                                  textAlign: 'center',
                                  fontWeight: 600,
                                }}
                              >
                                Locked
                              </Text>
                            </View>
                          )}
                          {unlocked && (
                            <View
                              style={{
                                width: dimensions.width * 0.43,
                                backgroundColor: 'white',
                                borderRadius: dimensions.width * 0.025,
                                borderColor: swTask.status === 'done' ? '#9FE7B3' : '#FB8A8A',
                                borderWidth: dimensions.width * 0.01,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: dimensions.height * 0.05,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: fontMontserratRegular,
                                  color: 'black',
                                  fontSize: dimensions.width * 0.035,
                                  textAlign: 'left',
                                  fontWeight: 600,
                                }}
                              >
                                {swTask.status === 'done' ? swTask.elapsedTime : elapsedTime}
                              </Text>
                            </View>
                          )}
                        </View>
                        {unlocked && (
                          <TouchableOpacity
                            onPress={() => handleAcceptChallenge(index)}
                            disabled={swTask.status === 'done'}
                          >
                            <Image
                              source={require('../assets/icons/completeIcon.png')}
                              style={{
                                alignSelf: 'center',
                                width: dimensions.width * 0.14,
                                height: dimensions.height * 0.14,
                                top: -dimensions.height * 0.061,
                              }}
                              resizeMode='contain'
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}

                <View style={{
                  width: '90%',
                  backgroundColor: '#5C2E45',
                  marginTop: isTasksVisible ? dimensions.height * 0.02 : -dimensions.height * 0.02,
                  borderRadius: dimensions.width * 0.04,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: dimensions.height * 0.02,
                  paddingHorizontal: dimensions.width * 0.04,
                  alignSelf: 'center',
                }}>
                  <Image
                    source={require('../assets/icons/whiteRewardIcon.png')}
                    style={{
                      width: dimensions.height * 0.06,
                      height: dimensions.height * 0.06,
                      marginRight: dimensions.width * 0.03,
                    }}
                    resizeMode="contain"
                  />
                  <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: '500' }]}>
                    Your reward:
                  </Text>

                  <Text style={[styles.montserratText, {
                    fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: '400',
                    paddingHorizontal: dimensions.width * 0.07,
                    marginTop: dimensions.height * 0.01,
                  }]}>
                    Finish all daily tasks to unlock your daily reward
                  </Text>
                </View>
              </ScrollView>


            </>
          )}

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
      ) : choosedSweetScreen === 'My rewards' ? (
        <SweetMyRewardsScreen setChoosedSweetScreen={setChoosedSweetScreen} />
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

const mathSettingsStyles = (dimensions) => StyleSheet.create({
  header: {
    width: '90%',
    height: dimensions.height * 0.07,
    backgroundColor: '#5C2E45',
    borderRadius: dimensions.width * 0.04,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: dimensions.width * 0.05,
    alignSelf: 'center',
  },
  montserratText: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: fontMontserratRegular,
  },
});

export default SweetHomeScreenP;
