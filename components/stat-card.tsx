"use client"

import { View, Text } from "react-native"
import { ArrowDown, ArrowUp, Minus } from "lucide-react-native"
import type { LucideIcon } from "lucide-react-native"

interface StatCardProps {
  title: string
  value: string
  Icon: LucideIcon
  trend: number
  iconColor?: string
  percentage?: boolean
}

const StatCard = ({ title, value, Icon, trend, iconColor = "#FF3737", percentage = true }: StatCardProps) => {
  // Determine trend direction and color
  const isTrendUp = trend > 0
  const isTrendFlat = trend === 0
  const trendColor = isTrendUp ? "#22c55e" : isTrendFlat ? "#888888" : "#ef4444"

  // Format trend value
  const trendValue = Math.abs(trend)
  const trendText = percentage ? `${trendValue}%` : trendValue.toString()

  return (
    <View className="bg-neutral-900 rounded-3xl p-4 flex-1">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-neutral-400 text-base font-poppins-medium">{title}</Text>
        <Icon size={18} color={iconColor} />
      </View>
      <Text className="text-white text-xl font-poppins-bold mb-1">{value}</Text>
      <View className="flex-row items-center">
        {isTrendFlat ? (
          <Minus size={14} color={trendColor} />
        ) : isTrendUp ? (
          <ArrowUp size={14} color={trendColor} />
        ) : (
          <ArrowDown size={14} color={trendColor} />
        )}
        <Text className="text-xs ml-1" style={{ color: trendColor }}>
          {isTrendFlat ? "No change" : `${trendText} ${isTrendUp ? "up" : "down"}`}
        </Text>
      </View>
    </View>
  )
}

export default StatCard