"use client"

import { useCallback, useMemo, useState, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Platform, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Avatar } from "react-native-paper"
import { Dumbbell, Play, ChevronRight, Zap } from "lucide-react-native"
import { MotiView } from "moti"
import { useAuth } from "@/context/auth"
import { router } from "expo-router"
import { suggestionVideos, Video } from "@/constants/data"
import YoutubePlayer from "react-native-youtube-iframe"
import BotSheet from "@/components/bot-sheet"
import BottomSheet from "@gorhom/bottom-sheet"

const { width } = Dimensions.get("window")
const VIDEO_WIDTH = width * 0.7
const VIDEO_HEIGHT = VIDEO_WIDTH * 0.6

interface GroupedVideos {
  module: string
  data: Video[]
}

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

  const renderVideoItem = ({ item: video, index }: { item: Video; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100 }}
      className="mr-4"
    >
      <TouchableOpacity 
        style={{ width: VIDEO_WIDTH }}
        onPress={() => openVideoSheet(video)}
      >
        <View className="mb-3">
          <Image
            source={{ uri: video.thumbnail }}
            style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT, borderRadius: 16 }}
            className="bg-neutral-800"
          />
          {video.difficulty && (
            <View className={`absolute bottom-2 right-2 ${
              video.difficulty === "Easy" ? "bg-green-500/90" : 
              video.difficulty === "Medium" ? "bg-blue-500/90" : 
              "bg-red-500/90"
            } px-2 py-1 rounded-md`}>
              <Text className="text-white text-xs font-poppins-medium">{video.difficulty}</Text>
            </View>
          )}
        </View>
        <Text className="text-white text-base font-poppins-medium mb-1">{video.title}</Text>
        <Text className="text-neutral-400 text-xs font-poppins">{video.module}</Text>
      </TouchableOpacity>
    </MotiView>
  )

  const renderModuleSection = ({ module, data }: GroupedVideos) => (
    <View key={module} className="mb-8">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-lg font-poppins-semibold">{module}</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )

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
          {groupedVideos.map((group) => renderModuleSection(group))}
        </View>
      </ScrollView>

      <BotSheet ref={bottomSheetRef} snapPoints={['70%']}>
        {selectedVideo && (
          <View className="w-full">
            <YoutubePlayer
              height={220}
              videoId={selectedVideo.videoId}
              onChangeState={onStateChange}
            />
            <View className="px-2">
              <Text className="text-white text-xl font-poppins-semibold mt-4 mb-2">
                {selectedVideo.title}
              </Text>
              <View className="flex-row mb-4">
                <View className="bg-blue-500/20 px-3 py-1 rounded-full mr-2">
                  <Text className="text-blue-500 font-poppins-medium">{selectedVideo.module}</Text>
                </View>
                {selectedVideo.difficulty && (
                  <View className={`px-3 py-1 rounded-full ${
                    selectedVideo.difficulty === "Easy" ? "bg-green-500/20" : 
                    selectedVideo.difficulty === "Medium" ? "bg-blue-500/20" : 
                    "bg-red-500/20"
                  }`}>
                    <Text className={`font-poppins-medium ${
                      selectedVideo.difficulty === "Easy" ? "text-green-500" : 
                      selectedVideo.difficulty === "Medium" ? "text-blue-500" : 
                      "text-red-500"
                    }`}>
                      {selectedVideo.difficulty}
                    </Text>
                  </View>
                )}
              </View>
              {selectedVideo.tips && (
                <View className="bg-neutral-800 rounded-xl p-4 mt-2">
                  <Text className="text-white font-poppins-semibold text-lg mb-2">Pro Tips</Text>
                  <Text className="text-gray-300 font-poppins">{selectedVideo.tips}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </BotSheet>
    </SafeAreaView>
  )
}

export default SuggestionsScreen

