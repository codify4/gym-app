"use client"

import { useState, useRef  } from "react"
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform, StyleSheet } from "react-native"
import { TrendingUp, Plus } from "lucide-react-native"
import BottomSheet from '@gorhom/bottom-sheet';
import BodyPartButton from "@/components/body-part"
import RoutineCard from "@/components/routine-card"
import { bodyParts, routines } from "@/constants/data"
import BotSheet from "@/components/bot-sheet"

const WorkoutRoutines = () => {
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState("All")

  const platform = Platform.OS
  const filteredRoutines = selectedBodyPart === "All" ? routines : routines.filter((routine) => routine.bodyPart === selectedBodyPart)


  const handleOpenBottomSheet = () => {
      bottomSheetRef.current?.expand();
  };

  return (
    <SafeAreaView className={`flex flex-col flex-1 bg-black ${platform === "ios" ? "" : "pt-5"}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: platform === "ios" ? 60 : 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-3xl font-poppins-bold">My Routines</Text>
        </View>

        <View className="flex-row flex-wrap justify-between mb-6">
          {bodyParts.map((part, index) => (
            <BodyPartButton key={index} part={part} selectedBodyPart={selectedBodyPart} setSelectedBodyPart={setSelectedBodyPart} />
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

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleOpenBottomSheet}
      >
        <Plus size={24} color="black" />
      </TouchableOpacity>

      <BotSheet ref={bottomSheetRef}>
        <Text className="text-white text-lg font-poppins-semibold">Add New Routine</Text>
      </BotSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    right: 20,
  }
});

export default WorkoutRoutines