import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import sweetDataOfOnboarding from '../components/sweetDataOfOnboarding';
import { useNavigation } from '@react-navigation/native';

const fontMontserratRegular = 'Montserrat-Regular';

const EdgeOnboardingOfSweetScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [thisNathIndexSlide, setThisNathIndexSlide] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#FED9D3',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../assets/images/edgeOfSweetLogo.png')}
        style={{
          alignSelf: 'center',
          height: dimensions.height * 0.4,
          marginTop: dimensions.height * 0.1,
          width: dimensions.width * 0.7,
        }}
        resizeMode="contain"
      />
      <View style={{
        backgroundColor: '#F3CBCE',
        height: dimensions.height * 0.3,
        display: 'flex',
        borderTopLeftRadius: dimensions.width * 0.04,
        borderTopRightRadius: dimensions.width * 0.04,
        shadowColor: '#582D45',
        paddingTop: dimensions.height * 0.03,

        shadowOffset: {
          width: 0,
          height: -dimensions.height * 0.001,
        },

        shadowOpacity: 1,
        shadowRadius: 0,
      }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          width: dimensions.width,
          flex: 1,
        }}>
          <View style={{
            alignSelf: 'center',
            width: dimensions.width,
            alignItems: 'center',
          }}>
            <Text
              style={{
                color: '#582D45',
                textAlign: 'center',
                fontSize: dimensions.width * 0.06,
                paddingHorizontal: dimensions.width * 0.05,
                fontFamily: fontMontserratRegular,
                fontWeight: 700,
              }}>
              {sweetDataOfOnboarding[thisNathIndexSlide].sweetUpTitle}
            </Text>

            <Text
              style={{
                fontFamily: fontMontserratRegular,
                textAlign: 'center',
                marginTop: dimensions.height * 0.015,
                color: '#582D45',
                fontSize: dimensions.width * 0.04,
                paddingHorizontal: dimensions.width * 0.05,
              }}>
              {sweetDataOfOnboarding[thisNathIndexSlide].sweetDescription}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (thisNathIndexSlide >= sweetDataOfOnboarding.length - 1) {
            navigation.replace('SweetHomeScreenP');
          } else {
            setThisNathIndexSlide(thisNathIndexSlide + 1);
          }
        }}
        style={{
          alignItems: 'center',
          borderRadius: dimensions.width * 0.035,
          height: dimensions.height * 0.069,
          justifyContent: 'center',
          bottom: dimensions.height * 0.05,
          alignSelf: 'center',
          backgroundColor: '#D99CBE',
          width: '85%',
          position: 'absolute',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontFamily: fontMontserratRegular,
            fontSize: dimensions.width * 0.045,
            textAlign: 'center',
            fontWeight: 500
          }}>
          {'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EdgeOnboardingOfSweetScreen;
