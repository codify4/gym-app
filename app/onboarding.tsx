import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Animated, { 
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Redirect, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const slideAnim = useSharedValue(0);
  const router = useRouter();

  const slides = [
    {
      title: "What's your name?",
      input: "name",
      placeholder: "Enter your name",
    },
    {
      title: "What's your fitness goal?",
      input: "goal",
      placeholder: "e.g., Build muscle, Lose weight",
    },
    {
      title: "How often do you work out?",
      input: "frequency",
      placeholder: "e.g., 3 times a week",
    },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  const nextStep = () => {
    if (step < slides.length - 1) {
      slideAnim.value = withSpring(-width * (step + 1));
      setStep(step + 1);
    } else {
      router.push({pathname: '/home'});
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slidesContainer, animatedStyle]}>
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.title}>{slide.title}</Text>
            <TextInput
              mode="outlined"
              placeholder={slide.placeholder}
              style={styles.input}
              theme={{ colors: { primary: '#FF4757' } }}
            />
          </View>
        ))}
      </Animated.View>
      <Button
        mode="contained"
        onPress={nextStep}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        {step === slides.length - 1 ? 'Get Started' : 'Next'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  slidesContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  slide: {
    width,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#2A2A2A',
  },
  button: {
    margin: 20,
    padding: 8,
    borderRadius: 30,
    backgroundColor: '#FF4757',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Onboarding;