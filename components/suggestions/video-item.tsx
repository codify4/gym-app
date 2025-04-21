import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { MotiView } from 'moti'
import { Video } from '@/constants/data'

const { width } = Dimensions.get("window")
const VIDEO_WIDTH = width * 0.7
const VIDEO_HEIGHT = VIDEO_WIDTH * 0.6

const VideoItem = ({ video, index, openVideoSheet }: { video: Video, index: number, openVideoSheet: (video: Video) => void }) => {
    return (
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
}

export default VideoItem