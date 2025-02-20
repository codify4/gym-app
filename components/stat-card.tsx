import { View, Text } from "react-native"
import { type LucideIcon } from "lucide-react-native"

const StatCard = ({
    title,
    value,
    Icon,
    trend,
    percentage = true,
}: { title: string; value: string; Icon: LucideIcon; trend: number; percentage?: boolean }) => {
    return (
        <View className="bg-neutral-900 rounded-2xl p-4 flex-1">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-400 text-base font-poppins-medium">{title}</Text>
                <Icon size={16} color="#FF3737" />
            </View>
            <Text className="text-white text-2xl font-poppins-bold">{value}</Text>
            <Text className={`text-sm font-poppins-semibold ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}{percentage && `%`}
            </Text>
        </View>
    )
}

export default StatCard