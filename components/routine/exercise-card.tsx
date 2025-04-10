"use client"

import { useRef } from "react"
import { View, Text, Image, Dimensions } from "react-native"
import { Trash2, Weight } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MotiView } from "moti"
import { MotiPressable } from "moti/interactions"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS, Layout } from "react-native-reanimated"
import type { Exercise } from "@/lib/exercises"
import { getImageSource } from "@/utils/exercise-muscle"
import { useUnits } from "@/context/units-context"

interface ExerciseCardProps {
  exercise: Exercise
  index: number
  onPress: () => void
  onDelete?: (id: number) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3

const ExerciseCard = ({ exercise, index, onPress, onDelete }: ExerciseCardProps) => {
  // Animation values
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(1)
  const isDeleting = useRef(false)
  const { weightUnit, formatWeight, convertWeight } = useUnits()

  // Only add gesture handling if onDelete is provided
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow swiping left (for delete)
      if (event.translationX < 0) {
        translateX.value = event.translationX
      }
    })
    .onEnd((event) => {
      // Check if we've passed the threshold and we have both an onDelete function and an exercise ID
      if (translateX.value < -SWIPE_THRESHOLD && onDelete && exercise.exercise_id) {
        // Animate the card off-screen
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 })
        opacity.value = withTiming(0, { duration: 300 })

        // Set the deleting flag to prevent multiple delete calls
        isDeleting.current = true
        runOnJS(onDelete)(exercise.exercise_id)
      } else {
        // Reset position if threshold not met
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

  // If no delete handler is provided, render without gesture handling
  if (!onDelete) {
    return (
      <MotiView
        key={`exercise-${exercise.exercise_id || index}`}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: index * 100 }}
      >
        <MotiPressable
          onPress={onPress}
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
                  <View className="flex-row items-center gap-2 flex-wrap">
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
                      className="p-[1px] mr-2"
                      style={{ borderRadius: 20 }}
                    >
                      <View className="bg-white/60 rounded-lg px-3 py-0.5">
                        <Text className="text-black font-poppins-semibold">{exercise.reps} reps</Text>
                      </View>
                    </LinearGradient>
                    {exercise.weight && (
                      <LinearGradient
                        colors={["#3A3A3A", "#2A2A2A"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="p-[1px]"
                        style={{ borderRadius: 20 }}
                      >
                        <View className="bg-white/60 rounded-lg px-3 py-0.5 flex-row items-center">
                          <Text className="text-black font-poppins-semibold">{weightUnit === "kg" ? formatWeight(exercise.weight) : formatWeight(convertWeight(exercise.weight, "kg", "lb"))}</Text>
                        </View>
                      </LinearGradient>
                    )}
                  </View>
                </View>
                <Image source={getImageSource(exercise)} style={{ width: 80, height: 80 }} resizeMode="contain" />
              </View>
            </MotiView>
          </LinearGradient>
        </MotiPressable>
      </MotiView>
    )
  }

  // With gesture handling for delete
  return (
    <Animated.View style={rContainerStyle} layout={Layout.springify()} className="mb-4 overflow-hidden">
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
        <Animated.View style={[rStyle]}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: index * 100 }}
          >
            <MotiPressable
              onPress={onPress}
              animate={({ pressed }) => {
                "worklet"
                return {
                  scale: pressed ? 0.98 : 1,
                  opacity: pressed ? 0.9 : 1,
                }
              }}
              transition={{ type: "timing", duration: 150 }}
              style={{ borderRadius: 30 }}
            >
              <LinearGradient
                colors={["#2A2A2A", "#1A1A1A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-[1px]"
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
                      <View className="flex-row items-center gap-2 flex-wrap">
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
                          className="p-[1px] mr-2"
                          style={{ borderRadius: 20 }}
                        >
                          <View className="bg-white/60 rounded-lg px-3 py-0.5">
                            <Text className="text-black font-poppins-semibold">{exercise.reps} reps</Text>
                          </View>
                        </LinearGradient>
                        {exercise.weight && (
                          <LinearGradient
                            colors={["#3A3A3A", "#2A2A2A"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-[1px]"
                            style={{ borderRadius: 20 }}
                          >
                            <View className="bg-white/60 rounded-lg px-3 py-0.5 flex-row items-center">
                              <Text className="text-black font-poppins-semibold">{weightUnit === "kg" ? formatWeight(exercise.weight) : formatWeight(convertWeight(exercise.weight, "kg", "lb"))}</Text>
                            </View>
                          </LinearGradient>
                        )}
                      </View>
                    </View>
                    <Image source={getImageSource(exercise)} style={{ width: 80, height: 80 }} resizeMode="contain" />
                  </View>
                </MotiView>
              </LinearGradient>
            </MotiPressable>
          </MotiView>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

export default ExerciseCard

