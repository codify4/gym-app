import { useState, useRef, useMemo } from "react"
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform, StyleSheet, TextInput, Dimensions, KeyboardAvoidingView, KeyboardAvoidingViewBase } from "react-native"
import { TrendingUp, Plus, Bell, CheckCircle2, Clock, Trash2, Dumbbell } from "lucide-react-native"
import BottomSheet from '@gorhom/bottom-sheet';
import { Avatar } from "react-native-paper"
import BodyPartButton from "@/components/routine/body-part"
import RoutineCard from "@/components/routine/routine-card"
import { bodyParts, routines } from "@/constants/data"
import BotSheet from "@/components/bot-sheet"
import { useAuth } from "@/context/auth"
import { router } from "expo-router"
import * as Haptics from 'expo-haptics';
import type { Exercise, Routine } from "@/constants/data"
import Input from "@/components/input";

const { width } = Dimensions.get("window")


const initialExercise: Exercise = {
  name: "",
  sets: 3,
  reps: 10,
  image: require("@/assets/images/anatomy/chest.png")
}

const WorkoutRoutines = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState("All")
  const { session } = useAuth()
  const user = session?.user
  const platform = Platform.OS

  const filteredRoutines = selectedBodyPart === "All" 
    ? routines 
    : routines.filter((routine) => routine.bodyPart === selectedBodyPart)

  const handleOpenBottomSheet = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    bottomSheetRef.current?.expand();
  };

  const keyboardVerticalOffset = Platform.OS === "ios" ? 50 : 0

  // New Routine Form State
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    name: "",
    exercises: [{ ...initialExercise }],
    duration: "",
    bodyPart: "All",
  })

  const handleAddExercise = () => {
    setNewRoutine(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), { ...initialExercise }]
    }))
  }

  const handleRemoveExercise = (index: number) => {
    setNewRoutine(prev => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index)
    }))
  }

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    setNewRoutine(prev => ({
      ...prev,
      exercises: prev.exercises?.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }))
  }

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('New Routine:', newRoutine)
    // Reset form and close bottom sheet
    setNewRoutine({
      name: "",
      exercises: [{ ...initialExercise }],
      duration: "",
      bodyPart: "All",
    })
    bottomSheetRef.current?.close()
  }

  // TODO: add check if it has passed an its not done then use red x as icon

  // Helper function to get routine name for each day
  const getRoutineForDay = (day: string) => {
    const routineSchedule: { [key: string]: string } = {
      'Mon': 'Upper Body',
      'Tue': 'Lower Body',
      'Wed': 'Core',
      'Thu': 'Cardio',
      'Fri': 'Full Body',
      'Sat': 'Rest',
      'Sun': 'Rest'
    };
    return routineSchedule[day];
  };

  const weekDays = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0-6, starting from Sunday
    const mondayOffset = currentDay === 0 ? 6 : currentDay - 1; // Calculate days since Monday

    return days.map((day, index) => {
      // Calculate if this day is before or after today in the current week
      const dayOffset = index - mondayOffset;
      const isToday = dayOffset === 0;
      const isPastDay = dayOffset < 0;
      
      return {
        day,
        completed: isPastDay, // Only past days are completed
        routineName: getRoutineForDay(day),
        isToday
      };
    });
  }, []);

  return (
    <SafeAreaView className={`flex flex-col flex-1 bg-black ${platform === "ios" ? "" : "pt-5"}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: platform === "ios" ? 60 : 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/profile")}>
            <Avatar.Image
              size={45}
              source={{ uri: user?.user_metadata?.avatar_url }}
              className="bg-neutral-800 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-neutral-400 text-sm font-poppins-medium">Your Routines</Text>
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

        {/* Weekly Overview */}
        <View className="bg-neutral-900 rounded-3xl p-6 mb-6">
          <Text className="text-white text-xl font-poppins-semibold mb-4">Weekly Overview</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
          >
            {weekDays.map((item, index) => (
              <TouchableOpacity 
                key={index}
                className={`mr-4 items-center ${item.isToday ? 'opacity-100' : 'opacity-70'}`}
                style={{ width: 65 }}
              >
                <View 
                  className={`w-12 h-12 rounded-full items-center justify-center mb-2
                    ${item.isToday ? 'bg-red-500' : 'bg-neutral-800'}`}
                >
                  {item.completed ? (
                    <CheckCircle2 size={20} color={item.isToday ? '#fff' : '#22c55e'} />
                  ) : (
                    <Clock size={20} color={item.isToday ? '#fff' : '#fff'} />
                  )}
                </View>
                <Text className="text-white text-sm font-poppins-medium">{item.day}</Text>
                <Text className="text-neutral-400 text-xs font-poppins-medium text-center">
                  {item.routineName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Body Parts Filter */}
        <View className="bg-neutral-900 rounded-3xl p-6 mb-6">
          <Text className="text-white text-xl font-poppins-semibold mb-4">Target Muscle Groups</Text>
          <View className="flex-row flex-wrap justify-between">
            {bodyParts.map((part, index) => (
              <BodyPartButton key={index} part={part} selectedBodyPart={selectedBodyPart} setSelectedBodyPart={setSelectedBodyPart} />
            ))}
          </View>
        </View>

        {/* Routines Section */}
        <View className="mb-5">
          <Text className="text-white text-2xl font-poppins-semibold mb-4">
            {selectedBodyPart === "All" ? "All Routines" : `${selectedBodyPart} Routines`}
          </Text>
          {filteredRoutines.map((routine, index) => (
            <RoutineCard key={index} routine={routine} />
          ))}
        </View>

        {/* Workout Streak Card */}
        <View className="bg-neutral-900 rounded-3xl py-5 px-6">
          <Text className="text-white text-xl font-poppins-semibold mb-3">Workout Streak</Text>
          <View className="flex-row items-center">
            <View className="bg-red-500/20 p-2 rounded-xl mr-3">
              <TrendingUp size={24} color="#FF3737" />
            </View>
            <View>
              <Text className="text-white text-2xl font-poppins-bold">5 days</Text>
              <Text className="text-neutral-400 text-sm font-poppins-medium">Keep pushing your limits! 💪</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleOpenBottomSheet}
        className="bg-white"
      >
        <Plus size={24} color="black" />
      </TouchableOpacity>

      <BotSheet ref={bottomSheetRef}>
        <KeyboardAvoidingView
          className="w-full mb-10"
          behavior={"padding"}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <ScrollView className="px-2" showsVerticalScrollIndicator={false}>
            <Text className="text-center text-white text-2xl font-poppins-semibold mb-2">Add New Routine</Text>

            {/* Routine Name */}
            <View className="mb-6">
              <Text className="text-white text-lg font-poppins-medium mb-2">Routine Name</Text>
              <Input
                value={newRoutine.name!}
                onChangeText={(text) => setNewRoutine((prev) => ({ ...prev, name: text }))}
                placeholder="Enter routine name"
                mode="outlined"
                keyboardType="default"
                focus={false}
              />
            </View>

            {/* Duration */}
            <View className="mb-6">
              <Text className="text-white text-lg font-poppins-medium mb-2">Duration (e.g., 45 min)</Text>
              <Input
                value={newRoutine.duration!}
                onChangeText={(text) => setNewRoutine((prev) => ({ ...prev, duration: text }))}
                placeholder="Enter duration"
                mode="outlined"
                keyboardType="numeric"
                focus={false}
              />
            </View>

            {/* Body Part Selection */}
            <View className="mb-6">
              <Text className="text-white text-lg font-poppins-medium mb-2">Target Body Part</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {bodyParts.map((part, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`mr-2 px-6 py-2 rounded-full ${newRoutine.bodyPart === part.name ? "bg-white" : "bg-neutral-800"}`}
                    onPress={() => setNewRoutine((prev) => ({ ...prev, bodyPart: part.name }))}
                  >
                    <Text className={`text-lg font-poppins-medium ${newRoutine.bodyPart === part.name ? "text-black" : "text-white"}`}>{part.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Exercises */}
            <View className="mb-6">
              <Text className="text-white text-lg font-poppins-medium mb-2">Exercises</Text>
              {newRoutine.exercises?.map((exercise, index) => (
                <View key={index} className="bg-neutral-800 p-5 rounded-3xl mb-2">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-white text-xl font-poppins-medium">Exercise {index + 1}</Text>
                    <TouchableOpacity onPress={() => handleRemoveExercise(index)} className="bg-red-500/20 p-2 rounded-xl">
                      <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <Input
                    value={exercise.name!}
                    onChangeText={(text) => handleExerciseChange(index, "name", text)}
                    placeholder="Enter exercise name"
                    mode="outlined"
                    keyboardType="default"
                    focus={false}
                  />
                  <View className="flex-row gap-3 mt-3">
                    <Input
                      value={exercise.sets.toString()}
                      onChangeText={(text) => handleExerciseChange(index, "sets", Number.parseInt(text) || 0)}
                      placeholder="Enter sets"
                      mode="outlined"
                      keyboardType="numeric"
                      focus={false}
                      moreStyles={{ width: '48%' }}
                    />
                    <Input
                      value={exercise.reps.toString()}
                      onChangeText={(text) => handleExerciseChange(index, "reps", Number.parseInt(text) || 0)}
                      placeholder="Enter reps"
                      mode="outlined"
                      keyboardType="numeric"
                      focus={false}
                      moreStyles={{ width: '48%' }}
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity
                onPress={handleAddExercise}
                className="bg-neutral-800 border border-white p-4 rounded-full items-center mt-2 flex-row justify-center"
              >
                <Plus size={20} color="white" className="mr-2" />
                <Text className="text-white text-lg font-poppins-semibold">Add Exercise</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} className="bg-white p-5 rounded-full items-center mb-8 flex-row justify-center gap-2">
              <Dumbbell size={20} color="black" />
              <Text className="text-black text-xl font-poppins-semibold">Create Routine</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </BotSheet>
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
  }
});

export default WorkoutRoutines