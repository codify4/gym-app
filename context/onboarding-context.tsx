"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth"
import type { OnboardingData } from "@/constants/slides"
import {
  getLocalOnboardingData,
  getOnboardingDataFromDb,
  isOnboardingDoneForUser,
  isOnboardingDoneLocally,
  saveOnboardingDataLocally,
  transferLocalOnboardingDataToDb,
  updateOnboardingDataInDb,
} from "@/lib/onboarding"

interface OnboardingContextType {
  onboardingData: OnboardingData | null
  isOnboardingDone: boolean
  saveOnboardingData: (data: OnboardingData) => Promise<boolean>
  completeOnboarding: () => Promise<void>
  loadOnboardingData: () => Promise<void>
  transferLocalData: () => Promise<boolean>
}

const defaultOnboardingData: OnboardingData = {
  name: "",
  birthDate: "",
  measurements: "",
  goal: "",
  frequency: "",
  experience: "",
  min: "0",
  max: "999",
  gender: "",
  loading: "",
}

const OnboardingContext = createContext<OnboardingContextType>({
  onboardingData: defaultOnboardingData,
  isOnboardingDone: false,
  saveOnboardingData: async () => false,
  completeOnboarding: async () => {},
  loadOnboardingData: async () => {},
  transferLocalData: async () => false,
})

export const useOnboarding = () => useContext(OnboardingContext)

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth()
  const userId = session?.user?.id

  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [isOnboardingDone, setIsOnboardingDone] = useState(false)

  // Load onboarding status and data on mount or when auth state changes
  useEffect(() => {
    loadOnboardingStatus()
    loadOnboardingData()
  }, [userId])

  // Check if onboarding is completed
  const loadOnboardingStatus = async () => {
    try {
      if (userId) {
        // For logged in users, check the database
        const completed = await isOnboardingDoneForUser(userId)
        setIsOnboardingDone(completed)
      } else {
        // For anonymous users, check local storage
        const completed = await isOnboardingDoneLocally()
        setIsOnboardingDone(completed)
      }
    } catch (error) {
      console.error("Error loading onboarding status:", error)
    }
  }

  // Load onboarding data
  const loadOnboardingData = async () => {
    try {
      if (userId) {
        // For logged in users, get data from the database
        const data = await getOnboardingDataFromDb(userId)
        if (data) {
          setOnboardingData(data)
        }
      } else {
        // For anonymous users, get data from local storage
        const data = await getLocalOnboardingData()
        if (data) {
          setOnboardingData(data)
        }
      }
    } catch (error) {
      console.error("Error loading onboarding data:", error)
    }
  }

  // Save onboarding data
  const saveOnboardingData = async (data: OnboardingData): Promise<boolean> => {
    try {
      if (userId) {
        // For logged in users, save to the database
        const success = await updateOnboardingDataInDb(userId, data)
        if (success) {
          setOnboardingData(data)
        }
        return success
      } else {
        // For anonymous users, save to local storage
        await saveOnboardingDataLocally(data)
        setOnboardingData(data)
        return true
      }
    } catch (error) {
      console.error("Error saving onboarding data:", error)
      return false
    }
  }

  // Mark onboarding as completed
  const completeOnboarding = async () => {
    try {
      setIsOnboardingDone(true)
      // This will be handled by the loading screen component
      // which will update the database or local storage
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  // Transfer local data to database after sign in
  const transferLocalData = async (): Promise<boolean> => {
    if (!userId) return false

    try {
      const success = await transferLocalOnboardingDataToDb(userId)
      if (success) {
        // Reload the data from the database
        await loadOnboardingData()
      }
      return success
    } catch (error) {
      console.error("Error transferring local data:", error)
      return false
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        isOnboardingDone,
        saveOnboardingData,
        completeOnboarding,
        loadOnboardingData,
        transferLocalData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}