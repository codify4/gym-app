import React, { useState } from 'react';
import { View, Text, Dimensions, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import Animated, { 
  FadeIn,
  SlideInRight,
  SlideOutLeft,
  FadeOut,
  runOnJS
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface OnboardingData {
  name: string;
  goal: string;
  frequency: string;
}

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    goal: '',
    frequency: ''
  });
  const router = useRouter();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 50 : 0;

  const slides = [
    {
      title: "What's your name?",
      placeholder: "Enter your name",
      field: 'name' as keyof OnboardingData,
      validation: (value: string) => value.length >= 2
    },
    {
      title: "What's your fitness goal?",
      placeholder: "e.g., Build muscle, Lose weight",
      field: 'goal' as keyof OnboardingData,
      validation: (value: string) => value.length >= 3
    },
    {
      title: "How often do you work out?",
      placeholder: "e.g., 3 times a week",
      field: 'frequency' as keyof OnboardingData,
      validation: (value: string) => value.length >= 3
    },
  ];

  const currentValue = formData[slides[step].field];
  const isValidInput = slides[step].validation(currentValue);

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [slides[step].field]: value
    }));
  };

  const nextStep = () => {
    if (!isValidInput || isAnimating) return;

    if (step < slides.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 300); // Wait for exit animation to complete
    } else {
      console.log('Completed onboarding with data:', formData);
      router.push('/home');
    }
  };

  return (
    <KeyboardAvoidingView 
      className='flex-1 bg-neutral-900' 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View className='flex-1 px-6 pt-20'>
        {/* Progress Indicator */}
        <View className='flex-row justify-between mb-12 px-2'>
          {slides.map((_, index) => (
            <View 
              key={index} 
              className={`h-1.5 rounded-full flex-1 mx-1 ${
                index <= step ? 'bg-white' : 'bg-neutral-700'
              }`}
            />
          ))}
        </View>

        {/* Question and Input */}
        <Animated.View 
          key={step}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          className='flex-1'
        >
          <View className='space-y-8'>
            <Text className='text-white text-4xl font-bold tracking-wider mb-3'>
              {slides[step].title}
            </Text>
            
            <TextInput
              mode='outlined'
              value={currentValue}
              onChangeText={handleInputChange}
              placeholder={slides[step].placeholder}
              placeholderTextColor="#9ca3af"
              style={{ height: 60 }}
              theme={{
                colors: {
                  primary: 'white',
                  text: 'white',
                  placeholder: '#9ca3af',
                  background: '#262626'
                },
                roundness: 10
              }}
              autoFocus
            />
          </View>
        </Animated.View>

        {/* Next Button */}
        <View className='mb-12'>
          <TouchableOpacity
            onPress={nextStep}
            className={`py-4 rounded-full w-full items-center ${
              isValidInput && !isAnimating ? 'bg-white' : 'bg-neutral-700'
            }`}
            disabled={!isValidInput || isAnimating}
          >
            <Text 
              className={`text-xl font-semibold ${
                isValidInput && !isAnimating ? 'text-black' : 'text-neutral-400'
              }`}
            >
              {step === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Onboarding;