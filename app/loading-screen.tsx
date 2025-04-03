// app/loading-screen.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import CircularProgress from "@/components/onboarding/circular-progress";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth";

const LoadingScreen = () => {
  const { session, setOnboardingDone } = useAuth();

  // Mark onboarding as complete and navigate to home
  useEffect(() => {
    async function completeOnboarding() {
      if (!session) return;
      
      try {
        // Check if user already has a profile
        const { data: existingProfile, error } = await supabase
          .from('user_info')
          .select('user_info_id')
          .eq('user_id', session.user.id)
          .single();
        
        // If we get a "no rows" error or no profile exists, create a new one
        if (error && (error.code === 'PGRST116' || error.message.includes('no rows')) || !existingProfile) {
          // Create new profile
          await supabase
            .from('user_info')
            .insert({ 
              id: session.user.id,
              onboarding_completed: true,
              created_at: new Date(),
              updated_at: new Date()
            });
        } else {
          // Update existing profile
          await supabase
            .from('user_info')
            .update({ 
              onboarding_completed: true,
              updated_at: new Date()
            })
            .eq('user_id', session.user.id);
        }
        
        // Update local state
        setOnboardingDone(true);
        
        // Navigate to home after the loading animation completes
        const timer = setTimeout(() => {
          router.replace("/(tabs)/routine");
        }, 4000); // Slightly longer than the animation duration
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error completing onboarding:', error);
        // Still try to navigate to home even if there's an error
        const timer = setTimeout(() => {
          router.replace("/(tabs)/routine");
        }, 4000);
        
        return () => clearTimeout(timer);
      }
    }
    
    completeOnboarding();
  }, [session]);

  return (
    <View className="flex-1 bg-black">
      <CircularProgress />
    </View>
  );
};

export default LoadingScreen;