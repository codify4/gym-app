"use client"

import { useState, useRef, useEffect } from "react"
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  Animated, 
  Platform,
  Alert 
} from "react-native"
import { Camera, StopCircle, Play, RotateCcw } from "lucide-react-native"
import BotSheet from "@/components/bot-sheet"
import { router } from "expo-router"

interface Suggestion {
  id: string
  text: string
  delay: number
}

const CameraScreen = () => {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const bottomSheetRef = useRef<any>(null)
    const summarySheetRef = useRef<any>(null)

    // Animation values for suggestions
    const suggestionAnimations = useRef([
        new Animated.Value(-100),
        new Animated.Value(-100),
    ]).current

    const suggestions: Suggestion[] = [
        { id: "1", text: "Keep your elbows closer", delay: 0 },
        { id: "2", text: "Arch your back", delay: 200 },
    ]

    // Recording timer
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1)
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRecording])

    // Show suggestions animation
    useEffect(() => {
        if (showSuggestions) {
            const animations = suggestions.map((suggestion, index) =>
                Animated.timing(suggestionAnimations[index], {
                    toValue: 0,
                    duration: 600,
                    delay: suggestion.delay,
                    useNativeDriver: true,
                })
            )
            
            Animated.stagger(100, animations).start()
        } else {
            // Reset animations
            suggestionAnimations.forEach(anim => anim.setValue(-100))
        }
    }, [showSuggestions])

    const handleStartRecording = () => {
        setIsRecording(true)
        setRecordingTime(0)
        setShowSuggestions(true)
        // Simulate form correction suggestions
        setTimeout(() => {
            bottomSheetRef.current?.snapToIndex(0)
        }, 3000)
    }

    const handleStopRecording = () => {
        setIsRecording(false)
        setShowSuggestions(false)
        // Show summary
        setTimeout(() => {
            bottomSheetRef.current?.close()
            summarySheetRef.current?.snapToIndex(0)
        }, 500)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <SafeAreaView className={`flex-1 bg-black ${Platform.OS === "ios" ? "" : "pt-5"}`}>
            {/* Camera View */}
            <View className="flex-1 relative">
                {/* Header */}
                <View className="absolute top-6 left-0 right-0 z-10 px-6">
                    <Text className="text-white font-poppins-semibold text-lg text-center">
                        Form Corrector
                    </Text>
                </View>

                {/* Recording Time Widget */}
                {isRecording && (
                    <View className="absolute top-20 right-6 z-10">
                        <View className="bg-red-600 px-3 py-2 rounded-full flex-row items-center">
                            <View className="w-2 h-2 bg-white rounded-full mr-2" />
                            <Text className="text-white font-poppins-medium text-sm">
                                {formatTime(recordingTime)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Camera Preview Area */}
                <View className="flex-1 bg-neutral-900 mx-6 my-20 rounded-3xl border border-neutral-700 items-center justify-center">
                    <Camera size={80} color="#404040" />
                    <Text className="text-neutral-400 font-poppins-medium mt-4">
                        Camera Preview
                    </Text>
                </View>

                {/* Suggestion Pills */}
                {showSuggestions && (
                    <View className="absolute top-32 left-6 right-6 z-20">
                        {suggestions.map((suggestion, index) => (
                            <Animated.View
                                key={suggestion.id}
                                style={{
                                    transform: [{ translateY: suggestionAnimations[index] }],
                                    marginBottom: 8,
                                }}
                            >
                                <View 
                                    className="px-4 py-3 rounded-full self-start border border-white/20"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(20px)',
                                    }}
                                >
                                    <Text className="text-white font-poppins-medium text-sm">
                                        {suggestion.text}
                                    </Text>
                                </View>
                            </Animated.View>
                        ))}
                    </View>
                )}

                {/* Bottom Controls */}
                <View className="absolute bottom-10 left-0 right-0 px-6">
                    <View className="flex-row items-center justify-center gap-2">
                        {/* Record Button */}
                        <TouchableOpacity
                            onPress={isRecording ? handleStopRecording : handleStartRecording}
                            className={`w-20 h-20 rounded-full items-center justify-center ${
                                isRecording ? 'bg-red-600' : 'bg-white'
                            }`}
                        >
                            {isRecording ? (
                                <StopCircle size={32} color="white" />
                            ) : (
                                <Play size={32} color="black" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Summary Modal */}
            <BotSheet ref={summarySheetRef} snapPoints={["40%"]}>
                <View className="flex-1 w-full">
                    <Text className="text-white font-poppins-semibold text-xl text-center mb-6">
                        Summary
                    </Text>

                    <View className="bg-neutral-800 border border-neutral-700 rounded-3xl p-5 mb-6">
                        <View className="gap-4">
                            <View className="flex-row items-center justify-between pb-2 border-b border-neutral-700">
                                <Text className="text-neutral-400 font-poppins-medium text-sm uppercase tracking-wider">
                                    Exercise
                                </Text>
                                <Text className="text-white font-poppins-semibold text-lg">
                                    Bench Press
                                </Text>
                            </View>
                            
                            <View className="flex-row items-center justify-between pb-2 border-b border-neutral-700">
                                <Text className="text-neutral-400 font-poppins-medium text-sm uppercase tracking-wider">
                                    Reps
                                </Text>
                                <View className="bg-neutral-700 px-4 py-1 rounded-full">
                                    <Text className="text-white font-poppins-bold text-lg">
                                        10
                                    </Text>
                                </View>
                            </View>
                            
                            <View className="flex-row items-center justify-between">
                                <Text className="text-neutral-400 font-poppins-medium text-sm uppercase tracking-wider">
                                    AI Score
                                </Text>
                                <View className="flex-row items-center gap-3">
                                    <View className="bg-white px-4 py-1 rounded-full">
                                        <Text className="text-black font-poppins-bold text-lg">
                                            8/10
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row gap-2">
                        <TouchableOpacity 
                            className="flex-1 bg-neutral-700 py-5 rounded-full"
                            onPress={() => {
                                summarySheetRef.current?.close()
                                router.push("/(tabs)/chatbot")
                            }}
                        >
                            <Text className="text-white font-poppins-medium text-center">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            className="flex-1 bg-white py-5 rounded-full"
                            onPress={() => {
                                summarySheetRef.current?.close()
                                Alert.alert("Success", "Summary saved!")
                                router.push("/(tabs)/chatbot")
                            }}
                        >
                            <Text className="text-black font-poppins-semibold text-center">
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BotSheet>
        </SafeAreaView>
    )
}

export default CameraScreen 