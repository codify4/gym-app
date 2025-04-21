import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import WorkoutCard from '../routine/routine-card';
import { Workout } from '@/lib/workouts';
import BottomSheet from '@gorhom/bottom-sheet';
type AddToWorkoutProps = {
    workouts: Workout[];
    selectedWorkoutIds: string[];
    handleSelectedWorkout: (workout: Workout) => void;
    handleAddToWorkouts: () => void;
    isAdding: boolean;
    addSheetRef: React.RefObject<BottomSheet>;
}

const AddToWorkout = ({ workouts, selectedWorkoutIds, handleSelectedWorkout, handleAddToWorkouts, isAdding, addSheetRef }: AddToWorkoutProps) => {
    return (
        <View className='flex-col items-center justify-between w-full h-full pb-5'>
                    <View className='flex-col items-center justify-center w-full'>
                        <View className='flex-col items-center justify-center'>
                            <Text className='font-poppins-semibold text-white text-xl'>Add Exercise</Text>
                            <Text className='font-poppins text-white'>Select one or more workouts to add this exercise to.</Text>
                        </View>
                        
                        {workouts.length > 0 ? (
                            <ScrollView className='w-full mt-5' showsVerticalScrollIndicator={false}>
                                {workouts.map((workout, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        className={`rounded-3xl mb-3 ${selectedWorkoutIds.includes(workout.workout_id) ? 'border border-red-500' : 'border border-neutral-700'}`}
                                        style={{ borderColor: selectedWorkoutIds.includes(workout.workout_id) ? '#ef4444' : '#f4f4f4'}}
                                        onPress={() => handleSelectedWorkout(workout)}
                                    >
                                        <WorkoutCard workout={workout} pressable={false} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        ) : (
                            <View className='w-full mt-10 items-center justify-center'>
                                <Text className='text-white text-center font-poppins'>No workouts available. Create a workout first.</Text>
                                <TouchableOpacity 
                                    className='bg-neutral-800 py-3 px-6 rounded-full mt-3'
                                    onPress={() => {
                                        addSheetRef.current?.close();
                                        router.push('/(tabs)/routine');
                                    }}
                                >
                                    <Text className='text-white font-poppins'>Create Workout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity 
                        className={`py-5 rounded-full mt-5 w-full ${isAdding || selectedWorkoutIds.length === 0 ? 'bg-gray-600' : 'bg-white'}`}
                        onPress={handleAddToWorkouts}
                        disabled={isAdding || selectedWorkoutIds.length === 0}
                    >
                        <Text className={`text-lg font-poppins-semibold text-center ${isAdding || selectedWorkoutIds.length === 0 ? 'text-gray-400' : 'text-black'}`}>
                            {isAdding ? 'Adding...' : 'Add to workout'}
                        </Text>
                    </TouchableOpacity>
                </View> 
    )
}

export default AddToWorkout