"use client"

import { useState, useRef, useEffect } from "react"
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  Animated, 
  Platform,
  Dimensions
} from "react-native"
import { Camera, StopCircle, Play } from "lucide-react-native"
import WebView from 'react-native-webview'
import { useCameraPermissions } from 'expo-camera'
import BotSheet from "@/components/bot-sheet"
import Summary from "@/components/camera/summary"
import Suggestions from "@/components/camera/suggestions"

import { POSETRACKER_CONFIG } from "@/constants/posetracker-config"

const { width, height } = Dimensions.get('window')

interface PoseTrackerInfo {
  type: string
  ready?: boolean
  postureDirection?: string
  current_count?: number
}

interface WorkoutSummary {
  exercise: string
  reps: number
  duration: number
  formScore: number
  suggestions: string[]
  formAnalysis: {
    goodForm: number
    totalReps: number
  }
}

interface PoseTrackerSuggestion {
  id: string
  text: string
  delay: number
}

const CameraScreen = () => {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [poseTrackerInfos, setPoseTrackerInfos] = useState<PoseTrackerInfo | null>(null)
    const [repsCounter, setRepsCounter] = useState(0)
    const [suggestions, setSuggestions] = useState<PoseTrackerSuggestion[]>([])
    const [permission, requestPermission] = useCameraPermissions()
    const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummary>({
        exercise: POSETRACKER_CONFIG.EXERCISE,
        reps: 0,
        duration: 0,
        formScore: 0,
        suggestions: [],
        formAnalysis: {
            goodForm: 0,
            totalReps: 0
        }
    })
    const [formFeedback, setFormFeedback] = useState<string[]>([]) // Track form issues during workout
    
    const bottomSheetRef = useRef<any>(null)
    const summarySheetRef = useRef<any>(null)

    const suggestionAnimations = useRef([
        new Animated.Value(-100),
        new Animated.Value(-100),
    ]).current

    // Request camera permissions on mount
    useEffect(() => {
        if (!permission?.granted) {
            requestPermission()
        }
    }, [])

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
        if (showSuggestions && suggestions.length > 0) {
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
    }, [showSuggestions, suggestions])

    // PoseTracker configuration
    const exercise = POSETRACKER_CONFIG.EXERCISE
    const difficulty = POSETRACKER_CONFIG.DIFFICULTY
    const skeleton = POSETRACKER_CONFIG.SHOW_SKELETON

    const posetracker_url = `${POSETRACKER_CONFIG.API_URL}?token=${POSETRACKER_CONFIG.API_KEY}&exercise=${exercise}&difficulty=${difficulty}&width=${width}&height=${height}&isMobile=${true}&skeleton=${skeleton}`

    // JavaScript bridge for communication between PoseTracker and React Native
    const jsBridge = `
        window.addEventListener('message', function(event) {
            window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
        });

        window.webViewCallback = function(data) {
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
        };

        const originalPostMessage = window.postMessage;
        window.postMessage = function(data) {
            window.ReactNativeWebView.postMessage(typeof data === 'string' ? data : JSON.stringify(data));
        };

        true; // Important for correct injection
    `

    const handleCounter = (count: number) => {
        setRepsCounter(count)
        console.log('📊 Rep count updated:', count)
        
        // Update workout summary with latest rep count
        setWorkoutSummary(prev => {
            const updated = {
                ...prev,
                reps: count,
                formAnalysis: {
                    ...prev.formAnalysis,
                    totalReps: count
                }
            }
            console.log('📊 Workout summary updated:', updated)
            return updated
        })
    }

    const handleInfos = (infos: PoseTrackerInfo) => {
        setPoseTrackerInfos(infos)
        
        // Debug: log all received data
        console.log('🔍 Full PoseTracker data:', JSON.stringify(infos, null, 2))
        
        // Generate suggestions based on PoseTracker feedback
        const newSuggestions: PoseTrackerSuggestion[] = []
        
        if (infos.ready === false && infos.postureDirection) {
            newSuggestions.push({
                id: "placement",
                text: `Move ${infos.postureDirection}`,
                delay: 0
            })
        } else if (infos.ready === true && infos.type === "placement") {
            newSuggestions.push({
                id: "ready",
                text: "Perfect! You can start exercising 🏋️",
                delay: 0
            })
        }
        
        // More flexible tracking logic - count as good form if recording and no major issues
        if (isRecording) {
            // Always show some form of suggestion during recording
            if (infos.postureDirection) {
                // Form needs correction
                const formIssue = `Posture: ${infos.postureDirection}`
                setFormFeedback(prev => [...prev, formIssue])
                
                newSuggestions.push({
                    id: "posture",
                    text: `Adjust: ${infos.postureDirection}`,
                    delay: 0
                })
            } else if (infos.ready !== false) {
                // Good form - no corrections needed
                newSuggestions.push({
                    id: "goodForm",
                    text: "Great form! 💪",
                    delay: 0
                })
                
                // Count as good form
                setWorkoutSummary(prev => ({
                    ...prev,
                    formAnalysis: {
                        ...prev.formAnalysis,
                        goodForm: prev.formAnalysis.goodForm + 1
                    }
                }))
            }
            
            // Add general exercise tips
            if (newSuggestions.length === 0) {
                newSuggestions.push({
                    id: "general",
                    text: "Keep your core engaged",
                    delay: 0
                })
            }
        }
        
        setSuggestions(newSuggestions)
        console.log('Generated suggestions:', newSuggestions)
    }

    const webViewCallback = (info: any) => {
        if (info?.type === 'counter') {
            handleCounter(info.current_count)
        } else {
            handleInfos(info)
        }
    }

    const onMessage = (event: any) => {
        try {
            let parsedData
            if (typeof event.nativeEvent.data === 'string') {
                parsedData = JSON.parse(event.nativeEvent.data)
            } else {
                parsedData = event.nativeEvent.data
            }

            console.log('Parsed PoseTracker data:', parsedData)
            webViewCallback(parsedData)
        } catch (error) {
            console.error('Error processing PoseTracker message:', error)
            console.log('Problematic data:', event.nativeEvent.data)
        }
    }

    const handleStartRecording = () => {
        setIsRecording(true)
        setRecordingTime(0)
        setShowSuggestions(true)
        setRepsCounter(0)
        setFormFeedback([])
        
        // Reset workout summary for new session
        setWorkoutSummary({
            exercise: POSETRACKER_CONFIG.EXERCISE,
            reps: 0,
            duration: 0,
            formScore: 0,
            suggestions: [],
            formAnalysis: {
                goodForm: 0,
                totalReps: 0
            }
        })
        
        // Show form correction suggestions after a delay
        setTimeout(() => {
            if (suggestions.length > 0) {
                bottomSheetRef.current?.snapToIndex(0)
            }
        }, 3000)
    }

    const handleStopRecording = () => {
        setIsRecording(false)
        setShowSuggestions(false)
        setSuggestions([])
        
        // Calculate final workout summary
        const finalDuration = recordingTime
        const totalReps = repsCounter // Use current rep counter
        const goodFormReps = workoutSummary.formAnalysis.goodForm
        
        // If we don't have good form data, estimate based on performance
        let formPercentage = 0
        if (totalReps > 0) {
            if (goodFormReps > 0) {
                formPercentage = (goodFormReps / totalReps) * 100
            } else {
                // Default scoring based on completion
                formPercentage = Math.max(60, 80 - (formFeedback.length * 10)) // Start at 80%, reduce for issues
            }
        }
        
        // Calculate AI score (out of 10)
        const aiScore = Math.min(10, Math.max(1, Math.round((formPercentage / 100) * 10)))
        
        console.log('📊 Final calculation:', {
            totalReps,
            goodFormReps,
            formPercentage,
            aiScore,
            formFeedbackCount: formFeedback.length
        })
        
        // Generate end-of-workout suggestions
        const endSuggestions: string[] = []
        
        // Always add at least some basic suggestions
        if (totalReps === 0) {
            endSuggestions.push("Try to complete at least a few reps next time")
            endSuggestions.push("Make sure you're positioned correctly before starting")
        } else if (formPercentage < 50) {
            endSuggestions.push("Focus on maintaining proper form throughout the exercise")
            endSuggestions.push("Consider reducing weight to perfect your technique")
        } else if (formPercentage < 80) {
            endSuggestions.push("Good form overall! Work on consistency")
            endSuggestions.push("Pay attention to posture during the final reps")
        } else {
            endSuggestions.push("Excellent form! You're ready to increase intensity")
            endSuggestions.push("Consider adding more reps or weight next time")
        }
        
        // Add specific feedback from the workout
        if (formFeedback.length > 0) {
            const commonIssues = [...new Set(formFeedback)] // Remove duplicates
            endSuggestions.push(...commonIssues.slice(0, 2)) // Add top 2 issues
        }
        
        // Ensure we always have at least 2 suggestions
        if (endSuggestions.length === 0) {
            endSuggestions.push("Great workout! Keep maintaining consistent form")
            endSuggestions.push("Try to focus on controlled movements")
        }
        
        // Update final workout summary
        setWorkoutSummary(prev => {
            const finalSummary = {
                ...prev,
                reps: totalReps,
                duration: finalDuration,
                formScore: aiScore,
                suggestions: endSuggestions,
                formAnalysis: {
                    goodForm: goodFormReps,
                    totalReps: totalReps
                }
            }
            console.log('📊 Final workout summary:', finalSummary)
            return finalSummary
        })
        
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
                        {POSETRACKER_CONFIG.EXERCISE.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')} Tracker
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

                {/* Exercise counter */}
                {isRecording && repsCounter > 0 && (
                    <View className="absolute top-20 left-6 z-10">
                        <View className="bg-blue-600 px-3 py-2 rounded-full">
                            <Text className="text-white font-poppins-semibold text-sm">
                                Reps: {repsCounter}
                            </Text>
                        </View>
                    </View>
                )}

                {/* PoseTracker WebView */}
                <View className="flex-1 mx-6 my-20 rounded-3xl overflow-hidden border border-neutral-700">
                    {POSETRACKER_CONFIG.API_KEY === "YOUR_API_KEY_HERE" ? (
                        // Fallback placeholder when API key is not set
                        <View className="flex-1 bg-neutral-900 items-center justify-center">
                            <Camera size={80} color="#404040" />
                            <Text className="text-neutral-400 font-poppins-medium mt-4 text-center px-4">
                                Please add your PoseTracker API key to camera.tsx
                            </Text>
                        </View>
                    ) : (
                        <WebView
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            style={{ flex: 1 }}
                            source={{ uri: posetracker_url }}
                            originWhitelist={['*']}
                            injectedJavaScript={jsBridge}
                            onMessage={onMessage}
                            mixedContentMode="compatibility"
                            onError={(syntheticEvent: any) => {
                                const { nativeEvent } = syntheticEvent
                                console.warn('WebView error:', nativeEvent)
                            }}
                            onLoadingError={(syntheticEvent: any) => {
                                const { nativeEvent } = syntheticEvent
                                console.warn('WebView loading error:', nativeEvent)
                            }}
                        />
                    )}
                </View>

                {/* AI Status indicator */}
                {poseTrackerInfos && (
                    <View className="absolute top-32 left-6 z-10">
                        <View className="bg-green-600 px-3 py-2 rounded-full">
                            <Text className="text-white font-poppins-medium text-xs">
                                AI: {poseTrackerInfos.ready ? "Ready" : "Calibrating"}
                            </Text>
                        </View>
                    </View>
                )}

                {showSuggestions && suggestions.length > 0 && (
                    <Suggestions suggestionAnimations={suggestionAnimations} suggestions={suggestions} />
                )}

                <View className="absolute bottom-10 left-0 right-0 px-6">
                    <View className="flex-row items-center justify-center gap-4">
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
                        
                        {/* Debug: Test Summary Button */}
                        {!isRecording && repsCounter > 0 && (
                            <TouchableOpacity
                                onPress={() => summarySheetRef.current?.snapToIndex(0)}
                                className="bg-blue-600 px-4 py-2 rounded-full"
                            >
                                <Text className="text-white font-poppins-medium text-sm">
                                    Show Summary
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <BotSheet ref={summarySheetRef} snapPoints={["60%"]}>
                <Summary 
                    summarySheetRef={summarySheetRef} 
                    workoutData={workoutSummary}
                />
            </BotSheet>
        </SafeAreaView>
    )
}

export default CameraScreen 