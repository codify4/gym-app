"use client"

import { useState, useRef, useEffect } from "react"

import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  Animated, 
  Platform
} from "react-native"
import { Camera, StopCircle, Play } from "lucide-react-native"
import BotSheet from "@/components/bot-sheet"
import Summary from "@/components/camera/summary"
import Suggestions from "@/components/camera/suggestions"

import { suggestions } from "@/constants/suggestions"

const CameraScreen = () => {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const bottomSheetRef = useRef<any>(null)
    const summarySheetRef = useRef<any>(null)

    const suggestionAnimations = useRef([
        new Animated.Value(-100),
        new Animated.Value(-100),
    ]).current

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
            <View className="flex-1 relative">
                <View className="absolute top-6 left-0 right-0 z-10 px-6">
                    <Text className="text-white font-poppins-semibold text-lg text-center">
                        Form Corrector
                    </Text>
                </View>

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

                <View className="flex-1 bg-neutral-900 mx-6 my-20 rounded-3xl border border-neutral-700 items-center justify-center">
                    <Camera size={80} color="#404040" />
                    <Text className="text-neutral-400 font-poppins-medium mt-4">
                        Camera Preview
                    </Text>
                </View>

                {showSuggestions && (
                    <Suggestions suggestionAnimations={suggestionAnimations} suggestions={suggestions} />
                )}

                <View className="absolute bottom-10 left-0 right-0 px-6">
                    <View className="flex-row items-center justify-center gap-2">
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

            <BotSheet ref={summarySheetRef} snapPoints={["40%"]}>
                <Summary summarySheetRef={summarySheetRef} />
            </BotSheet>
        </SafeAreaView>
    )
}

export default CameraScreen 