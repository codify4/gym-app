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
      }

      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session) {
        checkOnboardingStatus(session.user.id)
      }
      else {
        setIsOnboardingDone(false)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Check if onboarding is done for a user
  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_info')
        .select('onboarding_done')
        .eq('id', userId)
        .single();
      
      console.log("Profile data:", data);
      console.log("Error:", error);
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('no rows')) {
          console.log("No profile found, setting onboardingDone to false");
          setIsOnboardingDone(false);
        } else {
          console.error('Error checking onboarding status:', error);
        }
      } else {
        console.log("Profile found, onboarding_done:", data?.onboarding_done);
        setIsOnboardingDone(data?.onboarding_done === true);
      }
    } catch (error) {
      console.error('Unexpected error checking onboarding:', error);
    } finally {
      setIsLoading(false);
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