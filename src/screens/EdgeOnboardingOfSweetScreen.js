import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import sweetDataOfOnboarding from '../components/sweetDataOfOnboarding';
import { useNavigation } from '@react-navigation/native';

const fontMontserratRegular = 'Montserrat-Regular';

const EdgeOnboardingOfSweetScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [idOfTheSweetSlide, setIdOfTheSweetSlide] = useState(0);
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
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#FED9D3',
      }}
    >
      <Image
        source={require('../assets/images/edgeOfSweetLogo.png')}
        style={{
          width: dimensions.width * 0.7,
          height: dimensions.height * 0.4,
          marginTop: dimensions.height * 0.1,
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      <View style={{
        height: dimensions.height * 0.3,
        borderTopRightRadius: dimensions.width * 0.04,
        borderTopLeftRadius: dimensions.width * 0.04,
        backgroundColor: '#F3CBCE',
        shadowColor: '#582D45',
        paddingTop: dimensions.height * 0.03,
        display: 'flex',

        shadowOffset: {
          width: 0,
          height: -dimensions.height * 0.001,
        },

        shadowOpacity: 1,
        shadowRadius: 0,
      }}>
        <View style={{
          alignItems: 'center',
          width: dimensions.width,
          flex: 1,
          justifyContent: 'space-between',
        }}>
          <View style={{
            alignSelf: 'center',
            width: dimensions.width,
            alignItems: 'center',
          }}>
            <Text
              style={{
                fontWeight: 700,
                textAlign: 'center',
                fontSize: dimensions.width * 0.06,
                fontFamily: fontMontserratRegular,
                paddingHorizontal: dimensions.width * 0.05,
                color: '#582D45',
              }}>
              {sweetDataOfOnboarding[idOfTheSweetSlide].sweetUpTitle}
            </Text>

            <Text
              style={{
                color: '#582D45',
                textAlign: 'center',
                marginTop: dimensions.height * 0.015,
                paddingHorizontal: dimensions.width * 0.05,
                fontFamily: fontMontserratRegular,
                fontSize: dimensions.width * 0.04,
              }}>
              {sweetDataOfOnboarding[idOfTheSweetSlide].sweetDescription}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (idOfTheSweetSlide >= sweetDataOfOnboarding.length - 1) {
            navigation.replace('SweetHomeScreenP');
          } else {
            setIdOfTheSweetSlide(idOfTheSweetSlide + 1);
          }
        }}
        style={{
          alignItems: 'center',
          borderRadius: dimensions.width * 0.035,
          alignSelf: 'center',
          height: dimensions.height * 0.069,
          position: 'absolute',
          bottom: dimensions.height * 0.05,
          justifyContent: 'center',
          backgroundColor: '#D99CBE',
          width: '85%',
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
