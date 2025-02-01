import React, { useState } from 'react';
import { View, Text, Dimensions, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import Animated, { 
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface OnboardingData {
  name: string;
  goal: string;
  frequency: string;
  experience: string;
}

type SlideType = 'text' | 'choice';

interface Slide {
  type: SlideType;
  title: string;
  field: keyof OnboardingData;
  placeholder?: string;
  choices?: string[];
  validation: (value: string) => boolean;
}

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    goal: '',
    frequency: '',
    experience: ''
  });
  const router = useRouter();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 50 : 0;

  const slides: Slide[] = [
    {
      type: 'text',
      title: "What's your name?",
      field: 'name',
      placeholder: "Enter your name",
      validation: (value: string) => value.length >= 2
    },
    {
      type: 'choice',
      title: "What's your experience level?",
      field: 'experience',
      choices: [
        "Beginner - New to working out",
        "Intermediate - Some experience",
        "Advanced - Regular workout routine",
        "Expert - Years of experience"
      ],
      validation: (value: string) => value.length > 0
    },
    {
      type: 'choice',
      title: "What's your fitness goal?",
      field: 'goal',
      choices: [
        "Build Muscle - Gain strength and size",
        "Lose Weight - Burn fat and get lean",
        "Stay Fit - Maintain current fitness",
        "Improve Health - Better overall wellness"
      ],
      validation: (value: string) => value.length > 0
    },
    {
      type: 'choice',
      title: "How often do you work out?",
      field: 'frequency',
      choices: [
        "2-3 times per week",
        "3-4 times per week",
        "4-5 times per week",
        "6+ times per week"
      ],
      validation: (value: string) => value.length > 0
    },
  ];

  const currentSlide = slides[step];
  const currentValue = formData[currentSlide.field];
  const isValidInput = currentSlide.validation(currentValue);

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentSlide.field]: value
    }));
  };

  const nextStep = () => {
    if (!isValidInput || isAnimating) return;

    if (step < slides.length - 1) {
      setSlideDirection('forward');
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      router.push('/home');
    }
  };

  const prevStep = () => {
    if (isAnimating || step === 0) return;

    setSlideDirection('backward');
    setIsAnimating(true);
    setTimeout(() => {
      setStep(step - 1);
      setIsAnimating(false);
    }, 300);
  };

  const renderInput = () => {
    if (currentSlide.type === 'text') {
      return (
        <TextInput
          mode='outlined'
          value={currentValue}
          onChangeText={handleInputChange}
          placeholder={currentSlide.placeholder}
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
      );
    }

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className='space-y-3'
      >
        {currentSlide.choices?.map((choice, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleInputChange(choice)}
            className={`px-4 py-5 mt-4 rounded-xl border ${
              currentValue === choice 
                ? 'bg-white border-white' 
                : 'border-neutral-700 bg-neutral-800/50'
            }`}
          >
            <Text 
              className={`text-lg font-medium ${
                currentValue === choice ? 'text-black' : 'text-white'
              }`}
            >
              {choice}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
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
          entering={slideDirection === 'forward' ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
          exiting={slideDirection === 'forward' ? SlideOutLeft.duration(300) : SlideOutRight.duration(300)}
          className='flex-1'
        >
          <View className='flex-1 space-y-8'>
            <Text className='text-white text-4xl font-bold tracking-wider mb-3'>
              {currentSlide.title}
            </Text>
            
            {renderInput()}
          </View>
        </Animated.View>

        {/* Buttons */}
        <View className='mb-12 gap-4'>
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

          {step > 0 && (
            <TouchableOpacity
              onPress={prevStep}
              className={`py-4 rounded-full w-full items-center 
                border border-neutral-600 bg-neutral-800/50`}
              disabled={isAnimating}
            >
              <Text className='text-lg font-medium text-white'>
                Back
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Onboarding;