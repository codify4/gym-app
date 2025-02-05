import React from 'react';
import { View, Text } from 'react-native';
import { Workout } from '@/constants/data';
import { Target } from 'lucide-react-native';
import { getWorkoutIcon } from '@/utils/workout-icon';

const WorkoutCard = ({ workout }: { workout: Workout }) => {

  const Icon = getWorkoutIcon(workout.title);

  return (
    <View className="bg-neutral-700 rounded-2xl p-4 mr-4 w-96">
      <View className="flex-row justify-between items-center mb-3">
        <Text className='font-poppins-semibold text-white text-3xl'>{workout.title}</Text>
        <Icon size={24} color="#ffffff" />
      </View>
      {workout.exercises.map((exercise, exerciseIndex) => (
        <View key={exerciseIndex} className="flex-row justify-between items-center w-full bg-neutral-800 rounded-xl py-3 px-4 mb-2">
          <View className="flex-row items-center">
            <Target size={16} color="#ffffff80" />
            <Text className="text-white text-xl font-poppins-medium ml-2">{exercise.name}</Text>
          </View>
          <Text className="text-white text-xl font-poppins-medium">{exercise.sets}</Text>
        </View>
      ))}
    </View>
  );
};

export default WorkoutCard