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
  const birthDate = new Date(formData.birthDate)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  // Parse measurements string (format: "height,weight")
  const [height, weight] = formData.measurements.split(",")

  return {
    age,
    height: Number.parseFloat(height) || 0,
    weight: Number.parseFloat(weight) || 0,
    experience: formData.experience,
    goal: formData.goal,
    frequency: formData.frequency,
    updated_at: new Date().toISOString(),
  }
}

/**
 * Save onboarding data to the database
 */
export const saveOnboardingDataToDb = async (userId: string, formData: OnboardingData): Promise<number | null> => {
  try {
    const dbData = convertFormDataToDbFormat(formData)

    // Insert the onboarding data
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("onboarding_data")
      .insert({
        ...dbData,
        created_at: new Date().toISOString(),
      })
      .select("onboarding_data_id")
      .single()

    if (onboardingError) {
      console.error("Error saving onboarding data:", onboardingError)
      return null
    }

    if (!onboardingData) {
      console.error("No onboarding data returned after insert")
      return null
    }

    const onboardingDataId = onboardingData.onboarding_data_id

    // Update or create user_info record
    const { data: existingUserInfo, error: userInfoError } = await supabase
      .from("user_info")
      .select("user_info_id")
      .eq("user_id", userId)
      .single()

    if (userInfoError && !userInfoError.message.includes("no rows")) {
      console.error("Error checking for existing user info:", userInfoError)
    }

    if (existingUserInfo) {
      // Update existing user_info
      const { error: updateError } = await supabase
        .from("user_info")
        .update({
          onboarding_data_id: onboardingDataId,
          onboarding_done: true,
        })
        .eq("user_id", userId)

      if (updateError) {
        console.error("Error updating user info:", updateError)
      }
    } else {
      // Create new user_info
      const { error: insertError } = await supabase.from("user_info").insert({
        user_id: userId,
        onboarding_data_id: onboardingDataId,
        onboarding_done: true,
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
    const { data: userInfo, error: userInfoError } = await supabase
      .from("user_info")
      .select("onboarding_data_id")
      .eq("user_id", userId)
      .single()

    if (userInfoError) {
      console.error("Error getting user info:", userInfoError)
      return null
    }

    if (!userInfo || !userInfo.onboarding_data_id) {
      console.log("No onboarding data ID found for user")
      return null
    }

    // Get the onboarding data
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("onboarding_data")
      .select("*")
      .eq("onboarding_data_id", userInfo.onboarding_data_id)
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
    // This is a simplified conversion - you may need to adjust based on your needs
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
 * Update onboarding data in the database
 */
export const updateOnboardingDataInDb = async (userId: string, formData: OnboardingData): Promise<boolean> => {
  try {
    // First get the user_info to find the onboarding_data_id
    const { data: userInfo, error: userInfoError } = await supabase
      .from("user_info")
      .select("onboarding_data_id")
      .eq("user_id", userId)
      .single()

    if (userInfoError) {
      console.error("Error getting user info:", userInfoError)
      return false
    }

    if (!userInfo || !userInfo.onboarding_data_id) {
      console.log("No onboarding data ID found for user, creating new record")
      // If no existing record, create a new one
      const result = await saveOnboardingDataToDb(userId, formData)
      return result !== null
    }

    // Update the existing onboarding data
    const dbData = convertFormDataToDbFormat(formData)

    const { error: updateError } = await supabase
      .from("onboarding_data")
      .update(dbData)
      .eq("onboarding_data_id", userInfo.onboarding_data_id)

    if (updateError) {
      console.error("Error updating onboarding data:", updateError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateOnboardingDataInDb:", error)
    return false
  }
}

/**
 * Check if onboarding is completed for a user
 */
export const isOnboardingDoneForUser = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from("user_info").select("onboarding_done").eq("user_id", userId).single()

    if (error) {
      console.error("Error checking if onboarding is done:", error)
      return false
    }

    return data?.onboarding_done || false
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