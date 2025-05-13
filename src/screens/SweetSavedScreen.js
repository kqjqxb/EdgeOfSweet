import React from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Share
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native-animatable';
import sweetTasksData from '../components/sweetTasksData';

const fontMontserratRegular = 'Montserrat-Regular';

const SweetSavedScreen = ({ sweetFavTasks, setSweetFavTasks }) => {
    const dimensions = Dimensions.get('window');
    const styles = sweetStyles(dimensions);

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            <View style={styles.header}>
                <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500' }]}>
                    Saved:
                </Text>
            </View>
            {sweetFavTasks.length === 0 ? (
                <Text style={[styles.montserratText, {
                    fontSize: dimensions.width * 0.04, textAlign: 'center', alignSelf: 'center', fontWeight: '500',
                    marginTop: dimensions.height * 0.05,
                    color: '#582D45'
                }]}>
                    There are no saved tasks yet
                </Text>
            ) : (
                <ScrollView style={{
                    width: '100%',
                    alignSelf: 'center',
                }} showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: dimensions.height * 0.14,
                    }}
                >
                    {sweetTasksData.filter(task => sweetFavTasks.includes(task.id)).map((sweetSavedEl, index) => (
                        <View key={index} style={{
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
                                    source={require('../assets/icons/timeIcon.png')}
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
                                    10 minutes
                                </Text>
                            </View>

                            <Text style={[styles.montserratText, {
                                fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500',
                                marginTop: dimensions.height * 0.01,
                                color: '#582D45'
                            }]}>
                                {sweetSavedEl.sweetTask}
                            </Text>

                            <View style={{
                                marginTop: dimensions.height * 0.01,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                width: '100%',
                            }}>
                                <TouchableOpacity style={{
                                    width: dimensions.width * 0.12,
                                    height: dimensions.width * 0.12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: dimensions.width * 0.03,
                                    borderWidth: dimensions.width * 0.003,
                                    borderColor: '#582D45',
                                }}
                                    onPress={() => {
                                        Share.share({
                                            message: `I completed the task '${sweetSavedEl.sweetTask}'`,
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

                                <TouchableOpacity style={{
                                    width: dimensions.width * 0.12,
                                    height: dimensions.width * 0.12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: dimensions.width * 0.03,
                                    backgroundColor: '#582D45',
                                    marginLeft: dimensions.width * 0.025,
                                }}
                                    onPress={async () => {
                                        try {
                                            const storedFav = await AsyncStorage.getItem('sweetFavTasks');
                                            let favTasks = storedFav ? JSON.parse(storedFav) : [];
                                            const taskId = sweetSavedEl.id; 
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
                                    }}
                                >
                                    <Image
                                        source={require('../assets/icons/fullSweetHeartIcon.png')}
                                        style={{
                                            width: dimensions.width * 0.07,
                                            height: dimensions.width * 0.07,
                                        }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const sweetStyles = (dimensions) => StyleSheet.create({
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

export default SweetSavedScreen;
