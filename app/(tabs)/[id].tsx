"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native"
import { router, useLocalSearchParams, useFocusEffect } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronLeft, Clock, Dumbbell, Flame, PlayCircle } from "lucide-react-native"
import BotSheet from "@/components/bot-sheet"
import type BottomSheet from "@gorhom/bottom-sheet"
import * as Haptics from "expo-haptics"
import ExerciseInfo from "@/components/routine/exercise-info"
import ExerciseCard from "@/components/routine/exercise-card"
import { useAuth } from "@/context/auth"
import type { Workout } from "@/lib/workouts"
import { useWorkouts } from "@/hooks/use-workouts"
import type { Exercise } from "@/lib/exercises"

const WorkoutDetailScreen = () => {
  const { id } = useLocalSearchParams()
  const { session } = useAuth()
  const userId = session?.user?.id
  const { workouts, completeWorkout, isWorkoutCompletedOnDate, deleteExercise, refreshWorkouts } = useWorkouts(userId)

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const windowHeight = Dimensions.get("window").height
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Force refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused, refreshing workouts...")
      refreshWorkouts()
    }, [refreshWorkouts]),
  )

  // Update workout when workouts array changes
  useEffect(() => {
    if (id && workouts.length > 0) {
      const foundWorkout = workouts.find((w) => w.workout_id === id)
      if (foundWorkout) {
        console.log(`Found workout ${foundWorkout.title} with ${foundWorkout.exercises?.length || 0} exercises`)
        setWorkout(foundWorkout)
        setLoading(false)
      } else {
        console.log(`Workout with id ${id} not found`)
        setLoading(false)
      }
    }
  }, [workouts, id])

  const handleOpenBottomSheet = (exercise: Exercise) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    setSelectedExercise(exercise)
    bottomSheetRef.current?.expand()
  }

  const handleCompleteWorkout = async () => {
    if (!workout || !userId) return
    await completeWorkout(workout.workout_id)
  }

  const handleDeleteExercise = async (exerciseId: number) => {
    try {
      console.log(`Deleting exercise ${exerciseId}`)
      const success = await deleteExercise(exerciseId)
      if (success) {
        console.log(`Successfully deleted exercise ${exerciseId}, refreshing...`)
        // Force immediate refresh
        await refreshWorkouts()
      } else {
        Alert.alert("Error", "Failed to delete exercise. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting exercise:", error)
      Alert.alert("Error", "An error occurred while deleting the exercise.")
    }
  }

  const handleStartWorkout = () => {
    if (!workout) return
    router.push({
      pathname: "/(tabs)/workout",
      params: { id: workout.workout_id },
    })
  }

  const handleExerciseUpdate = async (updatedExercise?: Exercise) => {
    if (updatedExercise) {
      setSelectedExercise(updatedExercise)
    }
    // Force refresh to get latest data
    await refreshWorkouts()
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    )
  }

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-row items-center justify-between p-5">
          <TouchableOpacity onPress={() => router.push("/(tabs)/routine")}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-poppins-semibold">Workout</Text>
          <View />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg text-center">Workout not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const getWorkoutImage = () => {
    if (workout.image) return workout.image

    const bodyPart = workout.body_part?.toLowerCase() || ""

    if (bodyPart.includes("chest")) {
      return "https://images.pexels.com/photos/7289250/pexels-photo-7289250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    } else if (bodyPart.includes("back")) {
      return "https://images.pexels.com/photos/31329758/pexels-photo-31329758/free-photo-of-man-performing-exercise-on-lat-pulldown-machine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    } else if (bodyPart.includes("bicep") || bodyPart.includes("arm")) {
      return "https://images.pexels.com/photos/6550845/pexels-photo-6550845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    } else if (bodyPart.includes("tricep")) {
      return "https://images.pexels.com/photos/6243176/pexels-photo-6243176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    } else if (bodyPart.includes("shoulder")) {
      return "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    } else if (bodyPart.includes("leg") || bodyPart.includes("knee")) {
      return "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    } else {
      return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
    }
  }

  const imageSource = getWorkoutImage()
  const isCompleted = userId ? isWorkoutCompletedOnDate(workout.workout_id) : false

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={typeof imageSource === "string" ? { uri: imageSource } : imageSource}
            className="size-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40" />
        </View>

        <View className="absolute top-0 left-0 right-0 m-3">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/routine")}
            className="flex flex-row size-11 items-center justify-center bg-black/60 rounded-full"
          >
            <ChevronLeft className="size-7" color={"#ffffff"} />
          </TouchableOpacity>
        </View>

        <View className="-mt-8 bg-neutral-900 rounded-t-[32px] h-full">
          <View className="bg-neutral-900 rounded-t-[32px] overflow-hidden">
            <View className="px-6 pt-8 pb-6">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 gap-2">
                  <Text className="text-white text-3xl font-poppins-semibold mb-2">{workout.title}</Text>
                  <View className="flex-row items-center flex-wrap gap-4">
                    <View className="flex-row items-center gap-2">
                      <Dumbbell size={16} color="#FF3737" />
                      <Text className="text-neutral-400 font-poppins">
                        {workout.exercises?.length || 0} {workout.exercises?.length === 1 ? "exercise" : "exercises"}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Clock size={16} color="#FF3737" />
                      <Text className="text-neutral-400 font-poppins">{workout.duration} min</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Flame size={16} color="#FF3737" />
                      <Text className="text-neutral-400 font-poppins">
                        {workout.calories ? `${workout.calories} kcal` : "~150 kcal"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="px-5 pb-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-2xl font-poppins-semibold">Exercises</Text>
              </View>

              {workout.exercises && workout.exercises.length > 0 ? (
                workout.exercises.map((exercise, index) => {
                  const uniqueKey = `exercise-${exercise.exercise_id || index}-${exercise.name}-${workout.exercises?.length}`
                  return (
                    <ExerciseCard
                      key={uniqueKey}
                      exercise={exercise}
                      index={index}
                      onPress={() => handleOpenBottomSheet(exercise)}
                      onDelete={handleDeleteExercise}
                    />
                  )
                })
              ) : (
                <View className="bg-neutral-800 rounded-3xl p-6 items-center">
                  <Text className="text-white text-lg font-poppins-medium text-center">
                    No exercises found for this workout.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {!isCompleted && (
        <TouchableOpacity style={styles.floatingButton} className="bg-white" onPress={handleStartWorkout}>
          <View className="flex-row justify-center items-center">
            <Text className="text-black text-center text-xl font-poppins-semibold mr-2">Start workout</Text>
            <PlayCircle size={24} color="black" />
          </View>
        </TouchableOpacity>
      )}

      {isCompleted && (
        <View style={styles.floatingButton} className="bg-white">
          <View className="flex-row justify-center items-center">
            <Text className="text-black text-center text-xl font-poppins-semibold mr-2">Workout completed</Text>
          </View>
        </View>
      )}

      <BotSheet ref={bottomSheetRef} snapPoints={["88%"]}>
        {selectedExercise && <ExerciseInfo exercise={selectedExercise} onExerciseUpdate={handleExerciseUpdate} />}
      </BotSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    width: "90%",
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 88,
    alignSelf: "center",
  },
})

export default WorkoutDetailScreen
