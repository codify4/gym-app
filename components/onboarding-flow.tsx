import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Input from './input';
import BotSheet from './bot-sheet';
import DateTimePicker from 'react-native-modal-datetime-picker';

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
        const [showPicker, setShowPicker] = useState(false);
        const numValue = value ? parseInt(value) : slide.min || 0;
        const formattedValue = `${numValue}${slide.unit ? ` ${slide.unit}` : ''}`;

        // Generate numbers array based on min/max
        const numbers = Array.from(
            { length: (slide.max || 250) - (slide.min || 0) + 1 },
            (_, i) => (slide.min || 0) + i
        );

        return (
            <View className='w-full'>
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    className='px-4 py-5 rounded-xl border border-neutral-700 bg-neutral-800/50 w-full'
                >
                    <Text className='text-lg text-white font-poppins'>
                        {formattedValue}
                    </Text>
                </TouchableOpacity>

                <Modal
                    visible={showPicker}
                    transparent
                    animationType="slide"
                >
                    <View className='flex-1 justify-end bg-black/50'>
                        <View className='bg-neutral-900 rounded-t-3xl'>
                            <View className='flex-row justify-between items-center p-4 border-b border-neutral-800'>
                                <TouchableOpacity 
                                    onPress={() => setShowPicker(false)}
                                    className='px-4 py-2'
                                >
                                    <Text className='text-neutral-400 text-lg font-poppins'>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => setShowPicker(false)}
                                    className='px-4 py-2'
                                >
                                    <Text className='text-white text-lg font-medium font-poppins'>Confirm</Text>
                                </TouchableOpacity>
                            </View>

                            <View className='px-4 py-2'>
                                <Picker
                                    selectedValue={numValue.toString()}
                                    onValueChange={(itemValue) => {
                                        onChangeText(itemValue.toString());
                                    setShowPicker(false);
                                    }}
                                    style={{ color: 'white' }}
                                    renderToHardwareTextureAndroid
                                >
                                    {numbers.map((num) => (
                                        <Picker.Item 
                                            key={num} 
                                            label={`${num}${slide.unit ? ` ${slide.unit}` : ''}`}
                                            value={num.toString()}
                                            color='white'
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                </Modal>
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