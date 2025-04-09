"use client"

import { useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { supabase } from "@/lib/supabase"
import AppleStylePickerV2 from "./value-picker"

interface HeightPickerProps {
  userId: string
  onboardingDataId: number
  initialHeight: number
  onClose: () => void
  onUpdate: () => void
}

const HeightPicker = ({ userId, onboardingDataId, initialHeight, onClose, onUpdate }: HeightPickerProps) => {
  const [height, setHeight] = useState(initialHeight)
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
          height,
          updated_at: new Date().toISOString(),
        })
        .eq("onboarding_data_id", onboardingDataId)

      if (updateError) {
        console.error("Error updating height:", updateError)
        setError("Failed to update height")
        return
      }

      // Call the onUpdate callback to refresh the profile data
      onUpdate()

      // Close the bottom sheet
      onClose()
    } catch (error) {
      console.error("Unexpected error updating height:", error)
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
          title="Height"
          unit="cm"
          minValue={140}
          maxValue={220}
          initialValue={initialHeight}
          step={1}
          onValueChange={setHeight}
          onClose={onClose}
          onSave={handleSave}
        />
      )}
    </View>
  )
}

export default HeightPicker