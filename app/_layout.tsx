import { useFonts } from 'expo-font';
import { router, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import React from 'react';
import { AuthProvider, useAuth } from '@/context/auth';
import "../global.css";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OnboardingProvider, useOnboarding } from '@/context/onboarding-context';
import { UnitsProvider } from '@/context/units-context';
import "@/polyfills"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading, isOnboardingDone } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    console.log("Auth state:", { 
      session: !!session, 
      isOnboardingDone, 
      currentRoute: segments[0] || 'root',
      isLoading
    });
    
    // Get current route
    const currentRoute = segments[0] || '';
    
    if (!session) {
      // Not authenticated
      // Allow access to landing page and sign-in
      // No automatic redirects for unauthenticated users
      // They can freely navigate between / and /sign-in
      return;
    } else {
      // User is authenticated
      if (isOnboardingDone) {
        // User has completed onboarding - send to home
        const inAuthGroup = segments[0] === '(tabs)';
        const isLoadingScreen = segments[0] === 'loading-screen';
        
        if (!inAuthGroup && !isLoadingScreen) {
          router.replace('/(tabs)/routine');
        }
      } else {
        const isOnboarding = segments[0] === 'onboarding';
        const isLoadingScreen = segments[0] === 'loading-screen';
        
        if (!isOnboarding && !isLoadingScreen) {
          router.replace('/onboarding');
        }
      }
    }
  }, [session, isLoading, isOnboardingDone, segments]);


  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name='signin' options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="loading-screen" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_right' }}/>
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins-Light.ttf'),
    'Poppins-Black': require('@/assets/fonts/Poppins-Black.ttf'),
    'Poppins-ExtraBold': require('@/assets/fonts/Poppins-ExtraBold.ttf'),
  });

  useEffect(()=>{
    setBackgroundColorAsync("#121212");
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <OnboardingProvider>
          <UnitsProvider>
            <StatusBar style='light'/>
            <RootLayoutNav />
          </UnitsProvider>
        </OnboardingProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
