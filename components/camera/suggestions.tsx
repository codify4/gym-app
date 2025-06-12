import { View, Text, Animated } from 'react-native'
import React from 'react'

interface PoseTrackerSuggestion {
    id: string
    text: string
    delay: number
}

const Suggestions = ({ 
    suggestionAnimations, 
    suggestions 
}: { 
    suggestionAnimations: any[], 
    suggestions: PoseTrackerSuggestion[] 
}) => {
    return (
        <View className="absolute top-32 left-6 right-6 z-20">
            {suggestions.map((suggestion, index) => (
                <Animated.View
                    key={suggestion.id}
                    style={{
                        transform: [{ translateY: suggestionAnimations[index] || new Animated.Value(-100) }],
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
    )
}

export default Suggestions