import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "./supabase"
import type { OnboardingData } from "@/constants/slides"

// Keys for AsyncStorage
const ONBOARDING_DATA_KEY = "workout_mate_onboarding_data"
const ONBOARDING_DONE_KEY = "workout_mate_onboarding_done"

// Define the database onboarding data structure based on the schema
export interface OnboardingDataRecord {
  onboarding_data_id?: number
  age: number
  height: number
  weight: number
  experience: string
  goal: string
  frequency: string
  created_at?: string
  updated_at?: string
}

/**
 * Save onboarding data to AsyncStorage (for anonymous users)
 */
export const saveOnboardingDataLocally = async (data: OnboardingData): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data))
    console.log("Onboarding data saved locally")
  } catch (error) {
    console.error("Error saving onboarding data locally:", error)
    throw error
  }
}

/**
 * Get onboarding data from AsyncStorage
 */
export const getLocalOnboardingData = async (): Promise<OnboardingData | null> => {
  try {
    const data = await AsyncStorage.getItem(ONBOARDING_DATA_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error getting local onboarding data:", error)
    return null
  }
}

/**
 * Mark onboarding as completed locally
 */
export const markOnboardingDoneLocally = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_DONE_KEY, "true")
  } catch (error) {
    console.error("Error marking onboarding as done locally:", error)
  }
}

/**
 * Check if onboarding is completed locally
 */
export const isOnboardingDoneLocally = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(ONBOARDING_DONE_KEY)
    return completed === "true"
  } catch (error) {
    console.error("Error checking if onboarding is done locally:", error)
    return false
  }
}

/**
 * Convert form data to database format
 */
export const convertFormDataToDbFormat = (formData: OnboardingData): OnboardingDataRecord => {
  // Calculate age from birthdate
  let age = 25 // Default age if birthdate is invalid

  try {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
    }
  } catch (error) {
    console.error("Error calculating age:", error)
  }

  // Parse measurements string (format: "height,weight")
  let height = 170 // Default height in cm
  let weight = 70 // Default weight in kg

  try {
    if (formData.measurements) {
      const parts = formData.measurements.split(",")
      if (parts.length >= 2) {
        height = Number.parseFloat(parts[0]) || height
        weight = Number.parseFloat(parts[1]) || weight
      }
    }
  } catch (error) {
    console.error("Error parsing measurements:", error)
  }

  return {
    age,
    height,
    weight,
    experience: formData.experience || "beginner",
    goal: formData.goal || "general fitness",
    frequency: formData.frequency || "3 times per week",
    updated_at: new Date().toISOString(),
  }
}

/**
 * Save onboarding data to the database
 */
export const saveOnboardingDataToDb = async (userId: string, formData: OnboardingData): Promise<number | null> => {
  try {
    // Ensure we have a valid user ID
    if (!userId) {
      console.error("No user ID provided")
      return null
    }

    const dbData = convertFormDataToDbFormat(formData)
    console.log("Saving onboarding data:", dbData)

    // Insert the onboarding data
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("onboarding_data")
      .insert({
        ...dbData,
        created_at: new Date().toISOString(),
      })
      .select("onboarding_data_id")

    if (onboardingError) {
      console.error("Error saving onboarding data:", onboardingError)
      return null
    }

    if (!onboardingData || onboardingData.length === 0) {
      console.error("No onboarding data returned after insert")
      return null
    }

    const onboardingDataId = onboardingData[0].onboarding_data_id

    // Check if user_info exists without using .single()
    const { data: userInfoData, error: userInfoError } = await supabase.from("user_info").select("id").eq("id", userId)

    // Handle potential error
    if (userInfoError) {
      console.error("Error checking for existing user info:", userInfoError)
    }

    // If user_info exists, update it; otherwise, create a new one
    if (userInfoData && userInfoData.length > 0) {
      // Update existing user_info
      console.log("Updating existing user_info record")
      const { error: updateError } = await supabase
        .from("user_info")
        .update({
          onboarding_data_id: onboardingDataId,
          onboarding_done: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Error updating user info:", updateError)
      }
    } else {
      // Create new user_info
      console.log("Creating new user_info record")
      const { error: insertError } = await supabase.from("user_info").insert({
        id: userId,
        onboarding_data_id: onboardingDataId,
        onboarding_done: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error creating user info:", insertError)
      }
    }

    return onboardingDataId
  } catch (error) {
    console.error("Error in saveOnboardingDataToDb:", error)
    return null
  }
}

/**
 * Get onboarding data from the database
 */
export const getOnboardingDataFromDb = async (userId: string): Promise<OnboardingData | null> => {
  try {
    // First get the user_info to find the onboarding_data_id
    // Don't use .single() to avoid errors when no rows exist
    const { data: userInfoData, error: userInfoError } = await supabase
      .from("user_info")
      .select("onboarding_data_id")
      .eq("id", userId)

    if (userInfoError) {
      console.error("Error getting user info:", userInfoError)
      return null
    }

    // Check if we have data and it contains onboarding_data_id
    if (!userInfoData || userInfoData.length === 0 || !userInfoData[0].onboarding_data_id) {
      console.log("No onboarding data ID found for user")
      return null
    }

    const onboardingDataId = userInfoData[0].onboarding_data_id

    // Get the onboarding data
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("onboarding_data")
      .select("*")
      .eq("onboarding_data_id", onboardingDataId)
      .single()

    if (onboardingError) {
      console.error("Error getting onboarding data:", onboardingError)
      return null
    }

    if (!onboardingData) {
      console.log("No onboarding data found")
      return null
    }

    // Convert database record to form data format
    return {
      name: "", // Not stored in DB
      birthDate: "", // We only store age, not birthdate
      measurements: `${onboardingData.height},${onboardingData.weight}`,
      goal: onboardingData.goal,
      frequency: onboardingData.frequency,
      experience: onboardingData.experience,
      min: "0",
      max: "999",
      gender: "", // Not stored in DB
      loading: "",
    }
  } catch (error) {
    console.error("Error in getOnboardingDataFromDb:", error)
    return null
  }
}

/**
 * Check if onboarding is completed for a user
 */
export const isOnboardingDoneForUser = async (userId: string): Promise<boolean> => {
  try {
    // Direct query with explicit column selection
    const { data, error } = await supabase.from("user_info").select("onboarding_done").eq("id", userId).limit(1)

    // Check if we have data and explicitly cast the boolean value
    if (data && data.length > 0) {
      // Force boolean conversion with double negation
      return !!data[0].onboarding_done
    }

    return false
  } catch (error) {
    console.error("Error in isOnboardingDoneForUser:", error)
    return false
  }
}

/**
 * Transfer local onboarding data to the database after user signs in
 */
export const transferLocalOnboardingDataToDb = async (userId: string): Promise<boolean> => {
  try {
    // Check if we have local data
    const localData = await getLocalOnboardingData()
    if (!localData) {
      console.log("No local onboarding data to transfer")
      return false
    }

    // Save the local data to the database
    const result = await saveOnboardingDataToDb(userId, localData)

    if (result !== null) {
      // Clear the local data after successful transfer
      await AsyncStorage.removeItem(ONBOARDING_DATA_KEY)
      console.log("Local onboarding data transferred to database and cleared")
      return true
    }

    return false
  } catch (error) {
    console.error("Error transferring local onboarding data to database:", error)
    return false
  }
}