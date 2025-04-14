"use client"

import { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native"
import { ChevronLeft, Plus, Search, Trash2, X } from "lucide-react-native"
import type { ChatConversation } from "@/lib/chat-history"

type HistorySheetProps = {
  isOpen: boolean
  onClose: () => void
  onSelectConversation: (conversationId: string) => void
  onNewChat: () => void
  onDeleteChat: (conversationId: string) => Promise<boolean>
  onClearAllChats: () => Promise<boolean>
  conversations: ChatConversation[]
  loading: boolean
}

const HistorySheet = ({
  isOpen,
  onClose,
  onSelectConversation,
  onNewChat,
  onDeleteChat,
  onClearAllChats,
  conversations,
  loading,
}: HistorySheetProps) => {
  const { width } = Dimensions.get("window")
  const sheetWidth = width * 0.8
  const translateX = useRef(new Animated.Value(-sheetWidth)).current
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -sheetWidth,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isOpen, sheetWidth])

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
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

  const handleDeleteChat = (conversationId: string) => {
    Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await onDeleteChat(conversationId)
          if (!success) {
            Alert.alert("Error", "Failed to delete conversation")
          }
        },
      },
    ])
  }

  const handleClearAllChats = () => {
    Alert.alert(
      "Clear All Conversations",
      "Are you sure you want to delete all conversations? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const success = await onClearAllChats()
            if (!success) {
              Alert.alert("Error", "Failed to clear conversations")
            }
          },
        },
      ],
    )
  }

  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? conversations.filter(
        (conv) =>
          conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.messages?.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : conversations

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
          onPress={onNewChat}
        >
          <Plus size={18} color="black" />
          <Text className="text-black font-poppins-semibold ml-2">New Chat</Text>
        </TouchableOpacity>

        {/* Conversation List */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <ScrollView className="flex-1">
            {filteredConversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.conversation_id}
                className="mb-2 mx-3 px-4 py-3 rounded-2xl bg-neutral-800 active:bg-neutral-700"
                onPress={() => onSelectConversation(conversation.conversation_id)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-2">
                    <Text className="text-white font-poppins-medium" numberOfLines={1}>
                      {conversation.title}
                    </Text>
                    <Text className="text-neutral-400 text-sm font-poppins mt-1" numberOfLines={1}>
                      {conversation.messages?.[conversation.messages.length - 1]?.content || ""}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-neutral-500 text-xs font-poppins mr-2">
                      {formatTimestamp(conversation.updated_at)}
                    </Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(conversation.conversation_id)
                      }}
                    >
                      <Trash2 size={14} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Footer */}
        <View className="px-4 py-4 border-t border-neutral-800 mb-24">
          <TouchableOpacity className="flex-row items-center py-2" onPress={handleClearAllChats}>
            <Trash2 size={16} color="#ff4d4f" />
            <Text className="text-[#ff4d4f] font-poppins ml-2">Clear conversation history</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

export default HistorySheet