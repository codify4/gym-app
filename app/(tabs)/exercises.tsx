"use client"

import BotSheet from "@/components/bot-sheet"
import type BottomSheet from "@gorhom/bottom-sheet"
import { router } from "expo-router"
import { ChevronLeft, Search } from "lucide-react-native"
import { useRef, useState, useCallback } from "react"
import { View, Text, SafeAreaView, TextInput, Platform, Alert, FlatList } from "react-native"
import * as Haptics from "expo-haptics"
import Exercise from "@/components/suggestions/exercise"
import type { Exercise as ExerciseType } from "@/lib/exercises"
import ExerciseInfo from "@/components/routine/exercise-info"
import { useWorkouts } from "@/hooks/use-workouts"
import { useAuth } from "@/context/auth"
import type { Workout } from "@/lib/workouts"
import { exercisesList } from "@/constants/exercise-list"
import AddToWorkout from "@/components/suggestions/add-to-workout"

// Import exercises from the constants file but don't expose directly
const allExercises = exercisesList

const Exercises = () => {
  const { session } = useAuth()
  const user = session?.user
  const { workouts, addExercise, refreshWorkouts } = useWorkouts(user?.id)

  const addSheetRef = useRef<BottomSheet>(null)
  const infoSheetRef = useRef<BottomSheet>(null)

  const [selectedExercise, setSelectedExercise] = useState(allExercises[0])
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isAdding, setIsAdding] = useState(false)

  // Filter exercises based on search query
  const filteredExercises =
    searchQuery.trim() === ""
      ? allExercises
      : allExercises.filter(
          (ex) =>
            ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ex.body_part?.toLowerCase().includes(searchQuery.toLowerCase()),
        )

  const handleOpenAddSheet = useCallback((exercise: any) => {
    setSelectedExercise(exercise)
    setSelectedWorkoutIds([])
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    addSheetRef.current?.expand()
  }, [])

  const handleSelectedWorkout = (workout: Workout) => {
    if (selectedWorkoutIds.includes(workout.workout_id)) {
      setSelectedWorkoutIds(selectedWorkoutIds.filter((id) => id !== workout.workout_id))
    } else {
      setSelectedWorkoutIds([...selectedWorkoutIds, workout.workout_id])
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const handleOpenInfoSheet = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    infoSheetRef.current?.expand()
  }, [])

  const handleAddToWorkouts = async () => {
    if (selectedWorkoutIds.length === 0) {
      Alert.alert("No Workouts Selected", "Please select at least one workout to add this exercise to.")
      return
    }

    try {
      setIsAdding(true)

      // Create an exercise data object from selectedExercise - include all required fields
      const exerciseData = {
        exercise_id: 0, // Temporary ID, will be assigned by the database
        name: selectedExercise.name,
        sets: selectedExercise.sets,
        reps: selectedExercise.reps,
        weight: selectedExercise.weight,
        image: selectedExercise.image,
        tips: selectedExercise.tips,
        body_part: selectedExercise.body_part,
      }

      // Add the exercise to each selected workout
      const addPromises = selectedWorkoutIds.map((workoutId) => addExercise(workoutId, exerciseData))

      const results = await Promise.all(addPromises)

      // Check if all additions were successful
      const allSuccessful = results.every((result) => result !== null)

      if (allSuccessful) {
        // Close the sheet and reset selections
        addSheetRef.current?.close()
        setSelectedWorkoutIds([])

        // Show success message
        Alert.alert(
          "Success",
          `${selectedExercise.name} has been added to ${selectedWorkoutIds.length} workout${selectedWorkoutIds.length > 1 ? "s" : ""}.`,
        )

        // Force refresh to ensure all components get updated data
        await refreshWorkouts()
      } else {
        Alert.alert("Error", "Some exercises failed to be added. Please try again.")
      }
    } catch (error) {
      console.error("Error adding exercise to workouts:", error)
      Alert.alert("Error", "There was a problem adding this exercise to your workout(s).")
    } finally {
      setIsAdding(false)
    }
  }

  const renderExerciseItem = useCallback(
    ({ item, index }: { item: Omit<ExerciseType, "exercise_id">; index: number }) => (
      <Exercise
        key={index}
        exercise={item}
        index={index}
        onInfoPress={() => {
          setSelectedExercise(item)
          handleOpenInfoSheet()
        }}
        onAddPress={() => handleOpenAddSheet(item)}
      />
    ),
    [handleOpenAddSheet, handleOpenInfoSheet],
  )

  const keyExtractor = useCallback(
    (item: Omit<ExerciseType, "exercise_id">, index: number) => `exercise-${item.name}-${index}`,
    [],
  )

  return (
    <SafeAreaView className={`flex-1 bg-black ${Platform.OS === "ios" ? "" : "pt-5"}`}>
      <View className="flex-row items-center justify-between p-5">
        <ChevronLeft size={24} color={"white"} onPress={() => router.push("/(tabs)/suggest")} />
        <Text className="text-white text-xl font-poppins-semibold">Exercise Library</Text>
        <View></View>
      </View>
      <View className="flex-row items-center justify-start bg-neutral-900 rounded-3xl p-5 mt-4 gap-3 mx-5 border border-neutral-700">
        <Search size={24} color={"white"} />
        <TextInput
          placeholder="Search for an exercise"
          className="bg-neutral-900 rounded-3xl font-poppins flex-1 text-white"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={keyExtractor}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <Text className="text-white text-center mt-10">No exercises found matching "{searchQuery}"</Text>
        )}
      />

      <BotSheet ref={addSheetRef} snapPoints={Platform.OS === "ios" ? ["63%"] : ["68%"]}>
        <AddToWorkout
          workouts={workouts}
          selectedWorkoutIds={selectedWorkoutIds}
          handleSelectedWorkout={handleSelectedWorkout}
          handleAddToWorkouts={handleAddToWorkouts}
          isAdding={isAdding}
          addSheetRef={addSheetRef}
        />
      </BotSheet>
      <BotSheet ref={infoSheetRef} snapPoints={["80%"]}>
        <ExerciseInfo exercise={selectedExercise} />
      </BotSheet>
    </SafeAreaView>
  )
}

export default Exercises
