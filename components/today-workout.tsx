import { PlayCircle } from "lucide-react-native"
import { View, Text, Image, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import type { Workout } from "@/lib/workouts"

interface TodayWorkoutProps {
  workout: Workout | null
}

const TodayWorkout = ({ workout }: TodayWorkoutProps) => {
    if (!workout) {
        return (
            <View className="bg-neutral-900 rounded-3xl mb-8 p-6">
                <Text className="text-white text-2xl font-poppins-semibold mb-4">Today's Workout</Text>
                <Text className="text-neutral-400 text-lg font-poppins-medium mb-4">
                    No workouts available. Create your first workout to get started!
                </Text>
                <TouchableOpacity className="bg-white rounded-full py-4" onPress={() => router.push("/(tabs)/routine")}>
                    <Text className="text-black text-center text-xl font-poppins-semibold">Create workout</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const exerciseCount = workout.exercises?.length || 0
    const imageUrl = workout.image || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b"

    const handleStartWorkout = () => {
        router.push({
            pathname: "/(tabs)/workout",
            params: { id: workout.workout_id },
        })
    }

    return (
        <View className="bg-neutral-900 rounded-3xl mb-8">
            <TouchableOpacity
                className="relative"
                onPress={() =>
                    router.push({
                        pathname: "/(tabs)/[id]",
                        params: { id: workout.workout_id },
                })
                }
            >
                <Image source={{ uri: imageUrl }} className="w-full h-48 rounded-t-3xl" resizeMode="cover" />
                <View className="absolute w-full h-full bg-black/30" />
                    <View className="absolute bottom-4 right-4">
                    <Text className="text-white text-3xl font-poppins-bold">{workout.title}</Text>
                    <Text className="text-white/80 text-base font-poppins-medium text-right">
                        {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
                    </Text>
                </View>
            </TouchableOpacity>
            <View className="p-6">
                <Text className="text-white text-2xl font-poppins-semibold mb-4">Today's Workout</Text>
                <TouchableOpacity className="bg-white rounded-full py-4" onPress={handleStartWorkout}>
                    <View className="flex-row justify-center items-center">
                        <Text className="text-black text-center text-xl font-poppins-semibold mr-2">Start workout</Text>
                        <PlayCircle size={24} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default TodayWorkout
