import { Exercise } from '@/lib/exercises'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

type CurrentExerciseProps = {
    currentExercise: Exercise
    currentExerciseIndex: number
    currentSetIndex: number
    totalSets: number
    handlePrevSet: () => void
    handleNextSet: () => void
}

const CurrentExercise = ({ currentExercise, currentExerciseIndex, currentSetIndex, totalSets, handlePrevSet, handleNextSet }: CurrentExerciseProps) => {
    
    return (
        <View>
            {/* Exercise Info (much more de-emphasized) */}
            <View className="bg-neutral-800 rounded-3xl p-5 mb-6">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-white text-xl font-poppins-semibold">{currentExercise.name}</Text>
                        <View className="bg-neutral-800 px-3 py-1 rounded-full">
                            <Text className="text-white text-lg font-poppins-medium">
                                Set {currentSetIndex + 1}/{totalSets}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center">
                            <Text className="text-neutral-400 text-base mr-1 font-poppins-medium">Reps:</Text>
                            <Text className="text-white text-lg font-poppins-medium">{currentExercise.reps}</Text>
                        </View>

                        {currentExercise.weight && (
                            <View className="flex-row items-center">
                                <Text className="text-neutral-400 text-base mr-1 font-poppins-medium">Weight:</Text>
                                <Text className="text-white text-lg font-poppins-medium">{currentExercise.weight} kg</Text>
                            </View>
                        )}
                    </View>
            </View>

            {/* Navigation Controls */}
            <View className="flex-row justify-between">
                <TouchableOpacity
                    className="flex-row items-center justify-center bg-neutral-800 rounded-2xl px-5 py-4 flex-1 mr-2"
                    onPress={handlePrevSet}
                    disabled={currentExerciseIndex === 0 && currentSetIndex === 0}
                    style={{ opacity: currentExerciseIndex === 0 && currentSetIndex === 0 ? 0.5 : 1 }}
                >
                    <ChevronLeft size={24} color="white" />
                    <Text className="text-white text-base ml-2 font-poppins-semibold">Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row items-center justify-center bg-white rounded-2xl px-5 py-4 flex-1 ml-2"
                    onPress={handleNextSet}
                >
                    <Text className="text-black text-base mr-2 font-poppins-semibold">Next</Text>
                    <ChevronRight size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default CurrentExercise