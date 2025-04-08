"use client"

import { useEffect } from "react"
import { View, Text } from "react-native"
import { router } from "expo-router"
import CircularProgress from "@/components/onboarding/circular-progress"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth"
import { useOnboarding } from "@/context/onboarding-context"

const LoadingScreen = () => {
  const { session, setOnboardingDone } = useAuth()
  const { completeOnboarding } = useOnboarding()

  // Mark onboarding as complete and navigate to home
  useEffect(() => {
    async function completeOnboardingProcess() {
      if (!session) return

      await completeOnboarding()

      try {
        // Simple upsert operation - insert if not exists, update if exists
        const { error } = await supabase
          .from("user_info")
          .upsert({
            id: session.user.id,
            onboarding_done: true,
            updated_at: new Date().toISOString(),
          })
          .select()

        if (!error) {
          setOnboardingDone(true)
        }

        // Navigate to home after the loading animation completes
        const timer = setTimeout(() => {
          router.replace("/(tabs)/routine")
        }, 4000)

        return () => clearTimeout(timer)
      } catch (error) {
        // Still try to navigate to home even if there's an error
        const timer = setTimeout(() => {
          router.replace("/(tabs)/routine")
        }, 4000)

        return () => clearTimeout(timer)
      }
    }

    completeOnboardingProcess()
  }, [session, completeOnboarding, setOnboardingDone])

  return (
    <View className="flex-1 bg-black">
      <CircularProgress />
    </View>
  )
}

export default LoadingScreen