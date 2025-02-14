"use client"

import { useState } from "react"
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Dumbbell, ChevronRight, Timer, TrendingUp, Activity, Plus } from "lucide-react-native"

const bodyParts = [
  { name: "All", icon: Activity },
  { name: "Chest", icon: Dumbbell },
  { name: "Back", icon: Dumbbell },
  { name: "Legs", icon: Dumbbell },
  { name: "Arms", icon: Dumbbell },
  { name: "Shoulders", icon: Dumbbell },
]

const routines = [
  {
    name: "Upper Body Power",
    exercises: 8,
    duration: "45 min",
    lastPerformed: "2 days ago",
    bodyPart: "Chest",
  },
  {
    name: "Lower Body Focus",
    exercises: 6,
    duration: "40 min",
    lastPerformed: "5 days ago",
    bodyPart: "Legs",
  },
  {
    name: "Full Body Workout",
    exercises: 12,
    duration: "60 min",
    lastPerformed: "Yesterday",
    bodyPart: "All",
  },
  {
    name: "Back and Biceps",
    exercises: 7,
    duration: "50 min",
    lastPerformed: "3 days ago",
    bodyPart: "Back",
  },
  {
    name: "Shoulder Sculpt",
    exercises: 5,
    duration: "35 min",
    lastPerformed: "1 week ago",
    bodyPart: "Shoulders",
  },
]

type Routine = {
  name: string
  exercises: number
  duration: string
  lastPerformed: string
  bodyPart: string
}

const WorkoutRoutines = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState("All")
  const platform = Platform.OS

  const filteredRoutines =
    selectedBodyPart === "All" ? routines : routines.filter((routine) => routine.bodyPart === selectedBodyPart)

  const BodyPartButton = ({ part }: { part: { name: string; icon: typeof Dumbbell } }) => (
    <TouchableOpacity
      className={`bg-neutral-800 rounded-2xl p-4 mb-4 ${
        selectedBodyPart === part.name ? "bg-neutral-700 border border-white" : ""
      }`}
      style={{ width: "31%" }}
      onPress={() => setSelectedBodyPart(part.name)}
    >
      <View className="items-center">
        <part.icon size={32} color="white" />
        <Text className="text-white text-sm mt-2 font-poppins-semibold">{part.name}</Text>
      </View>
    </TouchableOpacity>
  )

  const RoutineCard = ({ routine }: { routine: Routine }) => (
    <TouchableOpacity className="bg-neutral-800 rounded-3xl py-4 px-5 mb-3">
      <View>
        <Text className="text-white text-lg font-semibold mb-2">{routine.name}</Text>
        <View className="flex-row items-center mb-2">
          <Dumbbell size={16} color="#FF3737" />
          <Text className="text-neutral-400 text-sm font-poppins-medium ml-1 mr-3">{routine.exercises} exercises</Text>
          <Timer size={16} color="#FF3737" />
          <Text className="text-neutral-400 text-sm font-poppins-medium ml-1">{routine.duration}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-neutral-500 text-sm font-poppins-semibold">{routine.lastPerformed}</Text>
          <ChevronRight size={20} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className={`flex flex-col flex-1 bg-black ${platform === "ios" ? "" : "pt-5"}`}>
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-3xl font-poppins-bold">My Routines</Text>
        </View>

        <Text className="text-white text-xl font-poppins-semibold mb-4">Body Parts</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {bodyParts.map((part, index) => (
            <BodyPartButton key={index} part={part} />
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-white text-xl font-poppins-semibold mb-4">
            {selectedBodyPart === "All" ? "All Routines" : `${selectedBodyPart} Routines`}
          </Text>
          {filteredRoutines.map((routine, index) => (
            <RoutineCard key={index} routine={routine} />
          ))}
        </View>

        <View className="bg-neutral-800 rounded-3xl py-4 px-5">
          <Text className="text-white text-lg font-poppins-semibold mb-2">Workout Streak</Text>
          <View className="flex-row items-center">
            <TrendingUp size={24} color="#FF3737" />
            <Text className="text-white text-2xl font-poppins-bold ml-2">5 days</Text>
          </View>
          <Text className="text-neutral-400 text-sm mt-1 font-poppins-semibold">Keep it up! You'll get jacked!</Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={{
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems:'center',
        position: 'absolute',
        bottom: 100,
        right: 20
      }}>
        <Plus size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default WorkoutRoutines