"use client"

import { useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { supabase } from "@/lib/supabase"
import AppleStylePicker from "@/components/profile/value-picker"

interface SetsPickerProps {
  exerciseId: number
  initialSets: number
  onClose: () => void
  onUpdate: () => void
}

const SetsPicker = ({ exerciseId, initialSets, onClose, onUpdate }: SetsPickerProps) => {
  const [sets, setSets] = useState(initialSets)
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

      // Update the exercise sets
      const { error: updateError } = await supabase
        .from("exercise")
        .update({
          sets: sets,
        })
        .eq("exercise_id", exerciseId)

      if (updateError) {
        console.error("Error updating sets:", updateError)
        setError("Failed to update sets")
        return
      }

      // Call the onUpdate callback to refresh the exercise data
      onUpdate()

      // Close the bottom sheet
      onClose()
    } catch (error) {
      console.error("Unexpected error updating sets:", error)
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
          title="Sets"
          unit="sets"
          minValue={1}
          maxValue={10}
          initialValue={initialSets}
          step={1}
          onValueChange={setSets}
          onClose={onClose}
          onSave={handleSave}
        />
      )}
    </View>
  )
}

export default SetsPicker
