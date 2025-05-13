import React from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontMontserratRegular = 'Montserrat-Regular';
const fontNunitoRegular = 'Nunito-Regular';

const SweetSettingsScreen = ({
    isSweetMusicOn,
    setSweetMusicOn,
    isSweetNotificationsOn,
    setSweetNotificationsOn,
    isSweetVibrOn,
    setSweetVibrOn
}) => {
    const dimensions = Dimensions.get('window');
    const styles = sweetStyles(dimensions);

    const sweetSaveSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    const toggleSweetSwitchOfSounds = () => {
        const newSweetSounsValue = !isSweetMusicOn;
        setSweetMusicOn(newSweetSounsValue);
        sweetSaveSettings('isSweetMusicOn', newSweetSounsValue);
    };

    const toggleSweetSwitchOfNotification = () => {
        const newSweetNotificationValue = !isSweetNotificationsOn;
        setSweetNotificationsOn(newSweetNotificationValue);
        sweetSaveSettings('isSweetNotificationsOn', newSweetNotificationValue);
    };

    const toggleSweetVibrationSwitch = () => {
        const newSweetVibrationValue = !isSweetVibrOn;
        setSweetVibrOn(newSweetVibrationValue);
        sweetSaveSettings('isSweetVibrationOn', newSweetVibrationValue);
    };

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            <View style={styles.header}>
                <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500' }]}>
                    Settings:
                </Text>
            </View>

            <View style={styles.settingsContainer}>
                <View style={styles.switchView}>
                    <Text style={styles.switchTexts}>Sound</Text>
                    <Switch
                        trackColor={{ false: 'rgba(120, 120, 128, 0.16)', true: 'rgba(52, 199, 89, 1)' }}
                        thumbColor={'#fff'}
                        ios_backgroundColor="rgba(120, 120, 128, 0.16)"
                        onValueChange={toggleSweetSwitchOfSounds}
                        value={isSweetMusicOn}
                    />
                </View>
                <View style={styles.switchView}>
                    <Text style={styles.switchTexts}>Vibration</Text>
                    <Switch
                        trackColor={{ false: 'rgba(120, 120, 128, 0.16)', true: 'rgba(52, 199, 89, 1)' }}
                        thumbColor={'#fff'}
                        ios_backgroundColor="rgba(120, 120, 128, 0.16)"
                        onValueChange={toggleSweetVibrationSwitch}
                        value={isSweetVibrOn}
                    />
                </View>
                <View style={[styles.switchView, {
                    borderBottomWidth: 0,
                }]}>
                    <Text style={styles.switchTexts}>Notification</Text>
                    <Switch
                        trackColor={{ false: 'rgba(120, 120, 128, 0.16)', true: 'rgba(52, 199, 89, 1)' }}
                        thumbColor={'#fff'}
                        ios_backgroundColor="rgba(120, 120, 128, 0.16)"
                        onValueChange={toggleSweetSwitchOfNotification}
                        value={isSweetNotificationsOn}
                    />
                </View>


            </View>
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
    settingsContainer: {
        width: '90%',
        paddingVertical: dimensions.height * 0.01,
        paddingHorizontal: dimensions.width * 0.05,
        alignSelf: 'center',
        backgroundColor: 'white',
        marginTop: dimensions.height * 0.02,
        borderRadius: dimensions.width * 0.03,
    },
    switchView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'rgba(84, 84, 86, 0.34)',
        borderBottomWidth: 0.5,
        borderRadius: 8,
    },
    switchTexts: {
        color: 'black',
        fontSize: dimensions.width * 0.05,
        fontFamily: fontNunitoRegular,
    }
});

export default SweetSettingsScreen;
