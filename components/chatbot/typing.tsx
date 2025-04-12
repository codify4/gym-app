import { useEffect, useRef } from "react"
import { Animated } from "react-native"
import { View } from "react-native"

// Typing indicator component with animated circles
const TypingIndicator = () => {
    // Create animated values for each dot
    const animations = [
        useRef(new Animated.Value(0.5)).current,
        useRef(new Animated.Value(0.5)).current,
        useRef(new Animated.Value(0.5)).current,
    ]
  
    useEffect(() => {
        // Function to animate a single dot
        const animateDot = (dot: Animated.Value, delay: number) => {
            Animated.sequence([
                // Scale up
                Animated.timing(dot, {
                    toValue: 1,
                    duration: 400,
                    delay,
                    useNativeDriver: true,
                }),
                // Scale down
                Animated.timing(dot, {
                    toValue: 0.5,
                    duration: 400,
                    useNativeDriver: true,
                }),
                ]).start(() => {
                // Restart the animation
                animateDot(dot, delay)
            })
        }
    
        // Start animations with different delays to create a wave effect
        animateDot(animations[0], 0)
        animateDot(animations[1], 200)
        animateDot(animations[2], 400)
    
        // Clean up animations on unmount
        return () => {
            animations.forEach((anim) => anim.stopAnimation())
        }
    }, [])
  
    return (
        <View className="px-4 py-3 rounded-2xl my-1 max-w-[85%] bg-neutral-800 self-start ml-2">
            <View className="flex-row items-center justify-center h-6 w-16">
                {animations.map((anim, index) => (
                    <Animated.View
                        key={index}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "white",
                            marginHorizontal: 3,
                            transform: [{ scale: anim }],
                        }}
                    />
                ))}
            </View>
        </View>
    )
}

export default TypingIndicator
