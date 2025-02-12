import { LucideIcon } from 'lucide-react-native'
import { View, Text } from 'react-native'

type StatProps = {
    category: string;
    count: number;
    icon: LucideIcon;
}

const Statistics = ({ stats, title }: { stats: StatProps[], title?: string }) => {
    return (
        <View className="mb-8">
            <Text className="text-white text-2xl font-poppins-semibold mb-4">{title}</Text>
            <View className="flex-row justify-between">
                {stats.map((stat: StatProps, index: number) => (
                <View key={index} className="flex items-center bg-neutral-800 rounded-3xl py-5 px-5 flex-1 mx-1.5">
                    <stat.icon size={22} color="#ffffff99" className="mb-1" />
                    <Text className="text-white/60 text-base font-poppins-medium mb-1">{stat.category}</Text>
                    <Text className="text-white text-3xl font-poppins-bold">{stat.count}</Text>
                </View>
                ))}
            </View>
        </View>
    )
}
export default Statistics