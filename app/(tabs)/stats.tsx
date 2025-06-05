"use client"

import { useState, useEffect } from "react"
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform, Image } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Calendar } from "react-native-calendars"
import { Dumbbell, Flame, Clock } from "lucide-react-native"
import StatCard from "@/components/stat-card"
import { router } from "expo-router"
import { useAuth } from "@/context/auth"
import { useWorkouts } from "@/hooks/use-workouts"
import { RadarChart } from "@salmonco/react-native-radar-chart"
import ProfileHeader from "@/components/profile-header"

// Simple day labels for calendar header
const CustomDayLabels = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
      <Text key={index} style={{ color: '#ffffff', fontSize: 14 }}>
        {day}
      </Text>
    ))}
  </View>
);

// Common body parts for workouts
const COMMON_BODY_PARTS = [
  "Chest", "Back", "Legs", "Arms", "Shoulders", "Core", "Cardio"
]

const Stats = () => {
  const [selected, setSelected] = useState("")
  const { session } = useAuth()
  const user = session?.user
  const userId = session?.user?.id
  const {
    workouts,
    completedWorkoutsData,
    getTotalCaloriesBurned,
    getTotalWorkoutDuration,
    getWorkoutTrend,
    getCalorieTrend,
    getDurationTrend,
  } = useWorkouts(userId)

  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [totalCalories, setTotalCalories] = useState(0)
  const [avgDuration, setAvgDuration] = useState(0)
  const [workoutDates, setWorkoutDates] = useState<Record<string, { selected: boolean; selectedColor: string }>>({})

  const [workoutTrend, setWorkoutTrend] = useState(0)
  const [calorieTrend, setCalorieTrend] = useState(0)
  const [durationTrend, setDurationTrend] = useState(0)
  
  // Body part distribution data
  const [bodyPartRadarData, setBodyPartRadarData] = useState<{label: string, value: number}[]>([])
  
  // Function to analyze workout data by body part for radar chart
  const analyzeWorkoutsByBodyPart = () => {
    if (!workouts.length || !completedWorkoutsData.length) return
    
    // Count workouts by body part
    const bodyPartCounts: Record<string, number> = {}
    
    // Initialize with zero counts for common body parts
    COMMON_BODY_PARTS.forEach(part => {
      bodyPartCounts[part] = 0
    })
    
    // First create a map of workout IDs to their body parts
    const workoutBodyParts = new Map<string, string>()
    workouts.forEach(workout => {
      const bodyPart = workout.body_part || "General"
      workoutBodyParts.set(workout.workout_id, bodyPart)
    })
    
    // Now count completed workouts by body part
    completedWorkoutsData.forEach(completedWorkout => {
      // Get the body part from the workout map
      const workoutId = (completedWorkout as any).workout_id
      if (!workoutId) return
      
      let bodyPart = workoutBodyParts.get(workoutId) || "General"
      
      // Map to common categories if needed
      if (!COMMON_BODY_PARTS.includes(bodyPart)) {
        if (bodyPart.includes("Chest")) bodyPart = "Chest"
        else if (bodyPart.includes("Back")) bodyPart = "Back"
        else if (bodyPart.includes("Leg")) bodyPart = "Legs"
        else if (bodyPart.includes("Arm") || bodyPart.includes("Bicep") || bodyPart.includes("Tricep")) bodyPart = "Arms"
        else if (bodyPart.includes("Shoulder")) bodyPart = "Shoulders"
        else if (bodyPart.includes("Core") || bodyPart.includes("Ab")) bodyPart = "Core"
        else if (bodyPart.includes("Cardio")) bodyPart = "Cardio"
        else bodyPart = "General"
      }
      
      bodyPartCounts[bodyPart] = (bodyPartCounts[bodyPart] || 0) + 1
    })
    
    // Convert to format for radar chart - include ALL body parts, even with zero counts
    const radarData: {label: string, value: number}[] = []
    
    // Include all common body parts in the radar chart
    COMMON_BODY_PARTS.forEach(part => {
      radarData.push({
        label: part,
        value: bodyPartCounts[part] || 0
      })
    })
    
    // Check if we have any data at all
    const hasAnyWorkouts = radarData.some(item => item.value > 0)
    
    if (!hasAnyWorkouts) {
      // If no workouts at all, return empty array so we show the "Not enough data" message
      setBodyPartRadarData([])
      return
    }
    
    setBodyPartRadarData(radarData)
  }

  // Main stats effect
  useEffect(() => {
    setTotalWorkouts(completedWorkoutsData.length)

    const calories = getTotalCaloriesBurned()
    setTotalCalories(calories)

    const totalDuration = getTotalWorkoutDuration()
    const average = completedWorkoutsData.length > 0 ? Math.round(totalDuration / completedWorkoutsData.length) : 0
    setAvgDuration(average)

    setWorkoutTrend(getWorkoutTrend())
    setCalorieTrend(getCalorieTrend())
    setDurationTrend(getDurationTrend())

    // Create marked dates for calendar
    const dates: Record<string, { selected: boolean; selectedColor: string }> = {}

    completedWorkoutsData.forEach((workout) => {
      if (workout.completed_date) {
        const date = new Date(workout.completed_date).toISOString().split("T")[0]
        dates[date] = { selected: true, selectedColor: "#FF3737" }
      }
    })

    setWorkoutDates(dates)
    
    // Analyze workout data by body part
    analyzeWorkoutsByBodyPart()
  }, [
    workouts, 
    completedWorkoutsData,
    getTotalCaloriesBurned,
    getTotalWorkoutDuration,
    getWorkoutTrend,
    getCalorieTrend,
    getDurationTrend,
  ])

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
          <ProfileHeader tab="My Stats" />

          <View className="flex-row justify-between items-center mb-4 gap-2">
            <StatCard
              title="Workouts"
              value={totalWorkouts.toString()}
              Icon={Dumbbell}
              trend={workoutTrend}
              iconColor="#FF3737"
            />
            <StatCard
              title="Calories"
              value={formattedCalories}
              Icon={Flame}
              trend={calorieTrend}
              iconColor="#FF3737"
            />
            <StatCard
              title="Duration"
              value={formattedDuration}
              Icon={Clock}
              trend={durationTrend}
              iconColor="#FF3737"
            />
          </View>
          
          {/* Body Part Distribution Chart */}
          <View className="flex items-center justify-center gap-2 bg-neutral-900 rounded-3xl p-4 w-full overflow-hidden mb-4">
            <Text className="text-white text-2xl font-poppins-semibold mb-4">Training Focus</Text>
            <View className="px-2 items-center">
              {completedWorkoutsData.length === 0 ? (
                <View className="h-[300px] w-full items-center justify-center">
                  <Text className="text-white text-lg text-center">No workout data yet</Text>
                  <TouchableOpacity 
                    className="mt-4 bg-[#FF3737] rounded-full px-5 py-2"
                    onPress={() => router.push("/(tabs)")}
                  >
                    <Text className="text-white font-poppins-semibold">Start a Workout</Text>
                  </TouchableOpacity>
                </View>
              ) : bodyPartRadarData.length === 0 ? (
                <View className="h-[300px] w-full items-center justify-center">
                  <Text className="text-white text-lg text-center">Not enough data</Text>
                </View>
              ) : (
                <RadarChart
                  data={bodyPartRadarData}
                  size={300}
                  maxValue={Math.max(...bodyPartRadarData.map(item => item.value)) + 1}
                  dataFillColor="#FF3737"
                  dataFillOpacity={0.8}
                  dataStroke="#FF3737"
                  dataStrokeWidth={2}
                  fillColor="#1F1F1F"
                  fillOpacity={1}
                  stroke={['#333', '#444', '#555', '#666', '#777']}
                  strokeWidth={[0.5, 0.5, 0.5, 0.5, 0.5]}
                  labelColor="#FFFFFF"
                  labelSize={12}
                  labelFontFamily="Poppins-Medium"
                />
              )}
            </View>
          </View>

          <View className="bg-neutral-900 rounded-3xl p-4 mb-10">
            <CustomDayLabels />
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
                [selected]: { selected: true, disableTouchEvent: true, selectedColor: "#FF3737" },
                ...workoutDates,
              }}
              firstDay={1}
              renderHeader={(date) => (
                <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold", padding: 10 }}>
                  {date.getMonth() === 0 ? 'January' : 
                   date.getMonth() === 1 ? 'February' : 
                   date.getMonth() === 2 ? 'March' : 
                   date.getMonth() === 3 ? 'April' : 
                   date.getMonth() === 4 ? 'May' : 
                   date.getMonth() === 5 ? 'June' : 
                   date.getMonth() === 6 ? 'July' : 
                   date.getMonth() === 7 ? 'August' : 
                   date.getMonth() === 8 ? 'September' : 
                   date.getMonth() === 9 ? 'October' : 
                   date.getMonth() === 10 ? 'November' : 'December'} {date.getFullYear()}
                </Text>
              )}
              hideDayNames={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Stats