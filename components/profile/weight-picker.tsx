"use client"

import { useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { supabase } from "@/lib/supabase"
import AppleStylePickerV2 from "./value-picker"

interface WeightPickerProps {
  userId: string
  onboardingDataId: number
  initialWeight: number
  onClose: () => void
  onUpdate: () => void
}

const WeightPicker = ({ userId, onboardingDataId, initialWeight, onClose, onUpdate }: WeightPickerProps) => {
  const [weight, setWeight] = useState(initialWeight)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!userId || !onboardingDataId) {
      setError("User data not available")
      return
    }

    try {
      setIsUpdating(true)
      setError("")

      // Update the onboarding data
      const { error: updateError } = await supabase
        .from("onboarding_data")
        .update({
          weight,
          updated_at: new Date().toISOString(),
        })
        .eq("onboarding_data_id", onboardingDataId)

      if (updateError) {
        console.error("Error updating weight:", updateError)
        setError("Failed to update weight")
        return
      }

      // Call the onUpdate callback to refresh the profile data
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
        <AppleStylePickerV2
          title="Weight"
          unit="kg"
          minValue={40}
          maxValue={150}
          initialValue={initialWeight}
          step={1}
          onValueChange={setWeight}
          onClose={onClose}
          onSave={handleSave}
        />
      )}
    </View>
  )
}

export default WeightPicker
