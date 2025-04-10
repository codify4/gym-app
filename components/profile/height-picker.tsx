"use client"

import { useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { supabase } from "@/lib/supabase"
import AppleStylePickerV2 from "./value-picker"
import { useUnits } from "@/context/units-context"

interface HeightPickerProps {
  userId: string
  onboardingDataId: number
  initialHeight: number
  onClose: () => void
  onUpdate: () => void
}

// Update the HeightPicker to use the body height unit
const HeightPicker = ({ userId, onboardingDataId, initialHeight, onClose, onUpdate }: HeightPickerProps) => {
  const [height, setHeight] = useState(initialHeight)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const { bodyUnit, getBodyHeightUnit, convertHeight } = useUnits()
  const heightUnit = getBodyHeightUnit() // Use the body height unit

  // Inside the component, add a formatter function for height
  const formatHeightValue = (value: number) => {
    if (heightUnit === "cm") {
      return `${value} cm`
    } else {
      // For feet, we want to display feet and inches
      const totalInches = value * 12
      const feet = Math.floor(totalInches / 12)
      const inches = Math.round(totalInches % 12)
      return `${feet}'${inches}"`
    }
  }

  // Convert height to cm for storage if needed
  const getHeightInCm = () => {
    return heightUnit === "cm" ? height : convertHeight(height, "ft", "cm")
  }

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
          height: getHeightInCm(), // Always store in cm in the database
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
          unit={heightUnit}
          minValue={heightUnit === "cm" ? 140 : 4.5}
          maxValue={heightUnit === "cm" ? 220 : 7.2}
          initialValue={heightUnit === "cm" ? initialHeight : convertHeight(initialHeight, "cm", "ft")}
          step={heightUnit === "cm" ? 1 : 0.1}
          onValueChange={setHeight}
          onClose={onClose}
          onSave={handleSave}
          formatValue={formatHeightValue}
        />
      )}
    </View>
  )
}

export default HeightPicker