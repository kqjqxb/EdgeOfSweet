import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native-animatable';

const fontMontserratRegular = 'Montserrat-Regular';

const SweetMyRewardsScreen = ({ }) => {
    const dimensions = Dimensions.get('window');
    const styles = mathSettingsStyles(dimensions);

    const [sweetSavedElements, setSweetSavedElements] = useState([1]);

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            <View style={styles.header}>
                <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500' }]}>
                    My rewards:
                </Text>
            </View>
            {sweetSavedElements.length === 0 ? (
                <Text style={[styles.montserratText, {
                    fontSize: dimensions.width * 0.04, textAlign: 'center', alignSelf: 'center', fontWeight: '500',
                    marginTop: dimensions.height * 0.05,
                    color: '#582D45'
                }]}>
                    There are no rewards yet
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
                    {sweetSavedElements.map((sweetSavedEl, index) => (
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
                                    Reward for 12.04.2025
                                </Text>
                            </View>

                            <Text style={[styles.montserratText, {
                                fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500',
                                marginTop: dimensions.height * 0.01,
                                color: '#582D45'
                            }]}>
                                Look through old photos and remember a good moment.
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
                            }}>
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
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
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

export default SweetMyRewardsScreen;
