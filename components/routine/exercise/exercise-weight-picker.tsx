"use client"

import { useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { supabase } from "@/lib/supabase"
import AppleStylePicker from "@/components/profile/value-picker"
import { useUnits } from "@/context/units-context"

interface ExerciseWeightPickerProps {
  exerciseId: number
  initialWeight: number
  onClose: () => void
  onUpdate: () => void
}

const ExerciseWeightPicker = ({ exerciseId, initialWeight, onClose, onUpdate }: ExerciseWeightPickerProps) => {
  const [weight, setWeight] = useState(initialWeight)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const { weightUnit, convertWeight } = useUnits()

  // Convert weight to kg for storage if needed
  const getWeightInKg = () => {
    return weightUnit === "kg" ? weight : convertWeight(weight, "lb", "kg")
  }

  const handleSave = async () => {
    if (!exerciseId) {
      setError("Exercise data not available")
      return
    }

    try {
      setIsUpdating(true)
      setError("")

      // Update the exercise weight (always store in kg in the database)
      const { error: updateError } = await supabase
        .from("exercise")
        .update({
          weight: getWeightInKg(),
        })
        .eq("exercise_id", exerciseId)

      if (updateError) {
        console.error("Error updating weight:", updateError)
        setError("Failed to update weight")
        return
      }

      // Call the onUpdate callback to refresh the exercise data
      onUpdate()

      // Close the bottom sheet
      onClose()
    } catch (error) {
      console.error("Unexpected error updating weight:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {isUpdating ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <AppleStylePicker
          title="Weight"
          unit={weightUnit}
          minValue={weightUnit === "kg" ? 0.5 : 1}
          maxValue={weightUnit === "kg" ? 200 : 440}
          initialValue={weightUnit === "kg" ? initialWeight : Math.round(convertWeight(initialWeight, "kg", "lb"))}
          step={weightUnit === "kg" ? 0.5 : 1}
          onValueChange={(value) => setWeight(Number(value))}
          onClose={onClose}
          onSave={handleSave}
        />
      )}
    </View>
  )
}

export default ExerciseWeightPicker
