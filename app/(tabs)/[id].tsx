"use client"

import { useEffect, useRef, useState } from "react"
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
import { router, useLocalSearchParams } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronLeft, Clock, Dumbbell, Flame, PlayCircle } from "lucide-react-native"
import BotSheet from "@/components/bot-sheet"
import type BottomSheet from "@gorhom/bottom-sheet"
import * as Haptics from "expo-haptics"
import ExerciseInfo from "@/components/routine/exercise-info"
import ExerciseCard from "@/components/routine/exercise-card"
import { useAuth } from "@/context/auth"
import { supabase } from "@/lib/supabase"
import type { Workout } from "@/lib/workouts"
import { useWorkouts } from "@/hooks/use-workouts"
import { Exercise } from "@/lib/exercises"

const WorkoutDetailScreen = () => {
  const { id } = useLocalSearchParams()
  const { session } = useAuth()
  const userId = session?.user?.id
  const { workouts, completeWorkout, isWorkoutCompletedOnDate, deleteExercise } = useWorkouts(userId)

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const windowHeight = Dimensions.get("window").height
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Fetch workout data
  useEffect(() => {
    const fetchWorkoutData = async () => {
      if (!id) return

      try {
        setLoading(true)

        // Find the workout in our already loaded workouts
        const foundWorkout = workouts.find((w) => w.workout_id === id)

        if (foundWorkout) {
          setWorkout(foundWorkout)
          setLoading(false)
          return
        }

        // If not found in state, fetch from database
        const { data: workoutData, error: workoutError } = await supabase
          .from("workout")
          .select("*")
          .eq("workout_id", id)
          .single()

        if (workoutError) {
          console.error("Error fetching workout:", workoutError)
          return
        }

        if (!workoutData) {
          return
        }

        // Then get the exercises for this workout
        const { data: exercisesData, error: exercisesError } = await supabase
          .from("exercise")
          .select("*")
          .eq("workout_id", workoutData.workout_id)

        if (exercisesError) {
          console.error("Error fetching exercises:", exercisesError)
        } else {
          // Set the workout with exercises
          setWorkout({
            ...workoutData,
            exercises: exercisesData || [],
          })
        }
      } catch (error) {
        console.error("Error fetching workout data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkoutData()
  }, [id, workouts])

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
    // Optionally navigate back or show a success message
  }

  const handleDeleteExercise = async (exerciseId: number) => {
    try {
      const success = await deleteExercise(exerciseId)
      if (success) {
        setWorkout((prev) => {
          if (!prev) return null
          const updatedWorkout = {
            ...prev,
            exercises: prev.exercises?.filter((ex) => ex.exercise_id !== exerciseId) || [],
          }
          console.log("Updated workout state:", updatedWorkout)
          return updatedWorkout
        })
      } else {
        console.error("Failed to delete exercise with ID:", exerciseId)
        Alert.alert("Error", "Failed to delete exercise. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting exercise:", error)
      Alert.alert("Error", "An error occurred while deleting the exercise.")
    }
  }

  const handleStartWorkout = () => {
    if (!workout) return

    // Navigate to the active workout screen with the workout ID
    router.push({
      pathname: "/(tabs)/workout",
      params: { id: workout.workout_id },
    })
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
        <Text className="text-white text-lg text-center mt-5">Workout not found</Text>
      </SafeAreaView>
    )
  }

  // Default image if none is provided
  const getWorkoutImage = () => {
    if (workout.image) return workout.image
    
    const bodyPart = workout.body_part?.toLowerCase() || '';
    
    if (bodyPart.includes('chest')) {
      return 'https://images.pexels.com/photos/7289250/pexels-photo-7289250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    } else if (bodyPart.includes('back')) {
      return 'https://images.pexels.com/photos/31329758/pexels-photo-31329758/free-photo-of-man-performing-exercise-on-lat-pulldown-machine.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    } else if (bodyPart.includes('bicep') || bodyPart.includes('arm')) {
      return 'https://images.pexels.com/photos/6550845/pexels-photo-6550845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    } else if (bodyPart.includes('tricep')) {
      return 'https://images.pexels.com/photos/6243176/pexels-photo-6243176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    } else if (bodyPart.includes('shoulder')) {
      return 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    } else if (bodyPart.includes('leg') || bodyPart.includes('knee')) {
      return 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    } else {
      return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop';
    }
  }
  
  const imageSource = getWorkoutImage();
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
            source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource} 
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

        {/* Content Container with rounded corners */}
        <View className="-mt-8 bg-neutral-900 rounded-t-[32px] h-full">
          <View className="bg-neutral-900 rounded-t-[32px] overflow-hidden">
            {/* Workout Info Card */}
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

            {/* Exercises List */}
            <View className="px-5 pb-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-2xl font-poppins-semibold">Exercises</Text>
              </View>

              {workout.exercises && workout.exercises.length > 0 ? (
                workout.exercises.map((exercise, index) => {
                  // Generate a unique key for the exercise
                  const uniqueKey = `exercise-${index}-${exercise.exercise_id || exercise.name || Date.now()}`

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

      <BotSheet ref={bottomSheetRef} snapPoints={["88%"]}>{selectedExercise && <ExerciseInfo exercise={selectedExercise} />}</BotSheet>
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