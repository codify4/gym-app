"use client"

import { useCallback, useMemo, useState, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, FlatList, Platform, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Dumbbell, ChevronRight } from "lucide-react-native"
import { router } from "expo-router"
import { suggestionVideos, Video } from "@/constants/data"
import BotSheet from "@/components/bot-sheet"
import BottomSheet from "@gorhom/bottom-sheet"
import VideoItem from "@/components/suggestions/video-item"
import VideoInfo from "@/components/suggestions/video-info"
import ProfileHeader from "@/components/profile-header"

const SuggestionsScreen = () => {
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
        <ProfileHeader tab="Suggestions" />

        {/* Common Topics Section */}
        <View className="mb-8">
          <TouchableOpacity onPress={() => router.push('/(tabs)/exercises')}>
            <View className="bg-neutral-900 rounded-3xl p-5">
              <View className="flex-row items-center justify-between px-2">
                <View>
                  <View className="self-start bg-[#FF3737]/20 p-3 rounded-xl mb-3">
                    <Dumbbell size={24} color="#FF3737" />
                  </View>
                  <Text className="text-white text-xl font-poppins-semibold mb-1">Exercise Library</Text>
                  <Text className="text-neutral-400 text-base font-poppins mb-1">
                    Browse and discover new exercises for your workouts
                  </Text>
                </View>
                <ChevronRight size={24} color="#666" />
              </View>
            </View>
          </TouchableOpacity>
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

