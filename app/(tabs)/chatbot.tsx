"use client"

import { useRef, useState, useEffect } from "react"
import { router } from "expo-router"
import { BicepsFlexed, ChevronLeft, Dumbbell, GalleryVerticalEnd, Info, Send } from "lucide-react-native"
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  Animated,
  KeyboardAvoidingView,
  type KeyboardEvent,
} from "react-native"

const Chatbot = () => {
  const [message, setMessage] = useState("")
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

  const handleSend = () => {
    if (message.trim() === "") return

    // Handle sending message here
    console.log("Sending message:", message)
    setMessage("")

    // Scroll to bottom
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
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

        <ScrollView ref={scrollViewRef} className="flex-1 w-full" contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="px-5 w-full flex-col items-center justify-center mt-5">
            <Dumbbell size={100} color="white" style={{ transform: [{ rotate: "-45deg" }] }} />
            <Text className="text-white text-4xl font-poppins-bold mb-3">Mate</Text>
            <Text className="text-neutral-400 text-base font-poppins-semibold">Talk to Mate</Text>
          </View>

          <View className="w-full flex-row items-center justify-center gap-2 mt-5" style={{ paddingHorizontal: 20 }}>
            <View className="bg-neutral-900 rounded-3xl p-5 flex-col">
              <Info size={24} color="white" />
              <Text className="text-white text-base font-poppins">Give me a chest workout</Text>
            </View>
            <View className="bg-neutral-900 rounded-3xl p-5 flex-col">
              <BicepsFlexed size={24} color="white" />
              <Text className="text-white text-base font-poppins">Give me a bicep workout</Text>
            </View>
          </View>
        </ScrollView>

        <Animated.View
          className="py-4 flex-col items-center justify-center bg-neutral-900 border border-neutral-700"
          style={{
            marginBottom: bottomMargin,
            marginHorizontal: 20,
            paddingHorizontal: 16,
            borderRadius: 30,
            width: "95%",
            alignSelf: "center",
          }}
        >
          <TextInput
            placeholder="Ask a question..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            style={{
              width: "100%",
              height: 50,
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Regular",
            }}
          />
          <View className="items-end justify-end w-full">
            <TouchableOpacity
              className="bg-white rounded-full items-center justify-center"
              style={{ width: 60, height: 40 }}
              onPress={handleSend}
            >
              <Send size={24} color="black" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Chatbot