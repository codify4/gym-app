import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '@/context/auth';
import "../global.css";
import { setBackgroundColorAsync } from "expo-navigation-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const isOnboarding = segments[0] === 'onboarding';
    const isSignin = segments[0] === 'signin';

    if (session && !inAuthGroup) {
      // Signed in, redirect to home
      router.replace('/(tabs)/home');
    } else if (!session && !isOnboarding && !isSignin) {
      // Not signed in and not on welcome/onboarding/signin, redirect to welcome
      router.replace('/');
    }
  }, [session, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name='signin' />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'poppins': require('@/assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'poppins-medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'poppins-semibold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-light': require('@/assets/fonts/Poppins-Light.ttf'),
    'poppins-black': require('@/assets/fonts/Poppins-Black.ttf'),
    'poppins-extrabold': require('@/assets/fonts/Poppins-ExtraBold.ttf'),
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
    <AuthProvider>
      <PaperProvider>
        <StatusBar style='light'/>
        <RootLayoutNav />
      </PaperProvider>
    </AuthProvider>
  );
}
