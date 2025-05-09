import React from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Switch,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native-animatable';

const fontMontserratRegular = 'Montserrat-Regular';
const fontNunitoRegular = 'Nunito-Regular';

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

const SweetProgressScreen = ({}) => {
    const dimensions = Dimensions.get('window');
    const styles = mathSettingsStyles(dimensions);

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            <View style={styles.header}>
                <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.04, textAlign: 'left', alignSelf: 'flex-start', fontWeight: '500' }]}>
                    My progress:
                </Text>
            </View>

            {levels.map((level, index) => (
                <View key={level.id} style={{
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
                            source={level.image}
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
                            {level.name}
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
            ))}

            <TouchableOpacity style={{
                width: '90%',
                height: dimensions.height * 0.07,
                backgroundColor: '#D99CBE',
                marginTop: dimensions.height * 0.02,
                borderRadius: dimensions.width * 0.04,
                alignSelf: 'center',
                justifyContent: 'center',
            }} onPress={() => {

            }}>
                <Text style={[styles.montserratText, { fontSize: dimensions.width * 0.045, textAlign: 'center', alignSelf: 'center', fontWeight: '400' }]}>
                    Share my progress
                </Text> 
            </TouchableOpacity>
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

export default SweetProgressScreen;
