"use client"

import { useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, Animated, ScrollView, Dimensions } from "react-native"
import { ChevronLeft, GalleryVerticalEnd, Plus, Search, Trash2, X } from "lucide-react-native"

// Mock data for conversation history
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    title: "Beginner Workout Plan",
    preview: "Can you suggest a beginner workout plan?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2",
    title: "Protein Intake Calculation",
    preview: "How much protein should I consume daily?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    title: "Recovery After Leg Day",
    preview: "What's the best way to recover after leg day?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "4",
    title: "Cardio vs Weight Training",
    preview: "Which is better for weight loss?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "5",
    title: "Pre-Workout Nutrition",
    preview: "What should I eat before working out?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
]

type HistorySheetProps = {
  isOpen: boolean
  onClose: () => void
  onSelectConversation?: (conversationId: string) => void
}

const HistorySheet = ({ isOpen, onClose, onSelectConversation }: HistorySheetProps) => {
  const { width } = Dimensions.get("window")
  const sheetWidth = width * 0.8 // 80% of screen width
  const translateX = useRef(new Animated.Value(-sheetWidth)).current

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -sheetWidth,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isOpen, sheetWidth])

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: sheetWidth,
        backgroundColor: "#111",
        borderRightWidth: 1,
        borderRightColor: "#333",
        transform: [{ translateX }],
        zIndex: 100,
      }}
    >
      <View className="flex-1 pt-16">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-4">
          <Text className="text-white text-2xl font-poppins-semibold">Chat History</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* New Chat Button */}
        <TouchableOpacity
          className="mx-4 my-3 py-4 px-4 bg-white rounded-full flex-row items-center"
          onPress={() => {
            onClose()
            // Logic for new chat will be added later
          }}
        >
          <Plus size={18} color="black" />
          <Text className="text-black font-poppins-semibold ml-2">New Chat</Text>
        </TouchableOpacity>

        {/* Conversation List */}
        <ScrollView className="flex-1">
          {MOCK_CONVERSATIONS.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              className="mb-2 mx-3 px-4 py-3 rounded-2xl bg-neutral-800 active:bg-neutral-700"
              onPress={() => onSelectConversation?.(conversation.id)}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                  <Text className="text-white font-poppins-medium" numberOfLines={1}>
                    {conversation.title}
                  </Text>
                  <Text className="text-neutral-400 text-sm font-poppins mt-1" numberOfLines={1}>
                    {conversation.preview}
                  </Text>
                </View>
                <Text className="text-neutral-500 text-xs font-poppins">{formatTimestamp(conversation.timestamp)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View className="px-4 py-4 border-t border-neutral-800 mb-24">
          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={() => {
              // Clear history logic will be added later
            }}
          >
            <Trash2 size={16} color="#ff4d4f" />
            <Text className="text-[#ff4d4f] font-poppins ml-2">Clear conversation history</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

export default HistorySheet