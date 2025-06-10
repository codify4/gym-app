import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'

const Summary = ({ summarySheetRef }: { summarySheetRef: React.RefObject<any> }) => {
    return (
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
    )
}

export default Summary