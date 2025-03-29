"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Dumbbell, Clock, Flame, Trophy, Calendar, Check } from "lucide-react-native"
import { useAuth } from "@/context/auth"
import { useWorkouts } from "@/hooks/use-workouts"
import { calculateCaloriesBurned } from "@/utils/calories"
import type { Workout } from "@/lib/workouts"
import * as Haptics from "expo-haptics"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function WorkoutCompleteScreen() {
  const { id, duration } = useLocalSearchParams()
  const { session } = useAuth()
  const userId = session?.user?.id
  const { workouts } = useWorkouts(userId)
  const insets = useSafeAreaInsets()

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [caloriesBurned, setCaloriesBurned] = useState(0)

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }

    if (!id || !workouts.length) return

    const foundWorkout = workouts.find((w) => String(w.workout_id) === String(id))
    if (foundWorkout) {
      setWorkout(foundWorkout)

      // Calculate calories burned
      const durationMinutes = Number.parseInt(duration as string) || foundWorkout.duration
      const calories = calculateCaloriesBurned(foundWorkout.body_part, durationMinutes)
      setCaloriesBurned(calories)
    }
  }, [id, workouts, duration])

  const handleGoHome = () => {
    router.replace("/(tabs)/routine")
  }

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Loading workout summary...</Text>
      </SafeAreaView>
    )
  }

  const actualDuration = Number.parseInt(duration as string) || workout.duration
  const exerciseCount = workout.exercises?.length || 0
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })

  // Calculate bottom padding to ensure button is visible above tab bar
  const bottomPadding = insets.bottom + 70 // Add extra padding to account for tab bar

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar barStyle="light-content" />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="items-center pt-10 pb-8 bg-neutral-900">
          <View className="bg-white rounded-full p-5 mb-5">
            <Trophy size={40} color="black" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">Workout Complete!</Text>
          <Text className="text-neutral-400 text-lg">{workout.title}</Text>
        </View>

        <View className="px-5 py-6">
          <View className="bg-neutral-900 rounded-3xl p-6 mb-8">
            <View className="flex-row justify-between mb-6">
              <View className="items-center">
                <Clock size={28} color="white" className="mb-3" />
                <Text className="text-white text-2xl font-bold">{actualDuration} min</Text>
                <Text className="text-neutral-400 text-sm">Duration</Text>
              </View>

              <View className="items-center">
                <Dumbbell size={28} color="white" className="mb-3" />
                <Text className="text-white text-2xl font-bold">{exerciseCount}</Text>
                <Text className="text-neutral-400 text-sm">Exercises</Text>
              </View>

              <View className="items-center">
                <Flame size={28} color="white" className="mb-3" />
                <Text className="text-white text-2xl font-bold">{caloriesBurned}</Text>
                <Text className="text-neutral-400 text-sm">Calories</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center mt-2 bg-neutral-800 py-2 px-4 rounded-full self-center">
              <Calendar size={16} color="#888" className="mr-2" />
              <Text className="text-neutral-400">{today}</Text>
            </View>
          </View>

          <Text className="text-white text-xl font-bold mb-4">Exercises Completed</Text>

          {workout.exercises &&
            workout.exercises.map((exercise, index) => (
              <View key={exercise.exercise_id || index} className="bg-neutral-900 rounded-2xl p-4 mb-3">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white text-lg font-bold mb-1">{exercise.name}</Text>
                    <View className="flex-row">
                      <Text className="text-neutral-400 mr-3">{exercise.sets} sets</Text>
                      <Text className="text-neutral-400 mr-3">{exercise.reps} reps</Text>
                      {exercise.weight && <Text className="text-neutral-400">{exercise.weight} kg</Text>}
                    </View>
                  </View>
                  <View className="bg-white rounded-full p-1">
                    <Check size={16} color="black" />
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      <View className="px-5 py-4 border-t border-neutral-800 bg-black" style={{ paddingBottom: bottomPadding }}>
        <TouchableOpacity className="bg-white rounded-full py-4 items-center" onPress={handleGoHome}>
          <Text className="text-black text-lg font-bold">Back to Workouts</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

