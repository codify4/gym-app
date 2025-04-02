"use client"
import { useState, useEffect, useCallback } from "react"
import { View, Text, TouchableOpacity, Alert, Platform, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { Play, Pause, X } from "lucide-react-native"
import { useAuth } from "@/context/auth"
import { useWorkouts } from "@/hooks/use-workouts"
import { supabase } from "@/lib/supabase"
import type { Workout } from "@/lib/workouts"
import * as Haptics from "expo-haptics"
import CurrentExercise from "@/components/routine/active-workout/current-exercise"
import Resting from "@/components/routine/active-workout/resting"
import { calculateCaloriesBurned } from "@/utils/calories"

interface ExerciseProgress {
  exerciseId: number
  sets: Array<{
    reps: number
    weight: number | null
    completed: boolean
  }>
}

export default function ActiveWorkoutScreen() {
  const params = useLocalSearchParams()
  const { session } = useAuth()
  const userId = session?.user?.id
  const { workouts, completeWorkout } = useWorkouts(userId)

  // Extract the ID and handle potential type issues
  const workoutId = params.id ? String(params.id) : null

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([])

  // Find the workout from the workouts list or fetch directly
  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) {
        console.log("No workout ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // First try to find the workout in our already loaded workouts
        const foundWorkout = workouts.find((w) => {
          return String(w.workout_id) === String(workoutId)
        })

        if (foundWorkout) {
          setWorkout(foundWorkout)
          // Initialize exercise progress data
          if (foundWorkout.exercises && foundWorkout.exercises.length > 0) {
            const progressData = foundWorkout.exercises.map((ex) => ({
              exerciseId: ex.exercise_id,
              sets: Array(ex.sets)
                .fill(0)
                .map(() => ({
                  reps: ex.reps,
                  weight: ex.weight,
                  completed: false,
                })),
            }))
            setExerciseProgress(progressData)
          }
          setLoading(false)
          return
        }

        // If not found in state, fetch directly from the database
        if (userId) {
          // Fetch the workout
          const { data: workoutData, error: workoutError } = await supabase
            .from("workout")
            .select("*")
            .eq("workout_id", workoutId)
            .single()

          if (workoutError) {
            console.error("Error fetching workout:", workoutError)
            setLoading(false)
            return
          }

          if (!workoutData) {
            console.log("No workout found with ID:", workoutId)
            setLoading(false)
            return
          }

          // Fetch the exercises for this workout
          const { data: exercisesData, error: exercisesError } = await supabase
            .from("exercise")
            .select("*")
            .eq("workout_id", workoutId)

          if (exercisesError) {
            console.error("Error fetching exercises:", exercisesError)
          }

          // Create the complete workout object
          const completeWorkout = {
            ...workoutData,
            exercises: exercisesData || [],
          }

          setWorkout(completeWorkout)

          // Initialize exercise progress data
          if (exercisesData && exercisesData.length > 0) {
            const progressData = exercisesData.map((ex) => ({
              exerciseId: ex.exercise_id,
              sets: Array(ex.sets)
                .fill(0)
                .map(() => ({
                  reps: ex.reps,
                  weight: ex.weight,
                  completed: false,
                })),
            }))
            setExerciseProgress(progressData)
          }
        }
      } catch (error) {
        console.error("Error in fetchWorkout:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkout()
  }, [workoutId, workouts, userId])

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning) {
        setTimer((prev) => prev + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Handle haptic feedback for better UX
  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
  }, [])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg font-poppins">Loading workout...</Text>
      </SafeAreaView>
    )
  }

  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <View className="items-center px-5">
          <Text className="text-white text-xl mb-4 font-poppins">Workout Not Found</Text>
          <Text className="text-neutral-400 text-center mb-8 font-poppins">
            We couldn't find this workout (ID: {workoutId}). It may have been deleted or there was an error loading it.
          </Text>
          <TouchableOpacity
            className="bg-white rounded-full py-5 px-8 items-center"
            onPress={() => router.replace("/(tabs)/routine")}
          >
            <Text className="text-black text-lg font-poppins">Back to Workouts</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Make sure exercises array exists and has the current index
  const exercises = workout.exercises || []
  const currentExercise = exercises[currentExerciseIndex] || { name: "Unknown", sets: 1, reps: 0 }
  const totalSets = currentExercise.sets
  const totalExercises = exercises.length

  // Get next exercise if available
  const nextExercise =
    currentExerciseIndex < totalExercises - 1
      ? exercises[currentExerciseIndex + 1]
      : currentSetIndex < totalSets - 1
        ? currentExercise
        : null

  const handleNextSet = () => {
    triggerHaptic()

    // Mark current set as completed
    setExerciseProgress((prev) => {
      const newProgress = [...prev]
      if (newProgress[currentExerciseIndex]?.sets[currentSetIndex]) {
        newProgress[currentExerciseIndex].sets[currentSetIndex].completed = true
      }
      return newProgress
    })

    if (currentSetIndex < totalSets - 1) {
      // Move to next set of the same exercise
      setCurrentSetIndex(currentSetIndex + 1)
      setIsResting(true)
    } else {
      // Move to next exercise
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setCurrentSetIndex(0)
        setIsResting(true)
      } else {
        // Workout complete
        handleCompleteWorkout()
      }
    }
  }

  const handlePrevSet = () => {
    triggerHaptic()

    if (currentSetIndex > 0) {
      // Move to previous set of the same exercise
      setCurrentSetIndex(currentSetIndex - 1)
    } else {
      // Move to previous exercise
      if (currentExerciseIndex > 0) {
        setCurrentExerciseIndex(currentExerciseIndex - 1)
        const prevExercise = workout.exercises?.[currentExerciseIndex - 1]
        if (prevExercise) {
          setCurrentSetIndex(prevExercise.sets - 1)
        }
      }
    }
    setIsResting(false)
  }

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
    triggerHaptic()
  }

  const handleCancelWorkout = () => {
    Alert.alert("Cancel Workout", "Are you sure you want to cancel this workout?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          router.replace("/(tabs)/routine")
        },
      },
    ])
  }

  const handleCompleteWorkout = async () => {
    // Calculate workout duration in seconds
    const durationSeconds = timer

    // Calculate calories burned based on workout body part and duration
    const caloriesBurned = workout ? calculateCaloriesBurned(workout.body_part, durationSeconds / 60) : 0

    // Complete the workout
    if (userId && workout) {
      try {
        // Pass duration and calories to the completeWorkout function
        await completeWorkout(workout.workout_id, durationSeconds, caloriesBurned)

        // Navigate to workout complete screen or back to routine
        router.replace({
          pathname: "/(tabs)/workout-complete",
          params: {
            id: workout.workout_id,
            duration: durationSeconds.toString(),
          },
        })
      } catch (error) {
        console.error("Error completing workout:", error)
        Alert.alert("Error", "Failed to complete workout. Please try again.")
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndRest = () => {
    setIsResting(false)
    triggerHaptic()
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar barStyle="light-content" />

      {/* Header with Timer as the main focus - MUCH more prominent */}
      <View className="px-5 pt-6 pb-2">
        <View className="flex-row justify-between items-center mb-2">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center"
            onPress={handleCancelWorkout}
          >
            <X size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="text-white text-lg font-poppins-semibold">
              {currentExerciseIndex + 1}/{totalExercises}
            </Text>
          </View>
        </View>
      </View>

      {/* Super Prominent Timer */}
      <View className="items-center justify-center px-5">
        <Text className="text-white text-8xl mt-5 font-bold">{formatTime(timer)}</Text>
        <TouchableOpacity
          className="rounded-full bg-white items-center justify-center mt-4 px-5 py-2"
          onPress={handleToggleTimer}
        >
          {isTimerRunning ? <Pause size={28} color="black" /> : <Play size={28} color="black" />}
        </TouchableOpacity>
      </View>

      {/* Main Content - Exercise info much less prominent */}
      <View className="flex-1 px-5 justify-center">
        {isResting ? (
          <Resting
            nextExercise={nextExercise}
            currentSetIndex={currentSetIndex}
            totalSets={totalSets}
            handleEndRest={handleEndRest}
          />
        ) : (
          <CurrentExercise
            currentExercise={currentExercise}
            currentExerciseIndex={currentExerciseIndex}
            currentSetIndex={currentSetIndex}
            totalSets={totalSets}
            handlePrevSet={handlePrevSet}
            handleNextSet={handleNextSet}
          />
        )}
      </View>

      {/* Footer with End Workout Button - positioned to be above tab bar */}
      <View className="px-5 py-4 bg-black" style={{ paddingBottom: 30 }}>
        <TouchableOpacity
          className="bg-neutral-800 rounded-full py-5 items-center flex-row justify-center"
          onPress={handleCompleteWorkout}
        >
          <Text className="text-white text-lg font-poppins-semibold">Quit Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}