import React from 'react';
import { View, Text, Platform, Pressable } from 'react-native';
import { Workout } from '@/constants/data';
import { Target, ChevronRight } from 'lucide-react-native';
import { getWorkoutIcon } from '@/utils/workout-icon';
import { LinearGradient } from 'expo-linear-gradient';

const WorkoutCard = ({ workout }: { workout: Workout }) => {
  const Icon = getWorkoutIcon(workout.title);
  const platform = Platform.OS;

  return (
    <Pressable className={`overflow-hidden shadow-lg mr-3 ${platform === 'ios' ? 'w-96' : 'w-[305px]'}`}>
      <LinearGradient
        colors={['#262626', '#1F1F1F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 18, padding: 5 }}
      >
        <View className="p-4 rounded-3xl">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="font-poppins-semibold text-white text-3xl mb-1">{workout.title}</Text>
              <Text className="text-neutral-400 font-poppins-medium">{workout.exercises.length} exercises</Text>
            </View>
            <View className="bg-neutral-800/50 p-3 rounded-2xl">
              <Icon size={24} color="#ffffff" />
            </View>
          </View>
          
          <View className="space-y-3">
            {workout.exercises.slice(0, 3).map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} className="flex-row justify-between items-center w-full py-4 px-4 bg-black/30 rounded-2xl mb-2">
                <View className="flex-row items-center flex-1">
                  <Target size={16} color="#ffffffff" />
                  <Text className="text-white text-base font-poppins-medium ml-3 flex-1" numberOfLines={1}>
                    {exercise.name}
                  </Text>
                </View>
                <Text className="text-neutral-400 text-base font-poppins-medium ml-2">{exercise.sets}</Text>
              </View>
            ))}
          </View>
          
          {workout.exercises.length > 3 && (
            <View className="mt-3 flex-row items-center justify-center">
              <Text className="text-neutral-400 font-poppins-medium mr-1">
                +{workout.exercises.length - 3} more
              </Text>
              <ChevronRight size={16} color="#9ca3af" />
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default WorkoutCard