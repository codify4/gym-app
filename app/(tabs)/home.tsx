"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList, Platform, StyleSheet, Image } from "react-native"
import TodayWorkout from "@/components/today-workout"
import { useAuth } from "@/context/auth"
import { router } from "expo-router"
import StatCard from "@/components/stat-card"
import { Brain, Flame } from "lucide-react-native"
import { useWorkouts } from "@/hooks/use-workouts"
import type { Workout } from "@/lib/workouts"
import { dummyWorkouts } from "@/constants/data"
import WorkoutCard from "@/components/workout-card"
import ProfileHeader from "@/components/profile-header"

interface BodyPartStat {
  category: string
  count: string
  trend: number
}

const Home = () => {
  const { session } = useAuth()
  const user = session?.user
  const userId = session?.user?.id
  const platform = Platform.OS

  const { workouts, loading, refreshing, onRefresh, getRandomWorkout, getSpecificBodyPartTrends } = useWorkouts(userId)

  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null)
  const [bodyPartStats, setBodyPartStats] = useState<BodyPartStat[]>([])

  useEffect(() => {
    // Get a random workout for today
    const randomWorkout = getRandomWorkout()
    setTodayWorkout(randomWorkout)

    // Get specific body part stats with trends (chest, legs, arms)
    const stats = getSpecificBodyPartTrends()
    setBodyPartStats(stats)
  }, [workouts, getRandomWorkout, getSpecificBodyPartTrends])

  return (
    <SafeAreaView className={`flex-1 bg-black ${platform === "ios" ? "" : "pt-5"}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: platform === "ios" ? 60 : 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-1">
          <ProfileHeader tab="Home" />
        </View>

        <TodayWorkout workout={todayWorkout} />

        {workouts.length > 0 && (
          <View className="mb-6 rounded-3xl">
            <Text className="text-white text-3xl font-poppins-semibold mb-4">My Workouts</Text>
            <FlatList
            data={dummyWorkouts}
            renderItem={({ item }) => <WorkoutCard workout={item} />}
              keyExtractor={(item) => item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
            />
          </View>
        )}

        {bodyPartStats.length > 0 && (
          <View className="px-1 mb-6">
            <Text className="text-white text-2xl font-poppins-semibold mb-4">Monthly Progress</Text>
            <View className="flex-row justify-between gap-2">
              {bodyPartStats.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.category}
                  value={stat.count}
                  Icon={Flame}
                  trend={stat.trend}
                  percentage={false}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        className="bg-white"
        onPress={() => router.push("/(tabs)/chatbot")}
      >
        <Brain size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    right: 20,
  },
})

export default Home