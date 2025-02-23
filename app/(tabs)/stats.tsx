"use client"

import { useState } from "react"
import { View, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { LineChart } from "react-native-chart-kit"
import { Calendar } from "react-native-calendars"
import { Dumbbell, Flame, TrendingUp } from "lucide-react-native"
import StatCard from "@/components/stat-card"
import { router } from "expo-router"
import { Avatar } from "react-native-paper"
import { useAuth } from "@/context/auth"

const { width: screenWidth } = Dimensions.get("window")

const Stats = () => {
  const [selected, setSelected] = useState("")
  const { session } = useAuth()
  const user = session?.user

  const workoutDates = {
    "2025-02-01": { selected: true, selectedColor: "#FF3737" },
    "2025-02-03": { selected: true, selectedColor: "#FF3737" },
    "2025-02-05": { selected: true, selectedColor: "#FF3737" },
    "2025-02-07": { selected: true, selectedColor: "#FF3737" },
    "2025-02-09": { selected: true, selectedColor: "#FF3737" },
  }

  const weightData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [68, 69, 70, 72, 73, 71],
        color: (opacity = 1) => `rgba(255, 55, 55, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  }

  const chartConfig = {
    backgroundColor: '#171717',
    backgroundGradientFrom: '#171717',
    backgroundGradientTo: '#171717',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '1',
      stroke: '#FF3737',
      fill: '#FF3737',
    },
    propsForBackgroundLines: {
      strokeDasharray: '6',
      stroke: 'rgba(255, 255, 255)',
      strokeWidth: 1,
    },
    fillShadowGradientFrom: 'rgba(255, 55, 55, 0.2)',
    fillShadowGradientTo: 'rgba(255, 55, 55, 0)',
    paddingRight: 20,
  };

  return (
    <SafeAreaView className={`flex-1 bg-black ${Platform.OS === "ios" ? "" : "pt-5"}`}>
      <StatusBar style="light" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: Platform.OS === "ios" ? 0 : 60 }}>
        <View className="px-4 py-6">
          {/* Header Section - Matching Home Screen */}
          <View className="flex-row justify-between items-center mb-8">
            <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/profile")}>
              <Avatar.Image
                size={45}
                source={{ uri: user?.user_metadata?.avatar_url }}
                className="bg-neutral-800 rounded-full"
              />
              <View className="ml-4">
                <Text className="text-white text-xl font-poppins-semibold">Workout Mate</Text>
                <Text className="text-neutral-400 text-base font-poppins-semibold">
                  Your Stats
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center mb-4 gap-2">
            <StatCard title="Workouts" value="23" Icon={Dumbbell} trend={5} />
            <StatCard title="Calories" value="12,400" Icon={Flame} trend={-2} />
            <StatCard title="Weight" value="71 kg" Icon={TrendingUp} trend={1.5} />
          </View>

          <View className="flex items-center justify-center gap-2 bg-neutral-900 rounded-3xl p-4 w-full overflow-hidden mb-4">
            <Text className="text-white text-2xl font-poppins-semibold mb-2">
              Weight Progress
            </Text>
            <View className="px-2 ml-2 -mx-4">
              <LineChart
                data={weightData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={false}
                style={{
                  borderRadius: 24,
                }}
                withDots={true}
              />
            </View>
          </View>

          <View className="bg-neutral-900 rounded-3xl p-4 mb-10">
            <Calendar
              theme={{
                backgroundColor: "transparent",
                calendarBackground: "transparent",
                textSectionTitleColor: "#ffffff",
                selectedDayBackgroundColor: "#FF3737",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#FF3737",
                dayTextColor: "#ffffff",
                textDisabledColor: "#444444",
                dotColor: "#FF3737",
                selectedDotColor: "#ffffff",
                arrowColor: "#FF3737",
                monthTextColor: "#ffffff",
                textDayFontFamily: "System",
                textMonthFontFamily: "System",
                textDayHeaderFontFamily: "System",
                textDayFontWeight: "300",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "300",
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
              style={{ borderRadius: 24 }}
              markedDates={{
                [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: "#FF3737" },
                ...workoutDates,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Stats

