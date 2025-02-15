import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Input from './input';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MeasurementPicker from './picker';

interface OnboardingSlide {
  type: 'text' | 'choice' | 'date' | 'number';
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

        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

        return (
            <View className='w-full'>
                <TouchableOpacity
                    onPress={() => setDatePickerVisibility(true)}
                    className='px-4 py-5 rounded-xl border border-neutral-700 bg-neutral-800/50 w-full'
                >
                    <Text className='text-lg text-white font-poppins'>
                        {formattedDate}
                    </Text>
                </TouchableOpacity>

                <DateTimePicker
                    isVisible={isDatePickerVisible}
                    onConfirm={(date) => {
                        onChangeText(date.toISOString());
                        setDatePickerVisibility(false);
                    }}
                    onCancel={() => setDatePickerVisibility(false)}
                    mode="date"
                    date={date}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    buttonTextColorIOS='white'
                    timePickerModeAndroid='default'
                    pickerContainerStyleIOS={{ alignSelf: "center", width: "100%", alignItems: "center" }}
                />
            </View>
        );
    }

    if (slide.type === 'number') {
        return (
            <View className='w-full h-full p-5'>
                <MeasurementPicker
                    initialHeight={165}
                    initialWeight={63}
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