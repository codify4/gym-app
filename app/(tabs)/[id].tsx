import React, { useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { routines } from '@/constants/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Clock, Dumbbell, Flame, PlayCircle } from 'lucide-react-native';
import BotSheet from '@/components/bot-sheet';
import BottomSheet from '@gorhom/bottom-sheet';

const RoutineDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const routine = routines.find(r => r.id === id);

  const windowHeight = Dimensions.get("window").height;

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  if (!routine) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <Text className="text-white text-lg text-center mt-5">Routine not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' }} 
              className='size-full' 
              resizeMode='cover'
            />
            <View className="absolute inset-0 bg-black/40" />
        </View>

        <View className="absolute top-0 left-0 right-0 m-3">
          <TouchableOpacity
              onPress={() => router.push('/(tabs)/routine')}
              className="flex flex-row size-11 items-center justify-center bg-black/60 rounded-full"
          >
              <ChevronLeft className="size-7" color={'#ffffff'}/>
          </TouchableOpacity>
        </View>

        {/* Content Container with rounded corners */}
        <View className='-mt-8 bg-neutral-900 rounded-t-[32px]'>
          <View className='bg-neutral-900 rounded-t-[32px] overflow-hidden'>
            {/* Routine Info Card */}
            <View className="px-6 pt-8 pb-6">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 gap-2">
                  <Text className="text-white text-3xl font-poppins-semibold mb-2">{routine.name}</Text>
                  <View className="flex-row items-center flex-wrap gap-4">
                    <View className="flex-row items-center gap-2">
                      <Dumbbell size={16} color="#888" />
                      <Text className="text-neutral-400 font-poppins">{routine.exercises.length} exercises</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Clock size={16} color="#888" />
                      <Text className="text-neutral-400 font-poppins">{routine.duration}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Flame size={16} color="#FF3737" />
                      <Text className="text-neutral-400 font-poppins">~320 kcal</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Exercises List */}
            <View className="px-5 pb-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-2xl font-poppins-semibold">Exercises</Text>
              </View>

              {routine.exercises.map((exercise, index) => (
                <TouchableOpacity 
                  key={index} 
                  className="bg-neutral-800 rounded-2xl py-5 px-4 mb-3"
                  onPress={handleOpenBottomSheet}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-white text-xl font-poppins-medium mb-1">
                        {exercise.name}
                      </Text>
                      <View className="flex-row items-center">
                        <View className="bg-neutral-700/50 rounded-lg px-3 py-1 mr-2">
                          <Text className="text-neutral-300 font-poppins">
                            {exercise.sets} sets
                          </Text>
                        </View>
                        <View className="bg-neutral-700/50 rounded-lg px-3 py-1">
                          <Text className="text-neutral-300 font-poppins">
                            {exercise.reps} reps
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="bg-red-500/10 p-2 rounded-xl">
                      <Dumbbell size={20} color="#FF3737" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingButton} className="bg-white">
        <View className="flex-row justify-center items-center">
            <Text className="text-black text-center text-xl font-poppins-semibold mr-2">Start workout</Text>
            <PlayCircle size={24} color="black" />
        </View>
      </TouchableOpacity>

      <BotSheet ref={bottomSheetRef}>
        <Text className="text-white text-lg font-poppins-semibold">{routine.exercises[0].name}</Text>
      </BotSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    width: '90%',
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 88,
    right: 22,
  }
});

export default RoutineDetailScreen;