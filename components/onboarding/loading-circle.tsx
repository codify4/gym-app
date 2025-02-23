import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  interpolate, 
  useAnimatedStyle,
  Easing,
  runOnJS,
  useDerivedValue
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { routines } from "@/constants/data";
import RoutineCard from "../routine/routine-card";
import * as Haptics from 'expo-haptics';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

const CircularProgress = () => {
  const progress = useSharedValue(0);
  const showContent = useSharedValue(0);
  const lastPercentage = useRef(0);

  const displayedPercentage = useDerivedValue(() => {
    return Math.round(progress.value);
  });

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const checkAndTriggerHaptic = useCallback((currentValue: number) => {
    const currentPercentage = Math.floor(currentValue);
    if (currentPercentage !== lastPercentage.current) {
      lastPercentage.current = currentPercentage;
      triggerHaptic();
    }
  }, [triggerHaptic]);

  useEffect(() => {
    progress.value = withTiming(100, { 
      duration: 3000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, (finished) => {
      if (finished) {
        showContent.value = withTiming(1, { 
          duration: 500,
          easing: Easing.out(Easing.ease)
        });
        runOnJS(triggerHaptic)();
      }
    });
  }, [progress, showContent, triggerHaptic]);

  const animatedProps = useAnimatedProps(() => {
    runOnJS(checkAndTriggerHaptic)(progress.value);
    return {
      strokeDashoffset: interpolate(
        progress.value,
        [0, 100],
        [251, 0]
      ),
    };
  });

  const contentStyle = useAnimatedStyle(() => ({
    opacity: showContent.value,
    transform: [{ 
      translateY: interpolate(
        showContent.value,
        [0, 1],
        [20, 0]
      )
    }]
  }));

  return (
    <View className="flex-1 bg-black -mt-32">
      <View className="flex-1 items-center">
        {/* Progress Circle Section */}
        <View className="items-center">
          <View className="relative">
            <Svg width={300} height={300} viewBox="0 0 100 100"> 
              <Circle
                cx="50"
                cy="50"
                r="40"
                stroke="#2E2E2E"
                strokeWidth="10"
                fill="none"
              />
              <AnimatedCircle
                cx="50"
                cy="50"
                r="40"
                stroke="#bd0000"
                strokeWidth="10"
                fill="none"
                strokeDasharray="251"
                animatedProps={animatedProps}
                strokeLinecap="round"
              />
            </Svg>
            <View className="absolute inset-0 items-center justify-center">
              <AnimatedText 
                className="text-white text-5xl font-bold"
              >
                {displayedPercentage.value}%
              </AnimatedText>
            </View>
          </View>
          <View>
            <AnimatedText 
              className="text-white text-2xl font-poppins-bold"
            >
              {displayedPercentage.value === 100 ? "Done!" : "Building a custom plan just for you..."}
            </AnimatedText>
          </View>
        </View>

        {/* Animated Content Section */}
        {displayedPercentage.value === 100 && (
          <Animated.View className="items-center w-full px-4" style={contentStyle}>
            <BlurView intensity={20} className="w-full rounded-xl overflow-hidden">
              <ScrollView className="flex-col gap-3 p-4 h-[230px]" showsVerticalScrollIndicator={false}>
                {routines.slice(0, 2).map((routine, index) => (
                  <View key={index} className="flex-1">
                    <RoutineCard routine={routine} pressable={false} />
                  </View>
                ))}
              </ScrollView>
            </BlurView>

            <TouchableOpacity 
              className="mt-6 bg-white px-16 py-4 rounded-full"
              onPress={() => router.push("/signin")}
            >
              <Text className="text-black text-xl font-poppins-semibold">
                Start Workout
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default CircularProgress;