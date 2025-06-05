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
  Image,
} from "react-native"
import { Plus } from "lucide-react-native"
import type BottomSheet from "@gorhom/bottom-sheet"
import BodyPartButton from "@/components/routine/body-part"
import WorkoutCard from "@/components/routine/routine-card"
import { bodyParts } from "@/constants/data"
import BotSheet from "@/components/bot-sheet"
import { useAuth } from "@/context/auth"
import { router } from "expo-router"
import * as Haptics from "expo-haptics"
import AddWorkout from "@/components/routine/add-routine"
import { useWorkouts } from "@/hooks/use-workouts"
import WeeklyOverview from "@/components/routine/weekly-overview"
import ProfileHeader from "@/components/profile-header"

const WorkoutRoutines = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [selectedBodyPart, setSelectedBodyPart] = useState("All")
  const { session } = useAuth()
  const user = session?.user
  const userId = user?.id
  const platform = Platform.OS

  const {
    workouts,
    loading,
    refreshing,
    onRefresh,
    deleteWorkout,
    completeWorkout,
    isWorkoutCompletedOnDate,
    completedWorkouts,
  } = useWorkouts(userId)

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

  return (
    <SafeAreaView className={`flex flex-col flex-1 bg-black ${platform === "ios" ? "" : "pt-5"}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: platform === "ios" ? 60 : 80 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader tab="Routine" />

        {/* Weekly Overview Component */}
        <WeeklyOverview workouts={workouts} completedWorkouts={completedWorkouts} />

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
                isCompleted={isWorkoutCompletedOnDate(workout.workout_id)}
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
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleOpenBottomSheet} className="bg-white">
        <Plus size={24} color="black" />
      </TouchableOpacity>

      <BotSheet ref={bottomSheetRef} snapPoints={["90%"]}>
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