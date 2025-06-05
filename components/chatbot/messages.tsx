import React from "react"
import { View, Text, Image } from "react-native"
import { Brain } from "lucide-react-native"
import type { Message } from "ai"

type MessageListProps = {
  messages: Message[]
  user: any
}

const MessageList = ({ messages, user }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <View className="px-5 w-full flex-col items-center justify-center">
        <Brain size={100} color="white" />
        <Text className="text-white text-4xl font-poppins-bold mb-3 mt-3">Mate</Text>
        <Text className="text-neutral-400 text-base font-poppins-semibold">Talk to Mate</Text>
        <Text className="text-neutral-500 text-base font-poppins mt-4 text-center">
          Ask me anything about workouts, nutrition, or fitness goals. I'm here to help!
        </Text>
      </View>
    )
  }

  return (
    <>
      {messages.map((msg, index) => (
        <View
          key={msg.id || index}
          className={`flex-row items-start my-1 ${msg.role === "user" ? "justify-end pr-2" : "justify-start pl-2"}`}
        >
          {/* AI Avatar (only for assistant messages) */}
          {msg.role !== "user" && (
            <View className="size-8 bg-black rounded-full items-center justify-center mr-2">
              <Brain size={24} color="white" />
            </View>
          )}

          {/* Message Bubble */}
          <View
            className={`px-4 py-3 ${
              msg.role === "user" ? "bg-white rounded-2xl mr-2 max-w-[70%]" : "bg-neutral-800 rounded-3xl max-w-[70%]"
            }`}
          >
            <Text
              className={
                msg.role === "user" ? "text-black text-base font-poppins" : "text-white text-base font-poppins"
              }
            >
              {msg.content}
            </Text>
          </View>

          {/* User Avatar (only for user messages) */}
          {msg.role === "user" && (
            <View className="size-8 mt-1 rounded-full overflow-hidden">
              <Image
                source={{ uri: user?.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=Me" }}
                className="size-8"
              />
            </View>
          )}
        </View>
      ))}
    </>
  )
}

export default MessageList
