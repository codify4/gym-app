import { PlayCircle } from 'lucide-react-native'
import { View, Text, Image, TouchableOpacity } from 'react-native'

const TodayWorkout = () => {
    return (
        <View className="bg-neutral-800 rounded-3xl mb-8">
            <View className="relative">
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' }} 
                    className="w-full h-48 rounded-t-3xl"
                    resizeMode="cover"
                />
                <View className="absolute w-full h-full bg-black/30" />
                <View className="absolute bottom-4 right-4">
                    <Text className="text-white text-3xl font-poppins-bold">Chest Day</Text>
                    <Text className="text-white/80 text-base font-poppins-medium text-right">6 exercises</Text>
                </View>
            </View>
            <View className="p-6">
                <Text className="text-white text-2xl font-poppins-semibold mb-4">Today's Workout</Text>
                <TouchableOpacity className="bg-black rounded-full py-4">
                    <View className="flex-row justify-center items-center">
                        <Text className="text-white text-center text-xl font-poppins-semibold mr-2">Start workout</Text>
                        <PlayCircle size={24} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default TodayWorkout