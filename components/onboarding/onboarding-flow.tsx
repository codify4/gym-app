import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Input from '../input';
import MeasurementPicker from './picker';
import RNDateTimePicker  from "@react-native-community/datetimepicker"
import CircularProgress from './loading-circle';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';

interface OnboardingSlide {
  type: 'text' | 'choice' | 'date' | 'number' | 'measurement' | 'loading' | 'age';
  title: string;
  placeholder?: string;
  choices?: string[];
  unit?: string;
  min?: number;
  max?: number;
}

interface OnboardingInputProps {
  slide: OnboardingSlide;
  value: string;
  onChangeText: (text: string) => void;
}

export const OnboardingInput: React.FC<OnboardingInputProps> = ({
  slide,
  value,
  onChangeText,
}) => {
    const [loadingProgress, setLoadingProgress] = useState(0);


    // Loading animation effect
    React.useEffect(() => {
      if (slide.type === 'loading') {
        const interval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 1;
          });
        }, 30);

        return () => clearInterval(interval);
      }
    }, [slide.type]);

    if (slide.type === 'loading') {
      return <CircularProgress />;
    }

    if (slide.type === 'text') {
        return (
            <Input mode='outlined' value={value} onChangeText={onChangeText} placeholder={slide.placeholder} />
        );
    }

    if(slide.type === 'age') {
        const [selectedAge, setSelectedAge] = useState(value);
        
        const ageValues = Array.from({ length: 101 }, (_, i) => 5 + i);

        return (
            <View className="flex-1 ml-2">
                <View className="bg-transparent rounded-2xl overflow-hidden">
                    <Picker
                        selectedValue={selectedAge}
                        onValueChange={setSelectedAge}
                        dropdownIconColor="white"
                        style={{ color: 'white' }}
                        itemStyle={{ color: 'white' }}
                    >
                        {ageValues.map((age) => (
                            <Picker.Item
                                key={age}
                                label={age.toString()}
                                value={age.toString()}
                                color={Platform.OS === 'android' ? 'black' : 'white'}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
        )
    }

    if (slide.type === 'date') {
        const date = value ? new Date(value) : new Date();
        const formattedDate = value 
        ? new Date(value).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })
        : 'Select date';

        const onChange = (event: any, selectedDate?: Date) => {
            if (selectedDate) {
              onChangeText(selectedDate.toISOString())
            }
        }
      
        return (
            <View className='w-full'>
                <View className="rounded-xl p-4">
                    <RNDateTimePicker 
                        value={date}
                        mode="date"
                        display="spinner"
                        onChange={onChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                        textColor="white"
                        style={styles.datePicker}
                    />
                </View>
            </View>
        );
    }

    if (slide.type === 'measurement') {
        const [height, weight, heightUnit, weightUnit] = value.split(',');
        return (
            <View className='w-full h-full'>
                <MeasurementPicker
                    initialHeight={parseInt(height) || 165}
                    initialWeight={parseInt(weight) || 63}
                    onHeightChange={(newHeight, unit) => {
                        onChangeText(`${newHeight},${weight || ''},${unit},${weightUnit || ''}`);
                    }}
                    onWeightChange={(newWeight, unit) => {
                        onChangeText(`${height || ''},${newWeight},${heightUnit || ''},${unit}`);
                    }}
                />
            </View>
        );
    }

    if (slide.type === 'choice') {
        const onSelect = (choice: string) => {
            onChangeText(choice);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        };
        return (
            <ScrollView 
                showsVerticalScrollIndicator={false}
                className='space-y-3'
            >
                {slide.choices?.map((choice, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSelect(choice)}
                        className={`px-4 py-5 mt-4 rounded-xl border ${
                            value === choice 
                                ? 'bg-white border-white' 
                                : 'border-neutral-700 bg-neutral-800/50'
                        }`}
                    >
                        <Text 
                            className={`text-lg font-poppins-medium ${
                                value === choice ? 'text-black' : 'text-white'
                            }`}
                        >
                            {choice}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    datePicker: {
      backgroundColor: "transparent",
      alignSelf: "center",
      width: "100%",
      height: 200,
    },
  })