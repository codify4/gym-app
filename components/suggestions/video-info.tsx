import { View, Text } from 'react-native'
import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe"

const VideoInfo = ({ selectedVideo, onStateChange }: { selectedVideo: any, onStateChange: any }) => {
    return (
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
    )
}

export default VideoInfo