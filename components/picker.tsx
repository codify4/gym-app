import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface MeasurementPickerProps {
  onHeightChange?: (height: number) => void;
  onWeightChange?: (weight: number) => void;
  initialHeight?: number;
  initialWeight?: number;
}

export default function MeasurementPicker({
  onHeightChange,
  onWeightChange,
  initialHeight = 165,
  initialWeight = 63,
}: MeasurementPickerProps) {
  const [selectedHeight, setSelectedHeight] = useState(initialHeight);
  const [selectedWeight, setSelectedWeight] = useState(initialWeight);

  // Generate height values (150-200 cm)
  const heightValues = Array.from({ length: 51 }, (_, i) => 150 + i);
  // Generate weight values (40-120 kg)
  const weightValues = Array.from({ length: 81 }, (_, i) => 40 + i);

  return (
    <View className="bg-black p-5 w-full">
      <View className="flex-row justify-between mb-6">
        <Text className="text-white text-2xl font-bold">Height</Text>
        <Text className="text-white text-2xl font-bold">Weight</Text>
      </View>
      
      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <View className="bg-zinc-900 rounded-xl overflow-hidden">
            <Picker
              selectedValue={selectedHeight}
              onValueChange={(value) => {
                setSelectedHeight(value);
                onHeightChange?.(value);
              }}
              dropdownIconColor="white"
              className="text-white h-72"
            >
              {heightValues.map((height) => (
                <Picker.Item
                  key={height}
                  label={`${height} cm`}
                  value={height}
                  color="white"
                />
              ))}
            </Picker>
          </View>
        </View>

        <View className="flex-1 ml-2">
          <View className="bg-zinc-900 rounded-xl overflow-hidden">
            <Picker
              selectedValue={selectedWeight}
              onValueChange={(value) => {
                setSelectedWeight(value);
                onWeightChange?.(value);
              }}
              dropdownIconColor="white"
              className="text-white h-72"
            >
              {weightValues.map((weight) => (
                <Picker.Item
                  key={weight}
                  label={`${weight} kg`}
                  value={weight}
                  color="white"
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
}