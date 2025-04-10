"use client"

import { useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { supabase } from "@/lib/supabase"
import AppleStylePickerV2 from "./value-picker"
import { useUnits } from "@/context/units-context"

interface WeightPickerProps {
  userId: string
  onboardingDataId: number
  initialWeight: number
  onClose: () => void
  onUpdate: () => void
}

// Update the WeightPicker to use the body weight unit
const WeightPicker = ({ userId, onboardingDataId, initialWeight, onClose, onUpdate }: WeightPickerProps) => {
  const [weight, setWeight] = useState(initialWeight)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const { bodyUnit, getBodyWeightUnit, convertWeight } = useUnits()
  const weightUnit = getBodyWeightUnit() // Use the body weight unit

  // Convert weight to kg for storage if needed
  const getWeightInKg = () => {
    return weightUnit === "kg" ? weight : convertWeight(weight, "lb", "kg")
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
          weight: getWeightInKg(), // Always store in kg in the database
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
          unit={weightUnit}
          minValue={weightUnit === "kg" ? 40 : 88}
          maxValue={weightUnit === "kg" ? 150 : 330}
          initialValue={weightUnit === "kg" ? initialWeight : convertWeight(initialWeight, "kg", "lb")}
          step={weightUnit === "kg" ? 1 : 1}
          onValueChange={setWeight}
          onClose={onClose}
          onSave={handleSave}
        />
      )}
    </View>
  )
}

export default WeightPicker