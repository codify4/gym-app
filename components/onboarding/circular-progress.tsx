import React, { useEffect, useRef, useCallback, useState } from "react";
import { View, Text } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  interpolate, 
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from 'expo-haptics';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = () => {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const lastPercentage = useRef(0);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const checkAndTriggerHaptic = useCallback((currentValue: number) => {
    const currentPercentage = Math.floor(currentValue);
    if (currentPercentage !== lastPercentage.current) {
      lastPercentage.current = currentPercentage;
      triggerHaptic();
      runOnJS(setDisplayedPercentage)(currentPercentage);
    }
  }, [triggerHaptic]);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    progress.value = withTiming(100, { 
      duration: 3000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(triggerHaptic)();
      }
    });
  }, []);

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
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center">
      <View className="items-center">
        <View className="relative">
          <Svg width={300} height={300} viewBox="0 0 100 100">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#fff" stopOpacity="1" />
                <Stop offset="1" stopColor="#fff" stopOpacity="1" />
              </LinearGradient>
            </Defs>
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
              stroke="url(#grad)"
              strokeWidth="10"
              fill="none"
              strokeDasharray="251"
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
            <Animated.Text 
              className="text-white text-5xl font-bold"
              style={contentStyle}
            >
              {displayedPercentage}%
            </Animated.Text>
          </View>
        </View>
        <Animated.View style={contentStyle} className="items-center mt-6">
          <Text className="text-white text-2xl font-poppins-semibold mb-2">
            {displayedPercentage === 100 ? "Done!" : "Calculating..."}
          </Text>
          <Text className="text-gray-400 text-lg font-poppins">
            Building a custom plan just for you
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default CircularProgress;