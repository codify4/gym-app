"use client"

import { useCallback, useMemo, useState, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, FlatList, Platform, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Avatar } from "react-native-paper"
import { Dumbbell, ChevronRight, Zap } from "lucide-react-native"
import { useAuth } from "@/context/auth"
import { router } from "expo-router"
import { suggestionVideos, Video } from "@/constants/data"
import BotSheet from "@/components/bot-sheet"
import BottomSheet from "@gorhom/bottom-sheet"
import VideoItem from "@/components/suggestions/video-item"
import VideoInfo from "@/components/suggestions/video-info"

const SuggestionsScreen = () => {
  const { session } = useAuth()
  const user = session?.user

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const bottomSheetRef = useRef<BottomSheet>(null)

  const onStateChange = useCallback((state: any) => {    
    if (state === "ended") {
      Alert.alert("Video has finished playing!")    
    }  
  }, [])

  const openVideoSheet = (video: Video) => {
    setSelectedVideo(video)
    bottomSheetRef.current?.expand()
  }

  // Group videos by module
  const groupedVideos = useMemo(() => {
    const groups: { [key: string]: Video[] } = {}
    suggestionVideos.forEach((video) => {
      if (!groups[video.module]) {
        groups[video.module] = []
      }
      groups[video.module].push(video)
    })
    return Object.entries(groups).map(([module, data]) => ({
      module,
      data,
    }))
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "ios" ? 60 : 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="mb-6">
          <TouchableOpacity
            className="flex-row justify-between items-center"
            onPress={() => router.push("/(tabs)/profile")}
          >
            <View className="flex-row items-center">
              <Avatar.Image
                size={45}
                source={{ uri: user?.user_metadata?.avatar_url }}
                className="bg-neutral-800 rounded-full"
              />
              <View className="ml-4">
                <Text className="text-white text-xl font-poppins-semibold">Workout Mate</Text>
                <Text className="text-neutral-400 text-base font-poppins-semibold">
                  Suggestions
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Common Topics Section */}
        <View className="mb-8">
          <View className="flex-row gap-4">
            <TouchableOpacity className="flex-1">
              <View className="bg-neutral-900 rounded-3xl p-4">
                <View className="bg-[#3b82f6]/20 self-start p-2 rounded-xl mb-3">
                  <Zap size={24} color="#3b82f6" />
                </View>
                <Text className="text-white text-lg font-poppins-medium mb-1">Quick HIIT</Text>
                <Text className="text-neutral-400 text-sm font-poppins mb-3">20-min workouts</Text>
                <ChevronRight size={20} color="#666" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1" onPress={() => router.push('/(tabs)/exercises')}>
              <View className="bg-neutral-900 rounded-3xl p-4">
                <View className="self-start bg-[#FF3737]/20 p-2 rounded-xl mb-3">
                  <Dumbbell size={24} color="#FF3737" />
                </View>
                <Text className="text-white text-lg font-poppins-medium mb-1">Exercise Library</Text>
                <Text className="text-neutral-400 text-sm font-poppins mb-3">Browse exercises</Text>
                <ChevronRight size={20} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Videos Sections */}
        <View>
          <View className="mb-4">
            <Text className="text-white text-2xl font-poppins-semibold">Suggestion Videos</Text>
            <Text className="text-neutral-400 text-sm font-poppins mt-1">
              {groupedVideos.length} Modules • {suggestionVideos.length} Videos
            </Text>
          </View>
          {groupedVideos.map((group) => (
            <View key={group.module} className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-lg font-poppins-semibold">{group.module}</Text>
              </View>
              <FlatList
                data={group.data}
                renderItem={({ item, index }) => <VideoItem video={item} index={index} openVideoSheet={openVideoSheet} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                />
            </View>
          ))}
        </View>
      </ScrollView>

      <BotSheet ref={bottomSheetRef} snapPoints={['70%']}>
        {selectedVideo && (
          <VideoInfo selectedVideo={selectedVideo} onStateChange={onStateChange} />
        )}
      </BotSheet>
    </SafeAreaView>
  )
}

export default SuggestionsScreen

