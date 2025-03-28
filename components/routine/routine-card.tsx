import React from "react"
import { Link } from "expo-router"
import { ChevronRight, Dumbbell, Timer, CheckCircle } from "lucide-react-native"
import { View, Text, TouchableOpacity } from "react-native"
import type { Exercise, Workout } from "@/lib/workouts"

interface WorkoutCardProps {
  workout: Workout
  pressable?: boolean
  onComplete?: () => void
  isCompleted?: boolean
}

const WorkoutCard = ({ workout, pressable = true, onComplete, isCompleted = false }: WorkoutCardProps) => {
  // Format the last performed date if available
  const lastPerformed = workout.last_performed
    ? new Date(workout.last_performed).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Not performed yet"

  const countExercises = (exercises: Exercise[] | undefined) => {
    if(!exercises) return 0
    if(exercises.length === 1) return  "1 exercise"
    return `${exercises.length} exercises`
  }

  return (
    <>
      {pressable ? (
        <Link
          href={{
            pathname: "/(tabs)/[id]",
            params: { id: workout.workout_id },
          }}
          asChild
        >
          <TouchableOpacity className="bg-neutral-900 rounded-3xl py-4 px-5 mb-3">
            <View>
              <View className="flex-row justify-between">
                <Text className="text-white text-xl font-semibold mb-2">{workout.title}</Text>
                {isCompleted && <CheckCircle size={20} color="#22c55e" />}
              </View>
              <View className="flex-row items-center mb-2">
                <Dumbbell size={16} color="#FF3737" />
                <Text className="text-neutral-400 text-base font-poppins-medium ml-1 mr-3">
                  {countExercises(workout.exercises)}
                </Text>
                <Timer size={16} color="#FF3737" />
                <Text className="text-neutral-400 text-base font-poppins-medium ml-1">{workout.duration} min</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-neutral-500 text-base font-poppins-semibold">{lastPerformed}</Text>
                <ChevronRight size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      ) : (
        <TouchableOpacity
          className="bg-neutral-900 rounded-3xl py-4 px-5 mb-3"
          onPress={onComplete}
          disabled={!onComplete}
        >
          <View>
            <View className="flex-row justify-between">
              <Text className="text-white text-lg font-semibold mb-2">{workout.title}</Text>
              {isCompleted && <CheckCircle size={20} color="#22c55e" />}
            </View>
            <View className="flex-row items-center mb-2">
              <Dumbbell size={16} color="#FF3737" />
              <Text className="text-neutral-400 text-sm font-poppins-medium ml-1 mr-3">
                {workout.exercises && workout.exercises.length > 0 ? "1 exercise" : "No exercises"}
              </Text>
              <Timer size={16} color="#FF3737" />
              <Text className="text-neutral-400 text-sm font-poppins-medium ml-1">{workout.duration} min</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-neutral-500 text-sm font-poppins-semibold">{lastPerformed}</Text>
              {onComplete && !isCompleted ? (
                <TouchableOpacity onPress={onComplete} className="bg-red-500 px-3 py-1 rounded-full">
                  <Text className="text-white font-poppins-medium">Complete</Text>
                </TouchableOpacity>
              ) : (
                <ChevronRight size={20} color="white" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  )
}

export default WorkoutCard

