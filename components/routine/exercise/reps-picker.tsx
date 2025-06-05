"use client"

import { useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { supabase } from "@/lib/supabase"
import AppleStylePicker from "@/components/profile/value-picker"

interface RepsPickerProps {
  exerciseId: number
  initialReps: number
  onClose: () => void
  onUpdate: () => void
}

const RepsPicker = ({ exerciseId, initialReps, onClose, onUpdate }: RepsPickerProps) => {
  const [reps, setReps] = useState(initialReps)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!exerciseId) {
      setError("Exercise data not available")
      return
    }

    try {
      setIsUpdating(true)
      setError("")

      // Update the exercise reps
      const { error: updateError } = await supabase
        .from("exercise")
        .update({
          reps: reps,
        })
        .eq("exercise_id", exerciseId)

      if (updateError) {
        console.error("Error updating reps:", updateError)
        setError("Failed to update reps")
        return
      }

      // Call the onUpdate callback to refresh the exercise data
      onUpdate()

      // Close the bottom sheet
      onClose()
    } catch (error) {
      console.error("Unexpected error updating reps:", error)
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
          title="Reps"
          unit="reps"
          minValue={1}
          maxValue={50}
          initialValue={initialReps}
          step={1}
          onValueChange={setReps}
          onClose={onClose}
          onSave={handleSave}
        />
      )}
    </View>
  )
}

export default RepsPicker
