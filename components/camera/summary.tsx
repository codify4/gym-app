import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { router } from 'expo-router'

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

const Summary = ({ 
    summarySheetRef,
    workoutData 
}: { 
    summarySheetRef: React.RefObject<any>
    workoutData: WorkoutSummary 
}) => {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
    }

    const capitalizeExercise = (exercise: string) => {
        return exercise.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    }

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'bg-green-500'
        if (score >= 6) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
            <Text className="text-white font-poppins-semibold text-xl text-center mb-6">
                Workout Summary
            </Text>

            <View className="bg-neutral-800 border border-neutral-700 rounded-3xl p-5 mb-6">
                <View className="gap-4">
                    <View className="flex-row items-center justify-between pb-2 border-b border-neutral-700">
                        <Text className="text-neutral-400 font-poppins-medium text-sm uppercase tracking-wider">
                            Exercise
                        </Text>
                        <Text className="text-white font-poppins-semibold text-lg">
                            {capitalizeExercise(workoutData.exercise)}
                        </Text>
                    </View>
                    
                    <View className="flex-row items-center justify-between pb-2 border-b border-neutral-700">
                        <Text className="text-neutral-400 font-poppins-medium text-sm uppercase tracking-wider">
                            Reps
                        </Text>
                        <View className="bg-neutral-700 px-4 py-1 rounded-full">
                            <Text className="text-white font-poppins-bold text-lg">
                                {workoutData.reps}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between pb-2 border-b border-neutral-700">
                        <Text className="text-neutral-400 font-poppins-medium text-sm uppercase tracking-wider">
                            Duration
                        </Text>
                        <Text className="text-white font-poppins-semibold text-lg">
                            {formatDuration(workoutData.duration)}
                        </Text>
                    </View>
                    
                    <View className="flex-row items-center justify-between">
                        <Text className="text-neutral-400 font-poppins-medium text-sm uppercase tracking-wider">
                            AI Score
                        </Text>
                        <View className="flex-row items-center gap-3">
                            <View className={`${getScoreColor(workoutData.formScore)} px-4 py-1 rounded-full`}>
                                <Text className="text-white font-poppins-bold text-lg">
                                    {workoutData.formScore}/10
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Form Analysis */}
            {workoutData.formAnalysis.totalReps > 0 && (
                <View className="bg-neutral-800 border border-neutral-700 rounded-3xl p-5 mb-6">
                    <Text className="text-white font-poppins-semibold text-lg mb-3">
                        Form Analysis
                    </Text>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-neutral-400 font-poppins-medium text-sm">
                            Good Form Reps
                        </Text>
                        <Text className="text-white font-poppins-semibold">
                            {workoutData.formAnalysis.goodForm}/{workoutData.formAnalysis.totalReps}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-neutral-400 font-poppins-medium text-sm">
                            Form Accuracy
                        </Text>
                        <Text className="text-white font-poppins-semibold">
                            {workoutData.formAnalysis.totalReps > 0 
                                ? Math.round((workoutData.formAnalysis.goodForm / workoutData.formAnalysis.totalReps) * 100)
                                : 0}%
                        </Text>
                    </View>
                </View>
            )}

            {/* AI Suggestions */}
            {workoutData.suggestions.length > 0 && (
                <View className="bg-neutral-800 border border-neutral-700 rounded-3xl p-5 mb-6">
                    <Text className="text-white font-poppins-semibold text-lg mb-3">
                        AI Recommendations
                    </Text>
                    {workoutData.suggestions.map((suggestion, index) => (
                        <View key={index} className="flex-row items-start mb-2">
                            <Text className="text-blue-400 font-poppins-medium text-base mr-2">•</Text>
                            <Text className="text-neutral-300 font-poppins-regular text-sm flex-1">
                                {suggestion}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <View className="flex-row gap-2 pb-6">
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
                        Alert.alert("Success", "Workout saved!")
                        router.push("/(tabs)/chatbot")
                    }}
                >
                    <Text className="text-black font-poppins-semibold text-center">
                        Save Workout
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Summary