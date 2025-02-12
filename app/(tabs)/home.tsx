import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, FlatList, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
import { dummyWorkouts, monthlyStats } from '@/constants/data';
import { Bell } from 'lucide-react-native';
import WorkoutCard from '@/components/workout-card';
import WorkoutStreak from '@/components/statistics';
import TodayWorkout from '@/components/today-workout';
import { useAuth } from '@/context/auth';
import { router } from 'expo-router';
import Statistics from '@/components/statistics';

const Home = () => {
  const { session } = useAuth();
  const user = session?.user;
  const platform = Platform.OS;

  return (
    <SafeAreaView className={`flex-1 bg-neutral-900 ${platform === 'ios' ? '' : 'pt-5'}`}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mt-6 mb-8">
          <TouchableOpacity className="flex-row items-center" onPress={() => router.push('/(tabs)/profile')}>
            <Avatar.Image size={45} source={{ uri: user?.user_metadata?.avatar_url }} className="bg-white rounded-full" />
            <Text className="text-white text-2xl font-poppins-semibold ml-4">{user?.user_metadata?.full_name || 'User'}</Text>
          </TouchableOpacity>
          <Bell size={24} color="white" />
        </View>

        <TodayWorkout />

        <View className="mb-8 bg-neutral-800 rounded-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-4xl font-poppins-bold">My Workouts</Text>
          </View>
          <FlatList
            data={dummyWorkouts}
            renderItem={({ item }) => <WorkoutCard workout={item} />}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerClassName='flex items-center justify-center pl-[5.5px]'
          />
        </View>

        <Statistics stats={monthlyStats} title="This Month" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;