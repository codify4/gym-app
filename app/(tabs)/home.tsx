import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Avatar } from 'react-native-paper';
import { userProfile, dummyWorkouts, monthlyStats, Workout, Exercise } from '@/constants/data';

const WorkoutCard = ({ workout }: { workout: Workout }) => (
  <View className="bg-neutral-700 rounded-2xl p-4 mr-4 w-80">
    <Text className='font-poppins-semibold text-white text-3xl mb-3'>{workout.title}</Text>
    {workout.exercises.map((exercise, exerciseIndex) => (
      <View key={exerciseIndex} className="flex-row justify-between items-center w-full bg-neutral-800 rounded-xl py-3 px-4 mb-2">
        <Text className="text-white text-xl font-poppins-medium">{exercise.name}</Text>
        <Text className="text-white text-xl font-poppins-medium">{exercise.sets}</Text>
      </View>
    ))}
  </View>
);

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <ScrollView className="flex-1 px-6">
        {/* User Profile */}
        <View className="flex-row items-center mt-6 mb-8">
          <Avatar.Image size={48} source={{ uri: userProfile.avatar }} className="bg-white rounded-full" />
          <Text className="text-white text-2xl font-poppins-semibold ml-4">{userProfile.username}</Text>
        </View>

        {/* Today's Workout Card */}
        <View className="bg-neutral-800 rounded-3xl mb-8">
          <View className="relative">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' }} 
              className="w-full h-48 rounded-t-3xl"
              resizeMode="cover"
            />
            <Text className="absolute bottom-4 right-4 text-white text-3xl font-poppins-bold">Chest</Text>
          </View>
          <View className="p-6">
            <Text className="text-white text-2xl font-poppins-semibold mb-4">Today's Workout</Text>
            <TouchableOpacity className="bg-black rounded-full py-4">
              <Text className="text-white text-center text-lg font-poppins-semibold">Start workout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Workouts Section */}
        <View className="mb-8 bg-neutral-800 rounded-3xl p-6">
          <Text className="text-white text-4xl font-poppins-bold mb-4">My Workouts</Text>
          <FlatList
            data={dummyWorkouts}
            renderItem={({ item }) => <WorkoutCard workout={item} />}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName='flex gap-5 w-full'
          />
        </View>

        {/* This Month Stats */}
        <View className="mb-8">
          <Text className="text-white text-2xl font-poppins-semibold mb-4">This Month</Text>
          <View className="flex-row justify-between">
            {monthlyStats.map((stat, index) => (
              <View key={index} className="bg-neutral-800 rounded-3xl py-6 px-4 flex-1 mx-1.5 items-center">
                <Text className="text-white text-4xl font-poppins-bold mb-1">{stat.count}</Text>
                <Text className="text-white text-lg font-poppins-medium">{stat.category}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;