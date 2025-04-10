"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth"

// Add a new type for body units at the top of the file
export type BodyUnit = "metric" | "imperial"

// Update the types at the top of the file
export type DistanceUnit = "km" | "mi"
export type WeightUnit = "kg" | "lb"
export type HeightUnit = "cm" | "ft"

// Update the UnitsContextType interface to include bodyUnit
interface UnitsContextType {
  distanceUnit: DistanceUnit
  weightUnit: WeightUnit
  heightUnit: HeightUnit
  bodyUnit: BodyUnit // Add this new property
  setDistanceUnit: (unit: DistanceUnit) => Promise<void>
  setWeightUnit: (unit: WeightUnit) => Promise<void>
  setHeightUnit: (unit: HeightUnit) => Promise<void>
  setBodyUnit: (unit: BodyUnit) => Promise<void> // Add this new method
  convertWeight: (value: number, fromUnit: WeightUnit, toUnit: WeightUnit) => number
  convertHeight: (value: number, fromUnit: HeightUnit, toUnit: HeightUnit) => number
  convertDistance: (value: number, fromUnit: DistanceUnit, toUnit: DistanceUnit) => number
  formatWeight: (value: number, unit?: WeightUnit) => string
  formatHeight: (value: number, unit?: HeightUnit) => string
  formatDistance: (value: number, unit?: DistanceUnit) => string
  getBodyHeightUnit: () => HeightUnit // Add this helper method
  getBodyWeightUnit: () => WeightUnit // Add this helper method
}

// Add a new storage key for body units
const BODY_UNIT_KEY = "workout_mate_body_unit"

// Update the context default values to include bodyUnit
const UnitsContext = createContext<UnitsContextType>({
  distanceUnit: "km",
  weightUnit: "kg",
  heightUnit: "cm",
  bodyUnit: "metric", // Add default value
  setDistanceUnit: async () => {},
  setWeightUnit: async () => {},
  setHeightUnit: async () => {},
  setBodyUnit: async () => {}, // Add this new method
  convertWeight: () => 0,
  convertHeight: () => 0,
  convertDistance: () => 0,
  formatWeight: () => "",
  formatHeight: () => "",
  formatDistance: () => "",
  getBodyHeightUnit: () => "cm", // Add this helper method
  getBodyWeightUnit: () => "kg", // Add this helper method
})

// Update storage keys
const DISTANCE_UNIT_KEY = "workout_mate_distance_unit"
const WEIGHT_UNIT_KEY = "workout_mate_weight_unit"
const HEIGHT_UNIT_KEY = "workout_mate_height_unit"

// Update the provider component
export const UnitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth()
  const userId = session?.user?.id

  const [distanceUnit, setDistanceUnitState] = useState<DistanceUnit>("km")
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>("kg")
  const [heightUnit, setHeightUnitState] = useState<HeightUnit>("cm")
  const [bodyUnit, setBodyUnitState] = useState<BodyUnit>("metric") // Add this new state

  // Load units from storage or database on mount
  useEffect(() => {
    loadUnits()
  }, [userId])

  // Load units from storage or database
  const loadUnits = async () => {
    try {
      if (userId) {
        // Load from database if user is logged in
        const { data, error } = await supabase
          .from("user_preferences")
          .select("distance_unit, weight_unit, height_unit, body_unit") // Add body_unit
          .eq("user_id", userId)
          .maybeSingle()

        if (error) {
          console.error("Error loading units from database:", error)
        } else if (data) {
          // Set units from database
          if (data.distance_unit) setDistanceUnitState(data.distance_unit as DistanceUnit)
          if (data.weight_unit) setWeightUnitState(data.weight_unit as WeightUnit)
          if (data.height_unit) setHeightUnitState(data.height_unit as HeightUnit)
          if (data.body_unit) setBodyUnitState(data.body_unit as BodyUnit) // Add this line
          return
        }
      }

      // Fall back to AsyncStorage if no database data or not logged in
      const distanceUnit = await AsyncStorage.getItem(DISTANCE_UNIT_KEY)
      const weightUnit = await AsyncStorage.getItem(WEIGHT_UNIT_KEY)
      const heightUnit = await AsyncStorage.getItem(HEIGHT_UNIT_KEY)
      const bodyUnit = await AsyncStorage.getItem(BODY_UNIT_KEY) // Add this line

      if (distanceUnit) setDistanceUnitState(distanceUnit as DistanceUnit)
      if (weightUnit) setWeightUnitState(weightUnit as WeightUnit)
      if (heightUnit) setHeightUnitState(heightUnit as HeightUnit)
      if (bodyUnit) setBodyUnitState(bodyUnit as BodyUnit) // Add this line
    } catch (error) {
      console.error("Error loading units:", error)
    }
  }

  // Save units to storage and database
  const saveUnits = async (
    distanceUnit: DistanceUnit,
    weightUnit: WeightUnit,
    heightUnit: HeightUnit,
    bodyUnit: BodyUnit, // Add this parameter
  ) => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(DISTANCE_UNIT_KEY, distanceUnit)
      await AsyncStorage.setItem(WEIGHT_UNIT_KEY, weightUnit)
      await AsyncStorage.setItem(HEIGHT_UNIT_KEY, heightUnit)
      await AsyncStorage.setItem(BODY_UNIT_KEY, bodyUnit) // Add this line

      // Save to database if user is logged in
      if (userId) {
        const { error } = await supabase.from("user_preferences").upsert(
          {
            user_id: userId,
            distance_unit: distanceUnit,
            weight_unit: weightUnit,
            height_unit: heightUnit,
            body_unit: bodyUnit, // Add this line
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )

        if (error) {
          console.error("Error saving units to database:", error)
        }
      }
    } catch (error) {
      console.error("Error saving units:", error)
    }
  }

  // Set distance unit
  const setDistanceUnit = async (unit: DistanceUnit) => {
    setDistanceUnitState(unit)
    await saveUnits(unit, weightUnit, heightUnit, bodyUnit)
  }

  // Set weight unit
  const setWeightUnit = async (unit: WeightUnit) => {
    setWeightUnitState(unit)
    await saveUnits(distanceUnit, unit, heightUnit, bodyUnit)
  }

  // Set height unit
  const setHeightUnit = async (unit: HeightUnit) => {
    setHeightUnitState(unit)

    // If height unit changes, update body unit accordingly
    const newBodyUnit: BodyUnit = unit === "cm" ? "metric" : "imperial"
    setBodyUnitState(newBodyUnit)

    await saveUnits(distanceUnit, weightUnit, unit, newBodyUnit)
  }

  // Set body unit
  const setBodyUnit = async (unit: BodyUnit) => {
    setBodyUnitState(unit)

    // When body unit changes, also update height and weight units accordingly
    const newHeightUnit: HeightUnit = unit === "metric" ? "cm" : "ft"
    const newWeightUnit: WeightUnit = unit === "metric" ? "kg" : "lb"

    setHeightUnitState(newHeightUnit)
    setWeightUnitState(newWeightUnit)

    await saveUnits(distanceUnit, weightUnit, newHeightUnit, unit)
  }

  // Conversion functions
  const convertWeight = (value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
    if (fromUnit === toUnit) return value

    // Convert to kg first (as base unit)
    let valueInKg = value
    if (fromUnit === "lb") valueInKg = value * 0.453592

    // Convert from kg to target unit
    if (toUnit === "kg") return valueInKg
    if (toUnit === "lb") return valueInKg / 0.453592

    return value // Fallback
  }

  const convertHeight = (value: number, fromUnit: HeightUnit, toUnit: HeightUnit): number => {
    if (fromUnit === toUnit) return value

    // Convert to cm first (as base unit)
    let valueInCm = value
    if (fromUnit === "ft") valueInCm = value * 30.48 // 1 foot = 30.48 cm

    // Convert from cm to target unit
    if (toUnit === "cm") return valueInCm
    if (toUnit === "ft") return valueInCm / 30.48

    return value // Fallback
  }

  const convertDistance = (value: number, fromUnit: DistanceUnit, toUnit: DistanceUnit): number => {
    if (fromUnit === toUnit) return value

    // Convert to km first (as base unit)
    let valueInKm = value
    if (fromUnit === "mi") valueInKm = value * 1.60934

    // Convert from km to target unit
    if (toUnit === "km") return valueInKm
    if (toUnit === "mi") return valueInKm / 1.60934

    return value // Fallback
  }

  // Formatting functions
  const formatWeight = (value: number, unit: WeightUnit = weightUnit): string => {
    const convertedValue = convertWeight(value, "kg", unit)
    return `${Math.round(convertedValue)} ${unit}`
  }

  const formatHeight = (value: number, unit: HeightUnit = heightUnit): string => {
    if (unit === "cm") {
      const convertedValue = convertHeight(value, "cm", "cm")
      return `${Math.round(convertedValue)} ${unit}`
    } else {
      // For feet, we want to display feet and inches (e.g., 5'11")
      const totalInches = convertHeight(value, "cm", "ft") * 12
      const feet = Math.floor(totalInches / 12)
      const inches = Math.round(totalInches % 12)
      return `${feet}'${inches}"`
    }
  }

  const formatDistance = (value: number, unit: DistanceUnit = distanceUnit): string => {
    const convertedValue = convertDistance(value, "km", unit)
    return `${convertedValue.toFixed(1)} ${unit}`
  }

  // Add helper methods to get body height and weight units
  const getBodyHeightUnit = (): HeightUnit => {
    return bodyUnit === "metric" ? "cm" : "ft"
  }

  const getBodyWeightUnit = (): WeightUnit => {
    return bodyUnit === "metric" ? "kg" : "lb"
  }

  return (
    <UnitsContext.Provider
      value={{
        distanceUnit,
        weightUnit,
        heightUnit,
        bodyUnit,
        setDistanceUnit,
        setWeightUnit,
        setHeightUnit,
        setBodyUnit,
        convertWeight,
        convertHeight,
        convertDistance,
        formatWeight,
        formatHeight,
        formatDistance,
        getBodyHeightUnit,
        getBodyWeightUnit,
      }}
    >
      {children}
    </UnitsContext.Provider>
  )
}

// Custom hook to use the units context
export const useUnits = () => useContext(UnitsContext)