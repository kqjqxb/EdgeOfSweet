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
  Share,
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
import sweetRewards from '../components/sweetRewards';

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
  const [userRewards, setUserRewards] = useState([]);
  const [notAvailableRewards, setNotAvailableRewards] = useState([]);
  const [currentReward, setCurrentReward] = useState(null);
  const [levelPoints, setLevelPoints] = useState(0);

  const [sweetTasks, setSweetTasks] = useState(null);
  const [timeCompletedDSTask, setTimeCompletedDSTask] = useState(null);
  const [isSweetTaskAvailable, setIsSweetTaskAvailable] = useState(true);
  const [sweetFavTasks, setSweetFavTasks] = useState([]);

  useEffect(() => {
    console.log('\n\nsweetFavTasks', sweetFavTasks);
    const loadFavTasks = async () => {
      try {
        const storedFav = await AsyncStorage.getItem('sweetFavTasks');
        if (storedFav) {
          setSweetFavTasks(JSON.parse(storedFav));
        }
      } catch (error) {
        console.error('Error loading sweetFavTasks:', error);
      }
    };
    loadFavTasks();
  }, [choosedSweetScreen]);

  useEffect(() => {
    const loadTimeCompleted = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('timeCompletedDSTask');
        if (storedTime) {
          setTimeCompletedDSTask(JSON.parse(storedTime));
        } else {
          setTimeCompletedDSTask(null);
        }
      } catch (error) {
        console.error('Error loading timeCompletedDSTask:', error);
      }
    };
    loadTimeCompleted();
  }, []);

  useEffect(() => {
    console.log('sweetTasks', sweetTasks);
  }, [sweetTasks]);

  useEffect(() => {
    const loadUserRewards = async () => {
      try {
        const storedUserRewards = await AsyncStorage.getItem('userRewards');

        if (storedUserRewards !== null) {
          setUserRewards(JSON.parse(storedUserRewards));
        } else {
          await AsyncStorage.setItem('userRewards', JSON.stringify([]));
          setUserRewards([]);
        }

        const storedAwailableRewards = await AsyncStorage.getItem('notAvailableRewards');

        if (storedAwailableRewards !== null) {
          setNotAvailableRewards(JSON.parse(storedAwailableRewards));
        } else {
          await AsyncStorage.setItem('notAvailableRewards', JSON.stringify([]));
          setNotAvailableRewards([]);
        }

        const storedCurrentReward = await AsyncStorage.getItem('currentReward');
        if (storedCurrentReward !== null) {
          setCurrentReward(JSON.parse(storedCurrentReward));
        }

        const storedLevelPoints = await AsyncStorage.getItem('levelPoints');
        if (storedLevelPoints !== null) {
          setLevelPoints(JSON.parse(storedLevelPoints));
        }
      } catch (error) {
        console.error('Error loading userRewards:', error);
      }
    };
    loadUserRewards();
  }, []);

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

  useEffect(() => {
    console.log('levelPoints', levelPoints);
  }, [levelPoints]);


  const handleAcceptChallenge = async (index) => {
    if (typeof isSweetVibrOn !== 'undefined' && isSweetVibrOn) {
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }

    const updatedChallenges = [...sweetTasks.tasks];

    if (updatedChallenges[index].status === 'in progress') {
      updatedChallenges[index].status = 'done';
      updatedChallenges[index].endTime = new Date().toISOString();
      updatedChallenges[index].elapsedTime = getElapsedTime(updatedChallenges[index].startTime);
    }
    else if (updatedChallenges[index].status === 'pending') {
      updatedChallenges[index].status = 'in progress';
      updatedChallenges[index].startTime = new Date().toISOString();
    }

    const updatedCurrentChallenge = {
      ...sweetTasks,
      tasks: updatedChallenges,
    };

    setSweetTasks(updatedCurrentChallenge);
    await saveCurrentChallenge(updatedCurrentChallenge);

    if (updatedChallenges.every(swTask => swTask.status === 'done')) {
      const currentTime = new Date().toISOString();

      const updatedLevelPoints = levelPoints + 1;
      setLevelPoints(updatedLevelPoints);
      await AsyncStorage.setItem('levelPoints', JSON.stringify(updatedLevelPoints));

      generateSweetReward();
      setIsTasksVisible(false);
      try {
        const updatedJournalEntry = {
          tasks: updatedChallenges,
          allCompletedDate: new Date().toISOString(),
          timeCompletedDSTask: currentTime,
        };
        await AsyncStorage.setItem('sweetTasks', JSON.stringify(updatedJournalEntry));
      } catch (error) {
        console.error('Error saving to sweetTasks:', error);
      }
    }
  };

  const checkTaskAvailable = (completedTimeStr) => {
    if (!completedTimeStr) return true;
    const completedTime = new Date(completedTimeStr);
    // Обчислюємо наступну опівночі після часу завершення
    const nextAvailable = new Date(
      completedTime.getFullYear(),
      completedTime.getMonth(),
      completedTime.getDate() + 1,
      0, 0, 0
    );
    return new Date() >= nextAvailable;
  };

  useEffect(() => {
    setIsSweetTaskAvailable(checkTaskAvailable(timeCompletedDSTask));
  }, [timeCompletedDSTask]);

  useEffect(() => {
    console.log('userRewards', userRewards);
    console.log('notAvailableRewards', notAvailableRewards);
  }, [userRewards, notAvailableRewards]);

  const generateSweetReward = async () => {
    let candidateRewards = sweetRewards.filter(reward => {
      return !notAvailableRewards.some(avReward => avReward.id === reward.id);
    });

    if (candidateRewards.length === 0) {
      candidateRewards = [...sweetRewards];
    }

    if (notAvailableRewards.length >= 20) {
      try {
        await AsyncStorage.setItem('notAvailableRewards', JSON.stringify([]));
        setNotAvailableRewards([]);
      } catch (error) {
        console.error('Error clearing notAvailableRewards:', error);
      }
    }

    const newReward = candidateRewards[Math.floor(Math.random() * candidateRewards.length)];

    const updatedRewards = [...notAvailableRewards, newReward];
    setNotAvailableRewards(updatedRewards);

    const newUserNewReward = {
      ...newReward,
      receivedDate: new Date().toISOString()
    }
    const updatedUserRewards = [...userRewards, newUserNewReward];
    setUserRewards(updatedUserRewards);
    await AsyncStorage.setItem('userRewards', JSON.stringify(updatedUserRewards));

    setCurrentReward(newReward);
    await AsyncStorage.setItem('currentReward', JSON.stringify(newReward));

    try {
      await AsyncStorage.setItem('notAvailableRewards', JSON.stringify(updatedRewards));
    } catch (error) {
      console.error('Error saving notAvailableRewards:', error);
    }
  };

  const saveCurrentChallenge = async (swTask) => {
    try {
      await AsyncStorage.setItem('sweetTasks', JSON.stringify(swTask));
    } catch (error) {
      console.error('Error saving sweetTasks:', error);
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
    const data = { tasks: selectedTasks, allCompletedDate: null };
    try {
      await AsyncStorage.setItem('sweetTasks', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving sweetTasks:', error);
    }
    setSweetTasks(data);
    return data;
  }

  const getElapsedTime = (startTime) => {
    if (!startTime) return '00:00:00';

    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;

    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const styles = mathSettingsStyles(dimensions);


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

  const getLevelInfo = (levelPoints) => {
    if (levelPoints < 1) {
      return { level: levels[0], start: 0, end: 10, progress: 0 };
    } else if (levelPoints <= 10) {
      return { level: levels[0], start: 1, end: 10, progress: levelPoints / 10 };
    } else if (levelPoints <= 20) {
      return { level: levels[1], start: 11, end: 20, progress: (levelPoints - 10) / 10 };
    } else if (levelPoints <= 30) {
      return { level: levels[2], start: 21, end: 30, progress: (levelPoints - 20) / 10 };
    } else if (levelPoints <= 40) {
      return { level: levels[3], start: 31, end: 40, progress: (levelPoints - 30) / 10 };
    } else if (levelPoints < 50) {
      return { level: levels[4], start: 41, end: 50, progress: (levelPoints - 40) / 10 };
    } else {
      return { level: levels[4], start: 41, end: 50, progress: 1 };
    }
  };

  const levelInfo = getLevelInfo(levelPoints);

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
                source={levelInfo.level.image}
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
                fontSize: dimensions.width * 0.04,
                textAlign: 'left',
                alignSelf: 'flex-start',
                fontWeight: '500',
                color: '#582D45'
              }]}>
                {levelInfo.level.name}
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
                  width: dimensions.width * 0.65 * levelInfo.progress, // заповнення шкали відповідно до progress
                  height: dimensions.height * 0.019,
                  backgroundColor: '#582D45',
                  borderRadius: dimensions.width * 0.04,
                  position: 'absolute',
                  left: 0,
                }} />
              </View>
            </View>
          </View>
          {isSweetTaskAvailable ? (
            !sweetTasks || sweetTasks.length === 0 ? (
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


                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: dimensions.height * 0.14,
                    width: dimensions.width,
                  }}
                  disabled={!isTasksVisible}
                >
                  {sweetTasks && isTasksVisible &&
                    sweetTasks.tasks.map((swTask, index) => {

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
                                source={!unlocked
                                  ? require('../assets/icons/lockIcon.png')
                                  : swTask.status === 'done'
                                    ? require('../assets/icons/completeIcon.png')
                                    : require('../assets/icons/timeIcon.png')
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

                            {swTask.status !== 'done' && (
                              <Text style={[styles.montserratText, {
                                fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500',
                                marginTop: dimensions.height * 0.01,
                                color: '#582D45'
                              }]}>
                                {unlocked
                                  ? swTask.sweetTask
                                  : 'Finish previous task to unlock'}
                              </Text>
                            )}

                            {unlocked && swTask.status !== 'done' && (
                              <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                width: '100%',
                                marginTop: dimensions.height * 0.01,
                              }}>
                                <TouchableOpacity style={{
                                  width: dimensions.width * 0.3,
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
                                    {swTask.status === 'pending' ? 'Start task' : 'Finish'}
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
                                }}
                                  onPress={() => {
                                    Share.share({
                                      message: `My task is '${swTask.sweetTask}'`,
                                    });
                                    if (typeof isSweetVibrOn !== 'undefined' && isSweetVibrOn) {
                                      ReactNativeHapticFeedback.trigger("impactLight", {
                                        enableVibrateFallback: true,
                                        ignoreAndroidSystemSettings: false,
                                      });
                                    }
                                  }}
                                >
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
                                  backgroundColor: sweetFavTasks.includes(swTask.id) ? '#582D45' : 'transparent',
                                  borderWidth: dimensions.width * 0.003,
                                  borderColor: '#582D45',
                                }}
                                  onPress={async () => {
                                    console.log('pressed');
                                    try {
                                      const storedFav = await AsyncStorage.getItem('sweetFavTasks');
                                      let favTasks = storedFav ? JSON.parse(storedFav) : [];
                                      const taskId = swTask.id; // переконайтеся, що swTask.id існує
                                      if (favTasks.includes(taskId)) {
                                        favTasks = favTasks.filter(id => id !== taskId);
                                        console.log(`Removed task ${taskId}`);
                                      } else {
                                        favTasks.unshift(taskId);
                                        console.log(`Added task ${taskId}`);
                                      }
                                      await AsyncStorage.setItem('sweetFavTasks', JSON.stringify(favTasks));
                                      setSweetFavTasks(favTasks);
                                      console.log('Updated favTasks:', favTasks);
                                    } catch (err) {
                                      console.error('Error toggling favourite task:', err);
                                    }
                                  }}>
                                  <Image
                                    source={ !sweetFavTasks.includes(swTask.id)
                                      ? require('../assets/icons/sweetPurpleHeart.png')
                                      : require('../assets/icons/fullSweetHeartIcon.png')
                                    }
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
                      );
                    })}

                  {sweetTasks.tasks.filter((task) => task.status === 'done').length < 3 ? (
                    <View style={{
                      width: '90%',
                      backgroundColor: '#5C2E45',
                      marginTop: dimensions.height * 0.02,
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
                  ) : (
                    <>
                      <View style={[styles.header, {
                        marginTop: dimensions.height * 0.02,
                      }]}>
                        <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500' }]}>
                          Your reward:
                        </Text>
                      </View>

                      <View style={{
                        width: '90%',
                        alignSelf: 'center',
                        paddingVertical: dimensions.height * 0.015,
                        paddingHorizontal: dimensions.width * 0.05,
                        backgroundColor: 'rgba(243, 203, 206, 1)',
                        marginTop: dimensions.height * 0.02,
                        borderRadius: dimensions.width * 0.04,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          width: '100%',
                        }}>
                          <Image
                            source={require('../assets/icons/rewardIcon.png')}
                            style={{
                              width: dimensions.width * 0.06,
                              height: dimensions.width * 0.06,
                              marginRight: dimensions.width * 0.02,
                            }}
                            resizeMode="contain"
                          />
                          <Text style={[styles.montserratText, {
                            fontSize: dimensions.width * 0.04, textAlign: 'left', fontWeight: '400',
                            color: '#B27396'
                          }]}>
                            Daily Affirmation
                          </Text>
                        </View>

                        <Text style={[styles.montserratText, {
                          fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500',
                          marginTop: dimensions.height * 0.01,
                          color: '#582D45'
                        }]}>
                          {currentReward ? currentReward.sweetReward : 'Look through old photos and remember a good moment.'}
                        </Text>

                        <TouchableOpacity style={{
                          width: dimensions.width * 0.12,
                          height: dimensions.width * 0.12,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: dimensions.width * 0.03,
                          borderWidth: dimensions.width * 0.003,
                          borderColor: '#582D45',
                          marginTop: dimensions.height * 0.01,
                          alignSelf: 'flex-start',
                        }}
                          onPress={() => {
                            Share.share({
                              message: `I received a reward '${currentReward.sweetReward}'.`,
                            });
                          }}
                        >
                          <Image
                            source={require('../assets/icons/shareSweetIcon.png')}
                            style={{
                              width: dimensions.width * 0.06,
                              height: dimensions.width * 0.06,
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={async () => {
                          await AsyncStorage.removeItem('sweetTasks');
                          setSweetTasks(null);
                          await AsyncStorage.removeItem('currentReward');
                          setCurrentReward(null);
                        }}
                      >
                        <Image
                          source={require('../assets/images/finishButton.png')}
                          style={{
                            width: '90%',
                            height: dimensions.height * 0.07,
                            marginTop: dimensions.height * 0.02,
                            alignSelf: 'center',
                            borderRadius: dimensions.width * 0.04,
                          }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </ScrollView>
              </>
            )
          ) : (
            <>
              <Image
                source={require('../assets/images/notAvailableTasks.png')}
                style={{
                  width: dimensions.width * 0.85,
                  height: dimensions.height * 0.25,
                  marginVertical: dimensions.height * 0.015,
                }}
                resizeMode='contain'
              />
              <Text style={[styles.montserratText, {
                fontSize: dimensions.width * 0.053, textAlign: 'center', alignSelf: 'center', fontWeight: '500',
                marginTop: dimensions.height * 0.01,
                color: '#582D45'
              }]}>
                Your daily ritual was finished!
              </Text>

              <Text style={[styles.montserratText, {
                fontSize: dimensions.width * 0.045, textAlign: 'center', alignSelf: 'center', fontWeight: '400',
                marginTop: dimensions.height * 0.01,
                color: '#582D45'
              }]}>
                Bring back tomorrow!
              </Text>
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
        <SweetProgressScreen setChoosedSweetScreen={setChoosedSweetScreen} levelPoints={levelPoints} />
      ) : choosedSweetScreen === 'Saved' ? (
        <SweetSavedScreen setChoosedSweetScreen={setChoosedSweetScreen} sweetFavTasks={sweetFavTasks} setSweetFavTasks={setSweetFavTasks}/>
      ) : choosedSweetScreen === 'My rewards' ? (
        <SweetMyRewardsScreen setChoosedSweetScreen={setChoosedSweetScreen} userRewards={userRewards} />
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
