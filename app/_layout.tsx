import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider>
        <StatusBar />
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
    </PaperProvider>
  );
}
