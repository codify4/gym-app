import { monthlyStats } from '@/constants/data'
import { Flame } from 'lucide-react-native'
import { View, Text } from 'react-native'

const WorkoutStreak = () => {
    return (
        <View className="mb-8">
            <Text className="text-white text-2xl font-poppins-semibold mb-4">This Month</Text>
            <View className="flex-row justify-between">
                {monthlyStats.map((stat, index) => (
                <View key={index} className="flex items-center bg-neutral-800 rounded-3xl py-5 px-5 flex-1 mx-1.5">
                    <Flame size={22} color="#ffffff99" className="mb-1" />
                    <Text className="text-white/60 text-base font-poppins-medium mb-1">{stat.category}</Text>
                    <Text className="text-white text-3xl font-poppins-bold">{stat.count}</Text>
                </View>
                ))}
            </View>
        </View>
    )
}
export default WorkoutStreak