import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Input from '../input';
import MeasurementPicker from './picker';
import RNDateTimePicker  from "@react-native-community/datetimepicker"

interface OnboardingSlide {
  type: 'text' | 'choice' | 'date' | 'number' | 'measurement';
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
    const [showDatePicker, setShowDatePicker] = useState(false)

    if (slide.type === 'text') {
        return (
            <Input mode='outlined' value={value} onChangeText={onChangeText} placeholder={slide.placeholder} />
        );
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
        return (
            <ScrollView 
                showsVerticalScrollIndicator={false}
                className='space-y-3'
            >
                {slide.choices?.map((choice, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onChangeText(choice)}
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