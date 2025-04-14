"use client"

import { useRef, useState, useEffect } from "react"
import { CirclePlus, GalleryVerticalEnd } from "lucide-react-native"
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
import { sendMessage as sendMessageToAI } from "@/lib/gemini-service"
import TypingIndicator from "@/components/chatbot/typing"
import PromptInput from "@/components/chatbot/prompt-input"
import MessageList from "@/components/chatbot/messages"
import HistorySheet from "@/components/chatbot/history-sheet"
import { useAuth } from "@/context/auth"
import { useChatHistory } from "@/hooks/use-chat"
import { addMessage } from "@/lib/chat-history"

const Chatbot = () => {
  const { session } = useAuth()
  const user = session?.user
  const userId = user?.id

  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Add local messages state for immediate display
  const [localMessages, setLocalMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  const bottomMargin = useRef(new Animated.Value(60)).current
  const scrollViewRef = useRef<ScrollView>(null)
  const contentTranslateX = useRef(new Animated.Value(0)).current
  const { width } = Dimensions.get("window")
  const sheetWidth = width * 0.8 // 80% of screen width

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

  // Get messages from current conversation or use local messages if no conversation exists
  const messages = currentConversation?.messages || localMessages

  // Update local messages when current conversation changes
  useEffect(() => {
    if (currentConversation?.messages) {
      setLocalMessages(currentConversation.messages)
    } else {
      setLocalMessages([])
    }
  }, [currentConversation])

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

  const handleSend = async () => {
    if (message.trim() === "" || isLoading) return

    const userMessage = message.trim()
    setMessage("") // Clear input immediately
    setIsLoading(true)

    // Immediately add user message to local state for display
    setLocalMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      let conversationId: string | undefined

      // If no current conversation, start a new one
      if (!currentConversation) {
        const newConversation = await startNewConversation(userMessage)

        if (!newConversation) {
          console.error("Failed to create new conversation")
          setIsLoading(false)
          Alert.alert("Error", "Failed to create new conversation")
          return
        }

        conversationId = newConversation.conversation_id
      } else {
        // Add user message to existing conversation
        await sendMessageToHistory(userMessage, "user")
        conversationId = currentConversation.conversation_id
      }

      // Scroll to bottom to show the user's message
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      }, 100)

      // Send message to AI
      const aiResponse = await sendMessageToAI(userMessage)

      // Add AI response to local messages for immediate display
      setLocalMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])

      // Add AI response to conversation in database
      if (conversationId && userId) {
        // Use the imported addMessage function directly instead of sendMessageToHistory
        const result = await addMessage(userId, conversationId, "assistant", aiResponse)
        console.log("Save result:", result ? "success" : "failed")

        // If we just created a new conversation or need to refresh, reload the conversation
        await loadConversation(conversationId)
      }
    } catch (error) {
      console.error("Error in chat:", error)

      const errorMessage = "Sorry, I encountered an error. Please try again."
      setLocalMessages((prev) => [...prev, { role: "assistant", content: errorMessage }])
    } finally {
      setIsLoading(false)
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
    setLocalMessages([])
    setIsHistoryOpen(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
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
              <Text className="text-white font-poppins-semibold text-lg">{currentConversation ? currentConversation.title.slice(0, 20) + "..." : "New Chat"}</Text>
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
            setMessage={setMessage}
            message={message}
            isLoading={isLoading}
            handleSend={handleSend}
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  )
}

export default Chatbot
