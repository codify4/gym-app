"use client"

import { useRef, useState, useEffect } from "react"
import { CirclePlus, GalleryVerticalEnd, Stars, Camera } from "lucide-react-native"
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
  Animated,
  KeyboardAvoidingView,
  Dimensions,
  type KeyboardEvent,
  Alert,
  Text,
} from "react-native"
import { useChat } from "@ai-sdk/react"
import { fetch as expoFetch } from "expo/fetch"
import { generateAPIUrl } from "@/utils/api"
import TypingIndicator from "@/components/chatbot/typing"
import PromptInput from "@/components/chatbot/prompt-input"
import MessageList from "@/components/chatbot/messages"
import HistorySheet from "@/components/chatbot/history-sheet"
import { useAuth } from "@/context/auth"
import { useChatHistory } from "@/hooks/use-chat"
import { addMessage } from "@/lib/chat-history"
import BotSheet from "@/components/bot-sheet"
import { router } from "expo-router"

const Chatbot = () => {
  const { session } = useAuth()
  const user = session?.user
  const userId = user?.id

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const bottomMargin = useRef(new Animated.Value(60)).current
  const scrollViewRef = useRef<ScrollView>(null)
  const captureSheetRef = useRef<any>(null)
  const contentTranslateX = useRef(new Animated.Value(0)).current
  const { width } = Dimensions.get("window")
  const sheetWidth = width * 0.8 // 80% of screen width

  // Use the AI SDK useChat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
    onError: (error) => console.error(error, "ERROR"),
    maxSteps: 5,
    onFinish: async (message) => {
      // Save AI response to chat history
      if (currentConversation?.conversation_id && userId) {
        await addMessage(userId, currentConversation.conversation_id, "assistant", message.content)
        await loadConversation(currentConversation.conversation_id)
      }
    },
  })

  // Use the chat history hook
  const {
    conversations,
    currentConversation,
    loading: historyLoading,
    startNewConversation,
    loadConversation,
    sendMessage: sendMessageToHistory,
    deleteChat,
    clearAllChats,
    setCurrentConversation,
  } = useChatHistory(userId)

  // Update messages when current conversation changes
  useEffect(() => {
    if (currentConversation?.messages) {
      // Convert chat history messages to AI SDK format
      const aiMessages = currentConversation.messages.map((msg) => ({
        id: Math.random().toString(),
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }))
      setMessages(aiMessages)
    } else {
      setMessages([])
    }
  }, [currentConversation, setMessages])

  // Handle history sheet open/close animation for main content
  useEffect(() => {
    const translateTo = isHistoryOpen ? sheetWidth : 0

    Animated.timing(contentTranslateX, {
      toValue: translateTo,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isHistoryOpen, sheetWidth])

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

  const handleSend = async (e?: any) => {
    if (input.trim() === "" || isLoading) return

    const userMessage = input.trim()

    try {
      let conversationId: string | undefined

      // If no current conversation, start a new one
      if (!currentConversation) {
        const newConversation = await startNewConversation(userMessage)

        if (!newConversation) {
          console.error("Failed to create new conversation")
          Alert.alert("Error", "Failed to create new conversation")
          return
        }

        conversationId = newConversation.conversation_id
      } else {
        // Add user message to existing conversation
        await sendMessageToHistory(userMessage, "user")
        conversationId = currentConversation.conversation_id
      }

      // Call the AI SDK handleSubmit
      handleSubmit(e)

      // Scroll to bottom to show the user's message
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 100)
    } catch (error) {
      console.error("Error in chat:", error)
      Alert.alert("Error", "Failed to send message")
    }
  }

  const handleSelectConversation = async (conversationId: string) => {
    const conversation = await loadConversation(conversationId)
    console.log("Loaded conversation with messages:", conversation?.messages?.length || 0)
    setIsHistoryOpen(false)
  }

  const handleNewChat = () => {
    console.log("Starting new chat")
    setCurrentConversation(null)
    setMessages([])
    setIsHistoryOpen(false)
  }

  const handleOpenCapture = () => {
    captureSheetRef.current?.snapToIndex(0)
  }

  const handleGoToCamera = () => {
    captureSheetRef.current?.close()
    router.push("/(tabs)/camera")
  }

  return (
    <SafeAreaView className={`flex-1 bg-black ${Platform.OS === "ios" ? "" : "pt-5"}`}>
      {/* History Sheet */}
      <HistorySheet
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteChat={deleteChat}
        onClearAllChats={clearAllChats}
        conversations={conversations}
        loading={historyLoading}
      />

      {/* Main Content */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: contentTranslateX }],
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
        >
          <View className="flex-row items-center justify-between px-5 pt-6 pb-3 w-full border-b border-neutral-800">
            <TouchableOpacity onPress={() => setIsHistoryOpen(true)}>
              <GalleryVerticalEnd size={24} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-white font-poppins-semibold text-lg">
                {currentConversation ? currentConversation.title.slice(0, 20) + "..." : "New Chat"}
              </Text>
            </View>
            <TouchableOpacity onPress={handleNewChat}>
              <CirclePlus size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            className="flex-1 w-full"
            contentContainerStyle={{
              paddingBottom: 20,
              paddingTop: 20,
              flexGrow: messages.length === 0 ? 0 : undefined,
              justifyContent: messages.length === 0 ? "center" : undefined,
            }}
          >
            <MessageList messages={messages} user={user} />
            {isLoading && <TypingIndicator />}
          </ScrollView>

          <PromptInput
            bottomMargin={bottomMargin}
            setMessage={(text) => handleInputChange({ target: { value: text } } as any)}
            message={input}
            isLoading={isLoading}
            handleSend={handleSend}
            onCapture={handleOpenCapture}
          />
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Capture Modal */}
      <BotSheet ref={captureSheetRef} snapPoints={["50%"]}>
        <View className="flex-1 w-full">
          <Text className="text-white font-poppins-semibold text-xl text-center mb-6">
            Correct your form with Mate
          </Text>
          
          <View className="bg-neutral-800 rounded-2xl p-6 mb-6">
            <Text className="text-white font-poppins-semibold text-lg mb-3">
              How to record
            </Text>
            <Text className="text-neutral-300 font-poppins-regular text-sm leading-6">
              /// While recording Mate will give u voice instructions.{'\n'}
              So use some type of headphones if u want.
            </Text>
          </View>

          <TouchableOpacity 
            className="bg-white py-5 rounded-full"
            onPress={handleGoToCamera}
          >
            <Text className="text-black font-poppins-semibold text-center text-lg">
              Start recording
            </Text>
          </TouchableOpacity>
        </View>
      </BotSheet>
    </SafeAreaView>
  )
}

export default Chatbot
