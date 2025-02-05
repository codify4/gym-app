import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Avatar } from 'react-native-paper';
import { userProfile, dummyWorkouts, monthlyStats } from '@/constants/data';
import { Flame, Bell, PlayCircle } from 'lucide-react-native';
import WorkoutCard from '@/components/workout-card';

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mt-6 mb-8">
          <View className="flex-row items-center">
            <Avatar.Image size={48} source={{ uri: userProfile.avatar }} className="bg-white rounded-full" />
            <Text className="text-white text-2xl font-poppins-semibold ml-4">{userProfile.username}</Text>
          </View>
          <Bell size={24} color="white" />
        </View>

        <View className="bg-neutral-800 rounded-3xl mb-8">
          <View className="relative">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' }} 
              className="w-full h-48 rounded-t-3xl"
              resizeMode="cover"
            />
            <View className="absolute w-full h-full bg-black/30" />
            <View className="absolute bottom-4 right-4">
              <Text className="text-white text-3xl font-poppins-bold">Chest Day</Text>
              <Text className="text-white/80 text-base font-poppins-medium text-right">6 exercises</Text>
            </View>
          </View>
          <View className="p-6">
            <Text className="text-white text-2xl font-poppins-semibold mb-4">Today's Workout</Text>
            <TouchableOpacity className="bg-black rounded-full py-4">
              <View className="flex-row justify-center items-center">
                <Text className="text-white text-center text-xl font-poppins-semibold mr-2">Start workout</Text>
                <PlayCircle size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

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

        <View className="mb-8">
          <Text className="text-white text-2xl font-poppins-semibold mb-4">This Month</Text>
          <View className="flex-row justify-between">
            {monthlyStats.map((stat, index) => (
              <View key={index} className="flex items-center bg-neutral-800 rounded-3xl py-5 px-6 flex-1 mx-1.5">
                <Flame size={22} color="#ffffff99" className="mb-1" />
                <Text className="text-white/60 text-base font-poppins-medium mb-1">{stat.category}</Text>
                <Text className="text-white text-3xl font-poppins-bold">{stat.count}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;