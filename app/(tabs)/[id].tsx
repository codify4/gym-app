import React, { useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { routines } from '@/constants/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Clock, Dumbbell, Flame, PlayCircle } from 'lucide-react-native';
import BotSheet from '@/components/bot-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions'
import * as Haptics from 'expo-haptics';

const RoutineDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const routine = routines.find(r => r.id === id);

  const windowHeight = Dimensions.get("window").height;

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
              source={{ uri: routine.image }} 
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
                      <Text className="text-neutral-400 font-poppins">320 kcal</Text>
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
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: index * 100, type: 'timing', duration: 500 }}
                >
                  <MotiPressable
                    onPress={handleOpenBottomSheet}
                    animate={({ pressed }) => {
                      'worklet';
                      return {
                        scale: pressed ? 0.98 : 1,
                        opacity: pressed ? 0.9 : 1,
                      };
                    }}
                    transition={{ type: 'timing', duration: 150 }}
                    style={{ marginBottom: 15, borderRadius: 30 }}
                  >
                    <LinearGradient
                      colors={['#2A2A2A', '#1A1A1A']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="p-[1px] mb-3"
                      style={{ borderRadius: 24 }}
                    >
                      <MotiView
                        className="flex-row items-center rounded-3xl py-4 px-4 pl-6"
                        animate={{ opacity: 1 }}
                        from={{ opacity: 0 }}
                        transition={{
                          type: 'timing',
                          duration: 500,
                          delay: index * 100,
                        }}
                      >
                        <View className="flex-row justify-between items-center">
                          <View className="flex-1 gap-1">
                            <Text className="text-white text-xl font-poppins-medium mb-1">
                              {exercise.name}
                            </Text>
                            <View className="flex-row items-center gap-2">
                              <LinearGradient
                                colors={['#3A3A3A', '#2A2A2A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="p-[1px] mr-2"
                                style={{ borderRadius: 20 }}
                              >
                                <View className="bg-white/60 rounded-lg px-3 py-0.5">
                                  <Text className="text-black font-poppins-semibold">
                                    {exercise.sets} sets
                                  </Text>
                                </View>
                              </LinearGradient>
                              <LinearGradient
                                colors={['#3A3A3A', '#2A2A2A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="p-[1px]"
                                style={{ borderRadius: 20 }}
                              >
                                <View className="bg-white/60 rounded-lg px-3 py-0.5">
                                  <Text className="text-black font-poppins-semibold">
                                    {exercise.sets} sets
                                  </Text>
                                </View>
                              </LinearGradient>
                            </View>
                          </View>
                          <Image 
                            source={exercise.image} 
                            style={{ width: 80, height: 80 }} 
                            resizeMode='contain'
                          />
                        </View>
                      </MotiView>
                    </LinearGradient>
                  </MotiPressable>
                </MotiView>
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
  },
  exerciseButton: {
    marginBottom: 12,
  }
});

export default RoutineDetailScreen;