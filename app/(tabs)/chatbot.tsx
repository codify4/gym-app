"use client"

import { useRef, useState, useEffect } from "react"
import { router } from "expo-router"
import { Brain, ChevronLeft, Dumbbell, GalleryVerticalEnd } from "lucide-react-native"
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
  Animated,
  KeyboardAvoidingView,
  type KeyboardEvent
} from "react-native"
import { sendMessage, type ChatMessage } from "@/lib/gemini-service"
import TypingIndicator from "@/components/chatbot/typing"
import PromptInput from "@/components/chatbot/prompt-input"
import { useAuth } from "@/context/auth"
import MessageList from "@/components/chatbot/messages"

const Chatbot = () => {
  const { session } = useAuth()
  const user = session?.user
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const bottomMargin = useRef(new Animated.Value(60)).current
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Function to animate the bottom margin
    const keyboardWillShow = (event: KeyboardEvent) => {
      Animated.timing(bottomMargin, {
        toValue: Platform.OS === "ios" ? 10 : 0,
        duration: event?.duration || 250,
        useNativeDriver: false,
      }).start()
    }

    const keyboardWillHide = (event: KeyboardEvent) => {
      Animated.timing(bottomMargin, {
        toValue: 60, // Tab bar height
        duration: event?.duration || 250,
        useNativeDriver: false,
      }).start()
    }

    // Set up listeners based on platform
    const keyboardShowListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", keyboardWillShow)
        : Keyboard.addListener("keyboardDidShow", keyboardWillShow)

    const keyboardHideListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", keyboardWillHide)
        : Keyboard.addListener("keyboardDidHide", keyboardWillHide)

    // Clean up listeners
    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  useEffect(() => {
    // Also scroll when the typing indicator appears or disappears
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [isLoading])

  const handleSend = async () => {
    if (message.trim() === "" || isLoading) return

    const userMessage = message.trim()
    setMessage("") // Clear input immediately

    // Add user message to chat immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // Set loading state
    setIsLoading(true)

    // Scroll to bottom to show the user's message
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
    }, 100)

    try {
      // Send message and get response
      const response = await sendMessage(userMessage)

      // Add assistant response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error in chat:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="flex-row items-center justify-between px-5 py-6 w-full">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <GalleryVerticalEnd size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 w-full"
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: messages.length === 0 ? 0 : undefined,
            justifyContent: messages.length === 0 ? "center" : undefined,
          }}
        >
          <MessageList messages={messages} user={user} />
          {isLoading && <TypingIndicator />}
        </ScrollView>

        <PromptInput
          bottomMargin={bottomMargin}
          setMessage={setMessage}
          message={message}
          isLoading={isLoading}
          handleSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Chatbot