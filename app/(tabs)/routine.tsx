"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { TrendingUp, Plus, CheckCircle2, Clock } from "lucide-react-native"
import type BottomSheet from "@gorhom/bottom-sheet"
import { Avatar } from "react-native-paper"
import BodyPartButton from "@/components/routine/body-part"
import WorkoutCard from "@/components/routine/routine-card"
import { bodyParts } from "@/constants/data"
import BotSheet from "@/components/bot-sheet"
import { useAuth } from "@/context/auth"
import { router } from "expo-router"
import * as Haptics from "expo-haptics"
import AddWorkout from "@/components/routine/add-routine"
import { useWorkouts } from "@/hooks/use-workouts"

const WorkoutRoutines = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [selectedBodyPart, setSelectedBodyPart] = useState("All")
  const { session } = useAuth()
  const user = session?.user
  const userId = user?.id
  const platform = Platform.OS

  // Use the workouts hook
  const { workouts, loading, refreshing, onRefresh, deleteWorkout, completeWorkout, isWorkoutCompletedOnDate } = useWorkouts(userId)

  // Filter workouts by body part
  const filteredWorkouts =
    selectedBodyPart === "All" ? workouts : workouts.filter((workout) => workout.body_part === selectedBodyPart)

  const handleOpenBottomSheet = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    bottomSheetRef.current?.expand()
  }

  const handleWorkoutAdded = () => {
    bottomSheetRef.current?.close()
    onRefresh() // Refresh the workouts list
  }

  // Helper function to get workout name for each day
  const getWorkoutForDay = (day: string) => {
    const workoutSchedule: { [key: string]: string } = {
      Mon: "Upper Body",
      Tue: "Lower Body",
      Wed: "Core",
      Thu: "Cardio",
      Fri: "Full Body",
      Sat: "Rest",
      Sun: "Rest",
    }
    return workoutSchedule[day]
  }

  const weekDays = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const currentDate = new Date()
    const currentDay = currentDate.getDay() // 0-6, starting from Sunday
    const mondayOffset = currentDay === 0 ? 6 : currentDay - 1 // Calculate days since Monday

    return days.map((day, index) => {
      // Calculate if this day is before or after today in the current week
      const dayOffset = index - mondayOffset
      const isToday = dayOffset === 0
      const isPastDay = dayOffset < 0

      return {
        day,
        completed: isPastDay, // Only past days are completed
        workoutName: getWorkoutForDay(day),
        isToday,
      }
    })
  })()

  return (
    <SafeAreaView className={`flex flex-col flex-1 bg-black ${platform === "ios" ? "" : "pt-5"}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: platform === "ios" ? 60 : 80 }}
        showsVerticalScrollIndicator={false}
        // refreshing={refreshing}
        // onRefresh={onRefresh}
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/profile")}>
            <Avatar.Image
              size={45}
              source={{ uri: user?.user_metadata?.avatar_url }}
              className="bg-neutral-800 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-white text-xl font-poppins-semibold">Workout Mate</Text>
              <Text className="text-neutral-400 text-base font-poppins-semibold">Your Workouts</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Weekly Overview */}
        <View className="bg-neutral-900 rounded-3xl p-6 mb-6">
          <Text className="text-white text-xl font-poppins-semibold mb-4">Weekly Overview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weekDays.map((item, index) => (
              <TouchableOpacity
                key={item.day} 
                className={`mr-4 items-center ${item.isToday ? "opacity-100" : "opacity-70"}`}
                style={{ width: 65 }}
              >
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mb-2
                    ${item.isToday ? "bg-red-500" : "bg-neutral-800"}`}
                >
                  {item.completed ? (
                    <CheckCircle2 size={20} color={item.isToday ? "#fff" : "#22c55e"} />
                  ) : (
                    <Clock size={20} color={item.isToday ? "#fff" : "#fff"} />
                  )}
                </View>
                <Text className="text-white text-sm font-poppins-medium">{item.day}</Text>
                <Text className="text-neutral-400 text-xs font-poppins-medium text-center">{item.workoutName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Body Parts Filter */}
        <View className="bg-neutral-900 rounded-3xl px-6 py-5 mb-6">
          <Text className="text-white text-xl font-poppins-semibold mb-4">Target Muscle Groups</Text>
          <View className="flex-row flex-wrap justify-between gap-3">
            {bodyParts.map((part) => (
              <BodyPartButton
                key={part.name}
                part={part}
                selectedBodyPart={selectedBodyPart}
                setSelectedBodyPart={setSelectedBodyPart}
              />
            ))}
          </View>
        </View>

        {/* Workouts Section */}
        <View className="mb-5">
          <Text className="text-white text-2xl font-poppins-semibold mb-4">
            {selectedBodyPart === "All" ? "All Workouts" : `${selectedBodyPart} Workouts`}
          </Text>

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <WorkoutCard 
                key={workout.workout_id}
                workout={workout} 
                onDelete={(id) => deleteWorkout(id)} 
              />
            ))
          ) : (
            <View className="bg-neutral-900 rounded-3xl p-6 items-center">
              <Text className="text-white text-lg font-poppins-medium text-center">
                No workouts found. Add your first workout!
              </Text>
            </View>
          )}
        </View>

        {/* Workout Streak Card */}
        <View className="bg-neutral-900 rounded-3xl py-5 px-6">
          <Text className="text-white text-xl font-poppins-semibold mb-3">Workout Streak</Text>
          <View className="flex-row items-center">
            <View className="bg-red-500/20 p-2 rounded-xl mr-3">
              <TrendingUp size={24} color="#FF3737" />
            </View>
            <View>
              <Text className="text-white text-2xl font-poppins-bold">5 days</Text>
              <Text className="text-neutral-400 text-sm font-poppins-medium">Keep pushing your limits! 💪</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleOpenBottomSheet} className="bg-white">
        <Plus size={24} color="black" />
      </TouchableOpacity>

      <BotSheet ref={bottomSheetRef}>
        <AddWorkout onSuccess={handleWorkoutAdded} />
      </BotSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    right: 20,
  },
})

export default WorkoutRoutines
