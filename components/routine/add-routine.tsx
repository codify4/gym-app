"use client"

import { View, Text, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Alert } from "react-native"
import { Dumbbell } from "lucide-react-native"
import { bodyParts } from "@/constants/data"
import Input from "@/components/input"
import { useState } from "react"
import { useWorkouts } from "@/hooks/use-workouts"
import { useAuth } from "@/context/auth"

type AddWorkoutProps = {
  onSuccess?: () => void
  onCancel?: () => void
}

const AddWorkout = ({ onSuccess, onCancel }: AddWorkoutProps) => {
  const { session } = useAuth()
  const userId = session?.user?.id
  const { addWorkout } = useWorkouts(userId)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [workoutData, setWorkoutData] = useState<{
    title: string
    duration: string
    body_part: string
    image: string | null
  }>({
    title: "",
    duration: "",
    body_part: "All",
    image: null,
  })

  const [exerciseData, setExerciseData] = useState<{
    name: string
    sets: number
    reps: number
    image: string | null
    tips: string | null
  }>({
    name: "",
    sets: 3,
    reps: 10,
    image: null,
    tips: null,
  })

  const keyboardVerticalOffset = Platform.OS === "ios" ? 50 : 0

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to create a workout")
      return
    }

    if (!workoutData.title) {
      Alert.alert("Error", "Please enter a workout name")
      return
    }

    if (!exerciseData.name) {
      Alert.alert("Error", "Please enter an exercise name")
      return
    }

    try {
      setIsSubmitting(true)

      // Convert duration to number if it's a string
      const durationNumber = Number.parseInt(workoutData.duration) || 0

      const result = await addWorkout(
        {
          title: workoutData.title,
          duration: durationNumber,
          body_part: workoutData.body_part,
          image: workoutData.image,
          last_performed: new Date().toString(),
          user_id: userId,
        },
        {
          name: exerciseData.name,
          sets: exerciseData.sets,
          reps: exerciseData.reps,
          image: exerciseData.image,
          tips: exerciseData.tips,
        },
      )

      if (result) {
        Alert.alert("Success", "Workout created successfully")
        // Reset form
        setWorkoutData({
          title: "",
          duration: "",
          body_part: "All",
          image: null,
        })
        setExerciseData({
          name: "",
          sets: 3,
          reps: 10,
          image: null,
          tips: null,
        })

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      console.error("Error creating workout:", error)
      Alert.alert("Error", "Failed to create workout. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView className="w-full mb-10" behavior={"padding"} keyboardVerticalOffset={keyboardVerticalOffset}>
      <ScrollView className="px-2" showsVerticalScrollIndicator={false}>
        <Text className="text-center text-white text-2xl font-poppins-semibold mb-2">Add New Workout</Text>

        {/* Workout Name */}
        <View className="mb-6">
          <Text className="text-white text-lg font-poppins-medium mb-2">Workout Name</Text>
          <Input
            value={workoutData.title}
            onChangeText={(text) => setWorkoutData((prev) => ({ ...prev, title: text }))}
            placeholder="Enter workout name"
            mode="outlined"
            keyboardType="default"
            focus={false}
          />
        </View>

        {/* Duration */}
        <View className="mb-6">
          <Text className="text-white text-lg font-poppins-medium mb-2">Duration (minutes)</Text>
          <Input
            value={workoutData.duration}
            onChangeText={(text) => setWorkoutData((prev) => ({ ...prev, duration: text }))}
            placeholder="Enter duration"
            mode="outlined"
            keyboardType="numeric"
            focus={false}
          />
        </View>

        {/* Body Part Selection */}
        <View className="mb-6">
          <Text className="text-white text-lg font-poppins-medium mb-2">Target Body Part</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bodyParts.map((part, index) => (
              <TouchableOpacity
                key={index}
                className={`mr-2 px-6 py-2 rounded-full ${workoutData.body_part === part.name ? "bg-white" : "bg-neutral-800"}`}
                onPress={() => setWorkoutData((prev) => ({ ...prev, body_part: part.name }))}
              >
                <Text
                  className={`text-lg font-poppins-medium ${workoutData.body_part === part.name ? "text-black" : "text-white"}`}
                >
                  {part.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exercise */}
        <View className="mb-6">
          <Text className="text-white text-lg font-poppins-medium mb-2">Exercise</Text>
          <View className="bg-neutral-800 p-5 rounded-3xl mb-2">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-xl font-poppins-medium">Exercise Details</Text>
            </View>
            <Input
              value={exerciseData.name}
              onChangeText={(text) => setExerciseData((prev) => ({ ...prev, name: text }))}
              placeholder="Enter exercise name"
              mode="outlined"
              keyboardType="default"
              focus={false}
            />
            <View className="flex-row gap-3 mt-3">
              <Input
                value={exerciseData.sets.toString()}
                onChangeText={(text) => setExerciseData((prev) => ({ ...prev, sets: Number.parseInt(text) || 0 }))}
                placeholder="Enter sets"
                mode="outlined"
                keyboardType="numeric"
                focus={false}
                moreStyles={{ width: "48%" }}
              />
              <Input
                value={exerciseData.reps.toString()}
                onChangeText={(text) => setExerciseData((prev) => ({ ...prev, reps: Number.parseInt(text) || 0 }))}
                placeholder="Enter reps"
                mode="outlined"
                keyboardType="numeric"
                focus={false}
                moreStyles={{ width: "48%" }}
              />
            </View>
            <View className="mt-3">
              <Input
                value={exerciseData.tips || ""}
                onChangeText={(text) => setExerciseData((prev) => ({ ...prev, tips: text }))}
                placeholder="Enter tips (optional)"
                mode="outlined"
                keyboardType="default"
                focus={false}
                // multiline={true}
                // numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`p-5 rounded-full items-center mb-8 flex-row justify-center gap-2 ${isSubmitting ? "bg-gray-400" : "bg-white"}`}
        >
          <Dumbbell size={20} color="black" />
          <Text className="text-black text-xl font-poppins-semibold">
            {isSubmitting ? "Creating..." : "Create Workout"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default AddWorkout

