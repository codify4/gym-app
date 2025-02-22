import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  interpolate, 
  useAnimatedStyle,
  Easing
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { routines } from "@/constants/data";
import RoutineCard from "../routine/routine-card";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = () => {
  const progress = useSharedValue(0);
  const showContent = useSharedValue(0);

  useEffect(() => {
    // Start the progress animation
    progress.value = withTiming(100, { 
      duration: 3000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, () => {
      // Fade in the content when progress completes
      showContent.value = withTiming(1, { 
        duration: 500,
        easing: Easing.out(Easing.ease)
      });
    });
  }, [progress, showContent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(
      progress.value,
      [0, 100],
      [251, 0]
    ),
  }));

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
    <View className="flex-1 bg-black">
      <View className="flex-1 items-center pt-12">
        {/* Progress Circle Section */}
        <View className="items-center mb-8">
          <Svg width={200} height={200} viewBox="0 0 100 100">
            {/* Background Circle */}
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke="#2E2E2E"
              strokeWidth="10"
              fill="none"
            />
            {/* Animated Progress Circle */}
            <AnimatedCircle
              cx="50"
              cy="50"
              r="40"
              stroke="#FF3737"
              strokeWidth="10"
              fill="none"
              strokeDasharray="251"
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </Svg>
          <View className="absolute top-[85px]">
            <Text className="text-white text-3xl font-bold">
              {Math.round(progress.value)}{'%'}
            </Text>
          </View>
          <View className="mt-4">
            {progress.value === 100 ? (
              <Text className="text-white text-xl font-poppins-bold">Done!</Text>
            ) : (
              <Text className="text-white text-xl font-poppins-bold">Building a custom plan just for you...</Text>
            )}
          </View>
        </View>

        {/* Animated Content Section */}
        {progress.value === 100 && (
          <Animated.View className="items-center w-full px-4" style={contentStyle}>
            <BlurView intensity={20} className="w-full rounded-xl overflow-hidden">
              <ScrollView className="flex-col gap-3 p-4 h-[140px]" showsVerticalScrollIndicator={false}>
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