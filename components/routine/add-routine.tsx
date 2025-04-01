"use client"

import { View, Text, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Alert } from "react-native"
import { Dumbbell, Plus, Trash2 } from "lucide-react-native"
import { bodyParts } from "@/constants/data"
import Input from "@/components/input"
import { useState } from "react"
import { useWorkouts } from "@/hooks/use-workouts"
import { useAuth } from "@/context/auth"
import { Exercise, getExerciseImage } from "@/lib/exercises"

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

  const [exercises, setExercises] = useState<
    Array<{
      name: string
      sets: number
      reps: number
      weight: number | null
      image: string | null
      tips: string | null
    }>
  >([
    {
      name: "",
      sets: 3,
      reps: 10,
      weight: null,
      image: null,
      tips: null,
    },
  ])

  const keyboardVerticalOffset = Platform.OS === "ios" ? 50 : 0

  const handleAddExercise = () => {
    console.log("Adding exercise, current count:", exercises.length)
    // Create a new array with the existing exercises plus a new one
    const newExercises = [
      ...exercises,
      {
        name: "",
        sets: 3,
        reps: 10,
        weight: null,
        image: null,
        tips: null,
      },
    ]
    setExercises(newExercises)
    console.log("New exercises count:", newExercises.length)
  }

  const handleRemoveExercise = (index: number) => {
    if (exercises.length === 1) {
      Alert.alert("Error", "You must have at least one exercise")
      return
    }

    const newExercises = [...exercises]
    newExercises.splice(index, 1)
    setExercises(newExercises)
  }

  const handleExerciseChange = (
    index: number,
    field: keyof Omit<Exercise, "exercise_id" | "workout_id">,
    value: any,
  ) => {
    const newExercises = [...exercises]

    if (field === "sets" || field === "reps" || field === "weight") {
      newExercises[index][field] = value === "" ? 0 : Number.parseInt(value) || 0
    } else {
      newExercises[index][field as "name" | "image" | "tips"] = value
    }

    // If the name field is being updated, automatically set the image based on the exercise name
    if (field === "name" && value) {
      newExercises[index].image = getExerciseImage(value, workoutData.body_part)
    }

    setExercises(newExercises)
  }

  // Update the handleSubmit function to fix date formatting
  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to create a workout")
      return
    }

    if (!workoutData.title) {
      Alert.alert("Error", "Please enter a workout name")
      return
    }

    // Validate all exercises have a name
    const invalidExercises = exercises.filter((ex) => !ex.name)
    if (invalidExercises.length > 0) {
      Alert.alert("Error", "All exercises must have a name")
      return
    }

    try {
      setIsSubmitting(true)

      // Convert duration to number if it's a string
      const durationNumber = Number.parseInt(workoutData.duration) || 0

      // Use ISO format for the date without timezone info
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString().split("T")[0] + "T00:00:00Z"

      console.log("Adding workout with data:", {
        workoutData: {
          title: workoutData.title,
          duration: durationNumber,
          body_part: workoutData.body_part,
          image: workoutData.image,
          last_performed: formattedDate,
          user_id: userId,
        },
        exercises,
      })

      const result = await addWorkout(
        {
          title: workoutData.title,
          duration: durationNumber,
          body_part: workoutData.body_part,
          image: workoutData.image,
          last_performed: formattedDate,
          user_id: userId,
        },
        exercises as Omit<Exercise, "exercise_id" | "workout_id">[],
      )

      if (result) {
        console.log("Workout created successfully:", result)
        // Reset form
        setWorkoutData({
          title: "",
          duration: "",
          body_part: "All",
          image: null,
        })
        setExercises([
          {
            name: "",
            sets: 3,
            reps: 10,
            weight: null,
            image: null,
            tips: null,
          },
        ])

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }
      } else {
        console.error("Failed to create workout, no result returned")
        Alert.alert("Error", "Failed to create workout. Please try again.")
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

        {/* Exercises */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-poppins-medium">Exercises</Text>
            <TouchableOpacity
              onPress={() => handleAddExercise()}
              activeOpacity={0.7}
              className="bg-neutral-800 p-2 rounded-full"
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>

          {exercises.map((exercise, index) => (
            <View key={index} className="bg-neutral-800 p-5 rounded-3xl mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-xl font-poppins-medium">Exercise {index + 1}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveExercise(index)}
                  className="bg-neutral-700 p-2 rounded-full"
                >
                  <Trash2 size={16} color="white" />
                </TouchableOpacity>
              </View>

              <Input
                value={exercise.name}
                onChangeText={(text) => handleExerciseChange(index, "name", text)}
                placeholder="Enter exercise name"
                mode="outlined"
                keyboardType="default"
                focus={false}
              />

              <View className="flex-row gap-3 mt-3">
                <Input
                  value={exercise.sets?.toString() || ""}
                  onChangeText={(text) => handleExerciseChange(index, "sets", text)}
                  placeholder="Sets"
                  mode="outlined"
                  keyboardType="numeric"
                  focus={false}
                  moreStyles={{ width: "48%" }}
                />
                <Input
                  value={exercise.reps?.toString() || ""}
                  onChangeText={(text) => handleExerciseChange(index, "reps", text)}
                  placeholder="Reps"
                  mode="outlined"
                  keyboardType="numeric"
                  focus={false}
                  moreStyles={{ width: "48%" }}
                />
              </View>

              <View className="mt-3">
                <Input
                  value={exercise.weight?.toString() || ""}
                  onChangeText={(text) => handleExerciseChange(index, "weight", text)}
                  placeholder="Enter weight (kg)"
                  mode="outlined"
                  keyboardType="numeric"
                  focus={false}
                />
              </View>
            </View>
          ))}
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