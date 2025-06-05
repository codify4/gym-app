'use client'

import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth'

const ProfileHeader = ({ tab }: { tab?: string }) => {
    const { session } = useAuth()
    const user = session?.user
    return (
        <View className="mb-6">
          <TouchableOpacity
            className="flex-row justify-between items-center"
            onPress={() => router.push("/(tabs)/profile")}
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: user?.user_metadata?.avatar_url }}
                resizeMode="contain"
                style={{ width: 45, height: 45 }}
                className="bg-neutral-800 rounded-full"
              />
              <View className="ml-4">
                <Text className="text-white text-xl font-poppins-semibold">Workout Mate</Text>
                <Text className="text-neutral-400 text-base font-poppins-semibold">
                  {tab}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
    )
}

export default ProfileHeader