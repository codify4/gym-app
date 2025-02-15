import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface MeasurementPickerProps {
  onHeightChange?: (height: number, unit: string) => void;
  onWeightChange?: (weight: number, unit: string) => void;
  initialHeight?: number;
  initialWeight?: number;
}

export default function MeasurementPicker({
  onHeightChange,
  onWeightChange,
  initialHeight = 165,
  initialWeight = 63,
}: MeasurementPickerProps) {
  const [isMetric, setIsMetric] = useState(true);
  const [selectedHeight, setSelectedHeight] = useState(initialHeight);
  const [selectedWeight, setSelectedWeight] = useState(initialWeight);

  const heightValues = isMetric
    ? Array.from({ length: 121 }, (_, i) => 100 + i) // 100-220 cm
    : Array.from({ length: 60 }, (_, i) => 48 + i); // 4'0" - 7'11"

  const weightValues = isMetric
    ? Array.from({ length: 201 }, (_, i) => 30 + i) // 30-230 kg
    : Array.from({ length: 401 }, (_, i) => 66 + i); // 66-466 lbs

  const formatHeight = (value: number) => {
    if (isMetric) return `${value} cm`;
    const feet = Math.floor(value / 12);
    const inches = value % 12;
    return `${feet}'${inches}"`;
  };

  const formatWeight = (value: number) => {
    return isMetric ? `${value} kg` : `${value} lbs`;
  };

  const handleHeightChange = (value: number) => {
    setSelectedHeight(value);
    onHeightChange?.(value, isMetric ? 'cm' : 'in');
  };

  const handleWeightChange = (value: number) => {
    setSelectedWeight(value);
    onWeightChange?.(value, isMetric ? 'kg' : 'lbs');
  };

  const toggleUnit = () => {
    setIsMetric(!isMetric);
    if (isMetric) {
      // Convert to imperial
      setSelectedHeight(Math.round(selectedHeight / 2.54));
      setSelectedWeight(Math.round(selectedWeight * 2.205));
    } else {
      // Convert to metric
      setSelectedHeight(Math.round(selectedHeight * 2.54));
      setSelectedWeight(Math.round(selectedWeight / 2.205));
    }
  };

  return (
    <View className="flex flex-col items-center justify-center bg-black p-5 w-full">
        <View className="flex-row items-center mb-6 gap-3">
            <Text className={`${!isMetric ? 'text-white' : 'text-neutral-500'} text-lg font-poppins-semibold`}>Imperial</Text>
            <Switch
                trackColor={{ false: '#4A4A4A', true: '#22C55E' }}
                thumbColor={'#171717'}
                onValueChange={toggleUnit}
                value={isMetric}
            />
            <Text className={`${isMetric ? 'text-white' : 'text-neutral-500'} text-lg font-poppins-semibold`}>Metric</Text>
        </View>
        <View className="flex-row justify-evenly items-center mb-6 gap-32">
            <Text className="text-white text-2xl font-bold">Height</Text>
            <Text className="text-white text-2xl font-bold">Weight</Text>
        </View>
      
      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <View className="bg-neutral-900 rounded-2xl overflow-hidden">
            <Picker
              selectedValue={selectedHeight}
              onValueChange={handleHeightChange}
              dropdownIconColor="white"
              className="text-white h-72"
            >
              {heightValues.map((height) => (
                <Picker.Item
                  key={height}
                  label={formatHeight(height)}
                  value={height}
                  color="white"
                />
              ))}
            </Picker>
          </View>
        </View>

        <View className="flex-1 ml-2">
          <View className="bg-neutral-900 rounded-2xl overflow-hidden">
            <Picker
              selectedValue={selectedWeight}
              onValueChange={handleWeightChange}
              dropdownIconColor="white"
              className="text-white h-72"
            >
              {weightValues.map((weight) => (
                <Picker.Item
                  key={weight}
                  label={formatWeight(weight)}
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