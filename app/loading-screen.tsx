"use client"

import { useEffect } from "react"
import { View } from "react-native"
import { router } from "expo-router"
import CircularProgress from "@/components/onboarding/circular-progress"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth"
import { useOnboarding } from "@/context/onboarding-context"
import { markOnboardingDoneLocally } from "@/lib/onboarding"

const LoadingScreen = () => {
  const { session } = useAuth()
  const { completeOnboarding } = useOnboarding()

  // Mark onboarding as complete and navigate to home
  useEffect(() => {
    async function completeOnboardingProcess() {
      try {
        // Mark onboarding as complete in context
        await completeOnboarding()

        if (session?.user?.id) {
          // For logged in users, update the database
          await supabase.from("user_info").upsert({
            user_id: session.user.id,
            onboarding_done: true,
            updated_at: new Date().toISOString(),
          })
        } else {
          // For anonymous users, mark as completed locally
          await markOnboardingDoneLocally()
        }

        // Navigate to home after the loading animation completes
        const timer = setTimeout(() => {
          router.replace("/(tabs)/routine")
        }, 4000) // Slightly longer than the animation duration

        return () => clearTimeout(timer)
      } catch (error) {
        console.error("Error completing onboarding:", error)
        // Still try to navigate to home even if there's an error
        const timer = setTimeout(() => {
          router.replace("/(tabs)/routine")
        }, 4000)

        return () => clearTimeout(timer)
      }
    }

    completeOnboardingProcess()
  }, [session, completeOnboarding])

  return (
    <View className="flex-1 bg-black">
      <CircularProgress />
    </View>
  )
}

export default LoadingScreen