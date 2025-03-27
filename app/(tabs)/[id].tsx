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
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronLeft, Clock, Dumbbell, Flame, PlayCircle } from "lucide-react-native"
import BotSheet from "@/components/bot-sheet"
import type BottomSheet from "@gorhom/bottom-sheet"
import { LinearGradient } from "expo-linear-gradient"
import { MotiView } from "moti"
import { MotiPressable } from "moti/interactions"
import * as Haptics from "expo-haptics"
import ExerciseInfo from "@/components/routine/exercise-info"
import { useAuth } from "@/context/auth"
import { supabase } from "@/lib/supabase"
import type { Exercise, Workout } from "@/lib/workouts"
import { useWorkouts } from "@/hooks/use-workouts"

const WorkoutDetailScreen = () => {
  const { id } = useLocalSearchParams()
  const { session } = useAuth()
  const userId = session?.user?.id
  const { workouts, completeWorkout, isWorkoutCompletedOnDate } = useWorkouts(userId)

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
          console.error("Workout not found")
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
  const imageUrl =
    workout.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
  const isCompleted = userId ? isWorkoutCompletedOnDate(workout.workout_id) : false

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image source={{ uri: imageUrl }} className="size-full" resizeMode="cover" />
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
                      <Dumbbell size={16} color="#888" />
                      <Text className="text-neutral-400 font-poppins">
                        {workout.exercises?.length || 0} {workout.exercises?.length === 1 ? "exercise" : "exercises"}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Clock size={16} color="#888" />
                      <Text className="text-neutral-400 font-poppins">{workout.duration} min</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Flame size={16} color="#FF3737" />
                      <Text className="text-neutral-400 font-poppins">~150 kcal</Text>
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
                  const uniqueKey = `exercise-${index}-${exercise.id || exercise.name || Date.now()}`

                  return (
                    <MotiView
                      key={uniqueKey}
                      from={{ opacity: 0, translateY: 20 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{ type: "timing", duration: 500, delay: index * 100 }}
                    >
                      <MotiPressable
                        onPress={() => handleOpenBottomSheet(exercise)}
                        animate={({ pressed }) => {
                          "worklet"
                          return {
                            scale: pressed ? 0.98 : 1,
                            opacity: pressed ? 0.9 : 1,
                          }
                        }}
                        transition={{ type: "timing", duration: 150 }}
                        style={{ marginBottom: 15, borderRadius: 30 }}
                      >
                        <LinearGradient
                          colors={["#2A2A2A", "#1A1A1A"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          className="p-[1px] mb-3"
                          style={{ borderRadius: 24 }}
                        >
                          <MotiView
                            className="flex-row items-center rounded-3xl py-4 px-4 pl-6"
                            animate={{ opacity: 1 }}
                            from={{ opacity: 0 }}
                            transition={{
                              type: "timing",
                              duration: 500,
                            }}
                          >
                            <View className="flex-row justify-between items-center">
                              <View className="flex-1 gap-1">
                                <Text className="text-white text-xl font-poppins-medium mb-1">{exercise.name}</Text>
                                <View className="flex-row items-center gap-2">
                                  <LinearGradient
                                    colors={["#3A3A3A", "#2A2A2A"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="p-[1px] mr-2"
                                    style={{ borderRadius: 20 }}
                                  >
                                    <View className="bg-white/60 rounded-lg px-3 py-0.5">
                                      <Text className="text-black font-poppins-semibold">{exercise.sets} sets</Text>
                                    </View>
                                  </LinearGradient>
                                  <LinearGradient
                                    colors={["#3A3A3A", "#2A2A2A"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="p-[1px]"
                                    style={{ borderRadius: 20 }}
                                  >
                                    <View className="bg-white/60 rounded-lg px-3 py-0.5">
                                      <Text className="text-black font-poppins-semibold">{exercise.reps} reps</Text>
                                    </View>
                                  </LinearGradient>
                                </View>
                              </View>
                              {exercise.image && (
                                <Image
                                  source={{ uri: exercise.image }}
                                  style={{ width: 80, height: 80 }}
                                  resizeMode="contain"
                                />
                              )}
                            </View>
                          </MotiView>
                        </LinearGradient>
                      </MotiPressable>
                    </MotiView>
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
        <TouchableOpacity style={styles.floatingButton} className="bg-white" onPress={handleCompleteWorkout}>
          <View className="flex-row justify-center items-center">
            <Text className="text-black text-center text-xl font-poppins-semibold mr-2">Complete workout</Text>
            <PlayCircle size={24} color="black" />
          </View>
        </TouchableOpacity>
      )}

      {isCompleted && (
        <View style={styles.floatingButton} className="bg-green-500">
          <View className="flex-row justify-center items-center">
            <Text className="text-white text-center text-xl font-poppins-semibold mr-2">Workout completed</Text>
          </View>
        </View>
      )}

      <BotSheet ref={bottomSheetRef}>{selectedExercise && <ExerciseInfo exercise={selectedExercise} />}</BotSheet>
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

