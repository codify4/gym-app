"use client"

import { useState, useEffect } from "react"
import { View, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { LineChart } from "react-native-chart-kit"
import { Calendar } from "react-native-calendars"
import { Dumbbell, Flame, Clock } from "lucide-react-native"
import StatCard from "@/components/stat-card"
import { router } from "expo-router"
import { Avatar } from "react-native-paper"
import { useAuth } from "@/context/auth"
import { useWorkouts } from "@/hooks/use-workouts"

const { width: screenWidth } = Dimensions.get("window")

const Stats = () => {
  const [selected, setSelected] = useState("")
  const { session } = useAuth()
  const user = session?.user
  const userId = user?.id
  const { workouts, completedWorkoutsData, getTotalCaloriesBurned, getTotalWorkoutDuration } = useWorkouts(userId)

  // Stats calculations
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [totalCalories, setTotalCalories] = useState(0)
  const [avgDuration, setAvgDuration] = useState(0)
  const [workoutDates, setWorkoutDates] = useState<Record<string, { selected: boolean; selectedColor: string }>>({})

  // Calculate stats from workouts data
  useEffect(() => {
    // Calculate total workouts (completed workouts count)
    setTotalWorkouts(completedWorkoutsData.length)

    // Calculate total calories burned from completed workouts
    const calories = getTotalCaloriesBurned()
    setTotalCalories(calories)

    // Calculate average workout duration
    const totalDuration = getTotalWorkoutDuration()
    const average = completedWorkoutsData.length > 0 ? Math.round(totalDuration / completedWorkoutsData.length) : 0
    setAvgDuration(average)

    // Create marked dates for calendar
    const dates: Record<string, { selected: boolean; selectedColor: string }> = {}

    completedWorkoutsData.forEach((workout) => {
      if (workout.completed_date) {
        const date = new Date(workout.completed_date).toISOString().split("T")[0]
        dates[date] = { selected: true, selectedColor: "#FF3737" }
      }
    })

    setWorkoutDates(dates)
  }, [workouts, completedWorkoutsData, getTotalCaloriesBurned, getTotalWorkoutDuration])

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
    backgroundColor: "#171717",
    backgroundGradientFrom: "#171717",
    backgroundGradientTo: "#171717",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "1",
      stroke: "#FF3737",
      fill: "#FF3737",
    },
    propsForBackgroundLines: {
      strokeDasharray: "6",
      stroke: "rgba(255, 255, 255)",
      strokeWidth: 1,
    },
    fillShadowGradientFrom: "rgba(255, 55, 55, 0.2)",
    fillShadowGradientTo: "rgba(255, 55, 55, 0)",
    paddingRight: 20,
  }

  const formattedCalories = totalCalories.toLocaleString()
  const formattedDuration = `${avgDuration} min`

  return (
    <SafeAreaView className={`flex-1 bg-black ${Platform.OS === "ios" ? "" : "pt-5"}`}>
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: Platform.OS === "ios" ? 0 : 60 }}
      >
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
                <Text className="text-neutral-400 text-base font-poppins-semibold">Your Stats</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center mb-4 gap-2">
            <StatCard title="Workouts" value={totalWorkouts.toString()} Icon={Dumbbell} trend={5} iconColor="#FF3737" percentage={false} />
            <StatCard title="Calories" value={formattedCalories} Icon={Flame} trend={8} iconColor="#FF3737" />
            <StatCard
              title="Duration"
              value={formattedDuration}
              Icon={Clock}
              trend={3}
              iconColor="#FF3737"
              percentage={false}
            />
          </View>

          <View className="flex items-center justify-center gap-2 bg-neutral-900 rounded-3xl p-4 w-full overflow-hidden mb-4">
            <Text className="text-white text-2xl font-poppins-semibold mb-2">Activity Progress</Text>
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