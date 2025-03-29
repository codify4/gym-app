"use client"

import { useRef } from "react"
import { Link } from "expo-router"
import { ChevronRight, Dumbbell, Timer, CheckCircle, Trash2, Flame } from "lucide-react-native"
import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS, Layout } from "react-native-reanimated"
import type { Workout } from "@/lib/workouts"
import type { Exercise } from "@/lib/exercises"
import { formatCalories } from "@/utils/calories"

interface WorkoutCardProps {
  workout: Workout
  pressable?: boolean
  onComplete?: () => void
  onDelete?: (id: string) => void
  isCompleted?: boolean
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3

const WorkoutCard = ({ workout, pressable = true, onComplete, onDelete, isCompleted = false }: WorkoutCardProps) => {
  // Format the last performed date if available
  const lastPerformed = workout.last_performed
    ? new Date(workout.last_performed).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Not performed yet"

  const countExercises = (exercises: Exercise[] | undefined) => {
    if (!exercises) return 0
    if (exercises.length === 1) return "1 exercise"
    return `${exercises.length} exercises`
  }

  // Animation values
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(1)
  const isDeleting = useRef(false)

  // Only add gesture handling if onDelete is provided
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow swiping left (for delete)
      if (event.translationX < 0) {
        translateX.value = event.translationX
      }
    })
    .onEnd(() => {
      if (translateX.value < -SWIPE_THRESHOLD && onDelete) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 })
        opacity.value = withTiming(0, { duration: 300 })
        isDeleting.current = true
        runOnJS(onDelete)(workout.workout_id)
      } else {
        translateX.value = withTiming(0)
      }
    })

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const rContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const rRightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? Math.min(1, -translateX.value / SWIPE_THRESHOLD) : 0,
  }))

  // Render the card content
  const renderCardContent = () => (
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
        <Text className="text-neutral-400 text-base font-poppins-medium ml-1 mr-3">{workout.duration} min</Text>
        <Flame size={16} color="#FF3737" />
        <Text className="text-neutral-400 text-base font-poppins-medium ml-1">
          {workout.calories ? formatCalories(workout.calories) : "~150 kcal"}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-neutral-500 text-base font-poppins-semibold">{lastPerformed}</Text>
        {pressable ? (
          <ChevronRight size={20} color="white" />
        ) : onComplete && !isCompleted ? (
          <TouchableOpacity onPress={onComplete} className="bg-red-500 px-3 py-1 rounded-full">
            <Text className="text-white font-poppins-medium">Complete</Text>
          </TouchableOpacity>
        ) : (
          <ChevronRight size={20} color="white" />
        )}
      </View>
    </View>
  )

  // If no delete handler is provided, render without gesture handling
  if (!onDelete) {
    if (pressable) {
      return (
        <Link
          href={{
            pathname: "/(tabs)/[id]",
            params: { id: workout.workout_id },
          }}
          asChild
        >
          <TouchableOpacity className="bg-neutral-900 rounded-3xl py-4 px-5 mb-3">
            {renderCardContent()}
          </TouchableOpacity>
        </Link>
      )
    } else {
      return (
        <TouchableOpacity
          className="bg-neutral-900 rounded-3xl py-4 px-5 mb-3"
          onPress={onComplete}
          disabled={!onComplete}
        >
          {renderCardContent()}
        </TouchableOpacity>
      )
    }
  }

  // With gesture handling for delete
  return (
    <Animated.View className="w-full overflow-hidden mb-3" style={rContainerStyle} layout={Layout.springify()}>
      <View className="absolute inset-0 flex-row justify-between">
        <Animated.View
          className="bg-red-500 h-full items-end justify-center pr-6 rounded-3xl"
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              borderRadius: 24,
              backgroundColor: "#ef4444",
            },
            rRightActionStyle,
          ]}
        >
          <View className="flex-row items-center">
            <Text className="text-white font-bold text-lg mr-2">Delete</Text>
            <Trash2 color="white" size={20} />
          </View>
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            rStyle,
            {
              backgroundColor: "#171717", // neutral-900
              borderRadius: 24,
              padding: 20,
            },
          ]}
        >
          {pressable ? (
            <Link
              href={{
                pathname: "/(tabs)/[id]",
                params: { id: workout.workout_id },
              }}
              asChild
            >
              <TouchableOpacity>{renderCardContent()}</TouchableOpacity>
            </Link>
          ) : (
            <TouchableOpacity onPress={onComplete} disabled={!onComplete}>
              {renderCardContent()}
            </TouchableOpacity>
          )}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

export default WorkoutCard

