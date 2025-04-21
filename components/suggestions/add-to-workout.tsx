import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Workout } from '@/lib/workouts'
import BottomSheet from '@gorhom/bottom-sheet'
import { Check, Plus } from 'lucide-react-native'

type AddToWorkoutProps = {
    workouts: Workout[]
    selectedWorkoutIds: string[]
    handleSelectedWorkout: (workout: Workout) => void
    handleAddToWorkouts: () => void
    isAdding: boolean
    addSheetRef: React.RefObject<BottomSheet>
}

const AddToWorkout = ({ workouts, selectedWorkoutIds, handleSelectedWorkout, handleAddToWorkouts, isAdding, addSheetRef }: AddToWorkoutProps) => {
    const renderWorkoutItem = ({ item: workout }: { item: Workout }) => {
        const isSelected = selectedWorkoutIds.includes(workout.workout_id)
        
        return (
            <TouchableOpacity 
                className={`flex-row items-center justify-between bg-neutral-800 p-5 rounded-3xl mb-3 w-full ${
                    isSelected ? 'bg-neutral-700 border border-white' : ''
                }`}
                onPress={() => handleSelectedWorkout(workout)}
                activeOpacity={0.7}
            >
                <View className="flex-1">
                    <Text className="text-white font-poppins-semibold text-base mb-1">{workout.title}</Text>
                    <Text className="text-neutral-400 text-xs font-poppins">
                        {workout.exercises?.length || 0} exercises • {workout.body_part.split(',').map(part => part.trim()).join(', ') || 'All'}
                    </Text>
                </View>
                
                <View className={`w-8 h-8 rounded-full items-center justify-center ml-2 ${
                    isSelected ? 'bg-white' : 'bg-neutral-600'
                }`}>
                    {isSelected && <Check size={20} color="black" />}
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View className="flex-1 w-full">
            <View className="mb-5">
                <Text className="text-white font-poppins-semibold text-2xl mb-1">Add to Workout</Text>
                <Text className="text-neutral-400 text-base font-poppins-medium">
                    Select workouts to add this exercise
                </Text>
            </View>
            
            {workouts.length > 0 ? (
                <>
                    <FlatList
                        data={workouts}
                        renderItem={renderWorkoutItem}
                        keyExtractor={(item) => item.workout_id}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        showsVerticalScrollIndicator={false}
                    />

                    <View className="py-2 mb-2">
                        <Text className="text-neutral-400 text-sm text-center font-poppins-medium">
                            {selectedWorkoutIds.length} workout{selectedWorkoutIds.length !== 1 ? 's' : ''} selected
                        </Text>
                    </View>
                    
                    <TouchableOpacity 
                        className={`py-5 rounded-full items-center justify-center flex-row ${
                            isAdding || selectedWorkoutIds.length === 0 
                                ? 'bg-neutral-700' 
                                : 'bg-white'
                        }`}
                        onPress={handleAddToWorkouts}
                        disabled={isAdding || selectedWorkoutIds.length === 0}
                    >
                        <Plus size={20} color={isAdding || selectedWorkoutIds.length === 0 ? '#808080' : 'black'} />
                        <Text className={`text-lg font-poppins-semibold ${
                            isAdding || selectedWorkoutIds.length === 0 
                                ? 'text-neutral-500' 
                                : 'text-black'
                        }`}>
                            {isAdding ? 'Adding...' : 'Add Exercise'}
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View className="flex-1 items-center justify-center px-5">
                    <Text className="text-white font-bold text-lg mb-2">No workouts available</Text>
                    <Text className="text-neutral-400 text-sm mb-6 text-center">
                        Create a workout to add exercises
                    </Text>
                    
                    <TouchableOpacity 
                        className="bg-red-500 flex-row items-center justify-center py-3 px-5 rounded-xl"
                        onPress={() => {
                            addSheetRef.current?.close()
                            router.push('/(tabs)/routine')
                        }}
                    >
                        <Plus size={18} color="#fff" className="mr-2" />
                        <Text className="text-white font-semibold text-base">Create Workout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View> 
    )
}

export default AddToWorkout