"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  isOnboardingDone: boolean
  setOnboardingDone: (done: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  signOut: async () => {},
  isOnboardingDone: false,
  setOnboardingDone: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnboardingDone, setIsOnboardingDone] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)

      if (session?.user?.id) {
        // Check if onboarding is done for this user
        checkOnboardingStatus(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session) {
        checkOnboardingStatus(session.user.id)
      } else {
        setIsOnboardingDone(false)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Check if onboarding is done for a user - SIMPLIFIED VERSION
  const checkOnboardingStatus = async (userId: string) => {
    try {
      // Super simple direct query
      const { data } = await supabase.rpc("get_onboarding_status", { user_id_param: userId })

      // Set the state based on the result
      setIsOnboardingDone(data === true)
    } catch (error) {
      // If there's an error, default to false
      setIsOnboardingDone(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setIsOnboardingDone(false)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        signOut,
        isOnboardingDone,
        setOnboardingDone: setIsOnboardingDone,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
