import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList, Platform } from "react-native"
import { Avatar } from "react-native-paper"
import { dummyWorkouts, monthlyStats } from "@/constants/data"
import { Bell } from "lucide-react-native"
import WorkoutCard from "@/components/workout-card"
import TodayWorkout from "@/components/today-workout"
import { useAuth } from "@/context/auth"
import { router } from "expo-router"
import StatCard from "@/components/stat-card"

const Home = () => {
  const { session } = useAuth()
  const user = session?.user
  const platform = Platform.OS

  return (
    <SafeAreaView className={`flex-1 bg-black ${platform === "ios" ? "" : "pt-5"}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: platform === "ios" ? 60 : 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-1">
          <View className="flex-row justify-between items-center mt-6 mb-8">
            <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/profile")}>
              <Avatar.Image
                size={45}
                source={{ uri: user?.user_metadata?.avatar_url }}
                className="bg-neutral-800 rounded-full"
              />
              <View className="ml-4">
                <Text className="text-neutral-400 text-sm font-poppins-medium">Welcome back</Text>
                <Text className="text-white text-xl font-poppins-semibold">
                  {user?.user_metadata?.full_name || "User"}
                </Text>
              </View>
            </TouchableOpacity>
            <View className="flex-row gap-4">
              <TouchableOpacity className="bg-neutral-900 p-2 rounded-xl">
                <Bell size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TodayWorkout />

        <View className="mb-6 bg-neutral-900 rounded-3xl p-6">
          <Text className="text-white text-3xl font-poppins-semibold mb-4 ml-4">My Workouts</Text>
          <FlatList
            data={dummyWorkouts}
            renderItem={({ item }) => <WorkoutCard workout={item} />}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerClassName="pl-[5.5px]"
          />
        </View>

        <View className="px-1">
          <Text className="text-white text-2xl font-poppins-semibold mb-4">Monthly Progress</Text>
          <View className="flex-row justify-between gap-2">
            {monthlyStats.map((stat, index) => (
              <StatCard key={index} title={stat.category} value={stat.count} Icon={stat.icon} trend={stat.trend} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home