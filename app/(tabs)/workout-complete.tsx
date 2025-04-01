"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Clock, Flame, Trophy, Calendar, Dumbbell } from "lucide-react-native"
import { useAuth } from "@/context/auth"
import { useWorkouts } from "@/hooks/use-workouts"
import { calculateCaloriesBurned } from "@/utils/calories"
import type { Workout } from "@/lib/workouts"
import * as Haptics from "expo-haptics"

export default function WorkoutCompleteScreen() {
  const { id, duration: durationParam } = useLocalSearchParams()
  const { session } = useAuth()
  const userId = session?.user?.id
  const { workouts } = useWorkouts(userId)

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

      // Parse duration in seconds
      const durationSeconds = Number.parseInt(durationParam as string) || 0

      // Calculate calories burned based on seconds
      const calories = calculateCaloriesBurned(foundWorkout.body_part, durationSeconds / 60)
      setCaloriesBurned(calories)
    }
  }, [id, workouts, durationParam])

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Loading workout summary...</Text>
      </SafeAreaView>
    )
  }

  // Get duration in seconds from params
  const durationSeconds = Number.parseInt(durationParam as string) || 0

  // Format duration as minutes:seconds
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = durationSeconds % 60
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`

  // Get actual exercise count
  const exerciseCount = workout.exercises?.length || 0

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar barStyle="light-content" />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="items-center pt-10 pb-8">
          <Trophy size={150} color="white" />
          <Text className="text-white text-4xl font-poppins-bold mb-2 mt-4">Workout Complete!</Text>
          <Text className="text-neutral-400 text-lg font-poppins-semibold">{workout.title}</Text>
          <View className="flex-row items-center justify-center mt-2 bg-neutral-800 py-2 px-4 rounded-full self-center">
            <Calendar size={16} color="#888" className="mr-2" />
            <Text className="text-neutral-400 font-poppins-medium ml-2">{today}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-center gap-3 py-5 px-1">
          <View className="items-center bg-neutral-900 p-5 rounded-3xl w-1/2">
            <Clock size={28} color="white" />
            <Text className="text-white text-2xl font-poppins-bold mt-2">{formattedDuration}</Text>
            <Text className="text-neutral-400 text-base font-poppins-medium">Duration</Text>
          </View>
          <View className="items-center bg-neutral-900 p-5 rounded-3xl w-1/2">
            <Flame size={28} color="white" />
            <Text className="text-white text-2xl font-poppins-bold mt-2">{caloriesBurned}</Text>
            <Text className="text-neutral-400 text-base font-poppins-medium">Calories</Text>
          </View>
        </View>
        <View className="items-center bg-neutral-900 p-5 rounded-3xl w-full">
          <Dumbbell size={28} color="white" />
          <Text className="text-white text-2xl font-poppins-bold mt-2">{exerciseCount}</Text>
          <Text className="text-neutral-400 text-base font-poppins-medium">{exerciseCount === 1 ? "Exercise" : "Exercises"}</Text>
        </View>
      </ScrollView>

      <View className="px-5 py-4 bg-black" style={{ paddingBottom: 30 }}>
        <TouchableOpacity className="bg-white rounded-full py-5 items-center" onPress={() => router.replace("/(tabs)/routine")}>
          <Text className="text-black text-lg font-poppins-semibold">Back to Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-transparent border border-white rounded-full py-5 items-center mt-4" onPress={() => router.replace("/(tabs)/stats")}>
          <Text className="text-white text-lg font-poppins-semibold">Check out your Stats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
