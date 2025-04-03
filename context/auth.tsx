import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  onboardingDone: boolean;
  signOut: () => Promise<void>;
  setOnboardingDone: (completed: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({ session: null, loading: true, onboardingDone: false, signOut: async () => {}, setOnboardingDone: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);


  useEffect(() => {

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      } else {
        setOnboardingDone(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkOnboardingStatus(userId: string) {
    try {
      console.log("Checking onboarding status for user:", userId);
      
      const { data, error } = await supabase
        .from('user_info')
        .select('onboarding_done')
        .eq('user_id', userId)
        .single();
      
      console.log("Profile data:", data);
      console.log("Error:", error);
      
      if (error) {
        // Handle the case where no profile exists (PGRST116 error)
        if (error.code === 'PGRST116' || error.message.includes('no rows')) {
          // No profile found, user hasn't completed onboarding
          console.log("No profile found, setting onboardingDone to false");
          setOnboardingDone(false);
        } else {
          // Some other error occurred
          console.error('Error checking onboarding status:', error);
        }
      } else {
        // Profile found, check if onboarding is completed
        console.log("Profile found, onboarding_done:", data?.onboarding_done);
        setOnboardingDone(data?.onboarding_done === true);
      }
    } catch (error) {
      console.error('Unexpected error checking onboarding:', error);
    } finally {
      setLoading(false);
    }
  }

  
  async function signOut() {
    await supabase.auth.signOut();
  }

  const value = {
    session,
    loading,
    onboardingDone,
    signOut,
    setOnboardingDone,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
