"use client"

import React, { useState, useRef } from "react"
import { View, Text, ScrollView, Image, TouchableOpacity, Platform } from "react-native"
import { Info, ChevronRight } from "lucide-react-native"
import * as Haptics from "expo-haptics"
import type { Exercise } from "@/lib/exercises"
import { getExerciseTips } from "@/utils/exercise-tips"
import { getImageSource } from "@/utils/exercise-muscle"
import { useUnits } from "@/context/units-context"
import BotSheet from "@/components/bot-sheet"
import type BottomSheet from "@gorhom/bottom-sheet"
import SetsPicker from "./exercise/sets-picker"
import RepsPicker from "./exercise/reps-picker"
import ExerciseWeightPicker from "./exercise/exercise-weight-picker"
import { supabase } from "@/lib/supabase"

interface ExerciseInfoProps {
  exercise: Exercise
  onExerciseUpdate?: (updatedExercise?: Exercise) => void
}

const ExerciseInfo = ({ exercise, onExerciseUpdate }: ExerciseInfoProps) => {
  const { weightUnit, formatWeight, convertWeight } = useUnits()
  const [selectedStat, setSelectedStat] = useState<string | null>(null)
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Get tips based on exercise name and body part
  const tipsList =
    exercise.tips && Array.isArray(exercise.tips) ? exercise.tips : getExerciseTips(exercise.name, exercise.body_part)

  const handleOpenStatPicker = (statType: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    setSelectedStat(statType)
    bottomSheetRef.current?.expand()
  }

  const handleCloseStatPicker = () => {
    bottomSheetRef.current?.close()
    setSelectedStat(null)
  }

  const handleStatUpdate = async () => {
    // Refresh the exercise data from the database
    if (exercise.exercise_id) {
      try {
        const { data: updatedExercise, error } = await supabase
          .from("exercise")
          .select("*")
          .eq("exercise_id", exercise.exercise_id)
          .single()

        if (error) {
          console.error("Error fetching updated exercise:", error)
          return
        }

        // Update the local exercise state by calling the parent's update function
        if (onExerciseUpdate) {
          onExerciseUpdate(updatedExercise)
        }
      } catch (error) {
        console.error("Error updating exercise state:", error)
      }
    }
  }

  const renderStatPicker = () => {
    if (!exercise) {
      return (
        <View className="p-6 items-center">
          <Text className="text-white text-lg">Exercise data not available</Text>
        </View>
      )
    }

    switch (selectedStat) {
      case "sets":
        return (
          <SetsPicker
            exerciseId={exercise.exercise_id}
            initialSets={exercise.sets}
            onClose={handleCloseStatPicker}
            onUpdate={handleStatUpdate}
          />
        )
      case "reps":
        return (
          <RepsPicker
            exerciseId={exercise.exercise_id}
            initialReps={exercise.reps}
            onClose={handleCloseStatPicker}
            onUpdate={handleStatUpdate}
          />
        )
      case "weight":
        return (
          <ExerciseWeightPicker
            exerciseId={exercise.exercise_id}
            initialWeight={exercise.weight || 0}
            onClose={handleCloseStatPicker}
            onUpdate={handleStatUpdate}
          />
        )
      default:
        return (
          <View className="p-6 items-center">
            <Text className="text-white text-lg">Select a stat to edit</Text>
          </View>
        )
    }
  }

  return (
    <>
      {exercise && (
        <ScrollView className="flex-1 bg-neutral-900 rounded-3xl">
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-3xl font-poppins-semibold">{exercise.name}</Text>
            </View>

            <View className="mb-6">
              {exercise.image ? (
                <Image
                  source={getImageSource(exercise)}
                  style={{ width: "100%", height: 200, borderRadius: 16 }}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={{ width: "100%", height: 200, borderRadius: 16 }}
                  className="bg-neutral-800 items-center justify-center"
                >
                  <Text className="text-white text-lg">No image available</Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-between mb-6">
              {/* Sets */}
              <TouchableOpacity
                className="bg-neutral-800 rounded-2xl p-4 flex-1 mr-2 flex-row items-center justify-between"
                onPress={() => handleOpenStatPicker("sets")}
                disabled={!exercise.exercise_id}
              >
                <View>
                  <Text className="text-neutral-400 text-sm font-poppins-medium mb-1">Sets</Text>
                  <Text className="text-white text-2xl font-poppins-bold">{exercise.sets}</Text>
                </View>
                {exercise.exercise_id && <ChevronRight size={16} color="white" />}
              </TouchableOpacity>

              {/* Reps */}
              <TouchableOpacity
                className="bg-neutral-800 rounded-2xl p-4 flex-1 ml-2 flex-row items-center justify-between"
                onPress={() => handleOpenStatPicker("reps")}
                disabled={!exercise.exercise_id}
              >
                <View>
                  <Text className="text-neutral-400 text-sm font-poppins-medium mb-1">Reps</Text>
                  <Text className="text-white text-2xl font-poppins-bold">{exercise.reps}</Text>
                </View>
                {exercise.exercise_id && <ChevronRight size={16} color="white" />}
              </TouchableOpacity>

              {/* Weight */}
              {exercise.weight !== undefined && (
                <TouchableOpacity
                  className="bg-neutral-800 rounded-2xl p-4 flex-1 ml-2 flex-row items-center justify-between"
                  onPress={() => handleOpenStatPicker("weight")}
                  disabled={!exercise.exercise_id}
                >
                  <View>
                    <Text className="text-neutral-400 text-sm font-poppins-medium mb-1">Weight</Text>
                    <Text className="text-white text-2xl font-poppins-bold">
                      {weightUnit === "kg"
                        ? formatWeight(exercise.weight || 0)
                        : formatWeight(convertWeight(exercise.weight || 0, "kg", "lb"))}
                    </Text>
                  </View>
                  {exercise && <ChevronRight size={16} color="white" />}
                </TouchableOpacity>
              )}
            </View>

            <View>
              <View className="flex-row items-center mb-4">
                <Info size={24} color="#FF3737" />
                <Text className="text-white text-xl font-poppins-semibold ml-2">How to perform</Text>
              </View>
              <View className="bg-neutral-800 rounded-2xl p-4">
                {tipsList.map((tip, index) => (
                  <Text key={index} className="text-white text-lg font-poppins-medium leading-6 mb-2">
                    {index + 1}. {tip}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <BotSheet snapPoints={["60%"]} ref={bottomSheetRef}>
        {renderStatPicker()}
      </BotSheet>
    </>
  )
}

export default ExerciseInfo
