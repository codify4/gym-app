import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Workout } from '@/constants/data';
import { Target } from 'lucide-react-native';
import { getWorkoutIcon } from '@/utils/workout-icon';

const WorkoutCard = ({ workout }: { workout: Workout }) => {

  const Icon = getWorkoutIcon(workout.title);
  const platform = Platform.OS;

  return (
    <View className={`bg-neutral-800 rounded-2xl overflow-hidden shadow-lg mr-3 py-3 px-5 ${platform === 'ios' ? 'w-96' : 'w-[305px]'}`}>
      <View className="flex-row justify-between items-center mb-3 px-4 py-2 bg-gradient-to-r from-neutral-700 to-neutral-900 rounded-t-2xl">
        <Text className='font-poppins-semibold text-white text-3xl'>{workout.title}</Text>
        <Icon size={24} color="#ffffff" />
      </View>
      <View className="divide-y divide-neutral-700 rounded-b-2xl">
        {workout.exercises.map((exercise, exerciseIndex) => (
          <View key={exerciseIndex} className="flex-row justify-between items-center w-full py-4 px-4 bg-neutral-700 mb-2 rounded-2xl">
            <View className="flex-row items-center">
              <Target size={16} color="#ffffff80" />
              <Text className="text-white text-xl font-poppins-medium ml-2">{exercise.name}</Text>
            </View>
            <Text className="text-white text-xl font-poppins-medium">{exercise.sets}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WorkoutCard