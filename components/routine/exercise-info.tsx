import React from "react"
import { View, Text, ScrollView, Image } from "react-native"
import { Info } from "lucide-react-native"
import type { Exercise } from "@/lib/workouts"
import { getImageSource } from "@/utils/exercise-muscle"
import { getExerciseTips } from "@/utils/exercise-tips"

const ExerciseInfo = ({ exercise }: { exercise: Exercise }) => {
  const tipsList =
    exercise.tips && Array.isArray(exercise.tips) ? exercise.tips : getExerciseTips(exercise.name, exercise.body_part)

  return (
    <>
      {exercise && (
        <ScrollView className="flex-1 bg-neutral-900 rounded-3xl">
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-3xl font-poppins-semibold">{exercise.name}</Text>
            </View>

            <View className="mb-6">
              {exercise.image ? (
                <Image
                  source={getImageSource(exercise)}
                  style={{ width: "100%", height: 200, borderRadius: 16 }}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={{ width: "100%", height: 200, borderRadius: 16 }}
                  className="bg-neutral-800 items-center justify-center"
                >
                  <Text className="text-white text-lg">No image available</Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-between mb-6">
              <View className="bg-neutral-800 rounded-2xl p-4 flex-1 mr-2">
                <Text className="text-neutral-400 text-sm font-poppins-medium mb-1">Sets</Text>
                <Text className="text-white text-2xl font-poppins-bold">{exercise.sets}</Text>
              </View>
              <View className="bg-neutral-800 rounded-2xl p-4 flex-1 ml-2">
                <Text className="text-neutral-400 text-sm font-poppins-medium mb-1">Reps</Text>
                <Text className="text-white text-2xl font-poppins-bold">{exercise.reps}</Text>
              </View>
            </View>

            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Info size={24} color="#FF3737" />
                <Text className="text-white text-xl font-poppins-semibold ml-2">How to perform</Text>
              </View>
              <View className="bg-neutral-800 rounded-2xl p-4">
                {tipsList.map((tip, index) => (
                  <Text key={index} className="text-white text-lg font-poppins-medium leading-6 mb-2">
                    {index + 1}. {tip}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  )
}

export default ExerciseInfo

