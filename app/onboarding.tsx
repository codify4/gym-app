"use client"

import { useState, useEffect } from "react"
import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native"
import Animated, { SlideInRight, SlideOutLeft, SlideInLeft, SlideOutRight } from "react-native-reanimated"
import { useRouter } from "expo-router"
import { OnboardingInput } from "../components/onboarding/onboarding-flow"
import { slides } from "@/constants/slides"
import { useAuth } from "@/context/auth"

interface OnboardingData {
  name: string
  birthDate: string
  measurements: string // Changed from separate height and weight
  goal: string
  min: string
  max: string
  frequency: string
  experience: string
}

type SlideType = "text" | "choice" | "date" | "number" | "measurement"
export interface Slide {
  type: SlideType
  title: string
  field: keyof OnboardingData
  placeholder?: string
  choices?: string[]
  min?: number
  max?: number
  validation: (value: string) => boolean
}

const Onboarding = () => {
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">("forward")
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    birthDate: "",
    measurements: "",
    goal: "",
    frequency: "",
    experience: "",
    min: (0).toString(),
    max: (999).toString(),
  })
  const router = useRouter()
  const { session } = useAuth()
  const keyboardVerticalOffset = Platform.OS === "ios" ? 50 : 0

  // If we already have a session, redirect to home
  useEffect(() => {
    if (session) {
      router.replace("/(tabs)/home")
    }
  }, [session, router]) // Added router to dependencies

  const currentSlide = slides[step]
  const currentValue = formData[currentSlide.field]
  const isValidInput = currentSlide.validation(currentValue)

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentSlide.field]: value,
    }))
  }

  const nextStep = () => {
    if (!isValidInput || isAnimating) return

    if (step < slides.length - 1) {
      setSlideDirection("forward")
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      // When onboarding is complete, go to sign in
      router.push("/signin")
    }
  }

  const prevStep = () => {
    if (isAnimating || step === 0) return

    setSlideDirection("backward")
    setIsAnimating(true)
    setTimeout(() => {
      setStep(step - 1)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={"padding"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View className="flex-1 px-6 pt-20">
        {/* Progress Indicator */}
        <View className="h-1.5 bg-neutral-700 rounded-full overflow-hidden mb-12">
          <View className="h-full bg-white rounded-full" style={{ width: `${((step + 1) / slides.length) * 100}%` }} />
        </View>

        {/* Question and Input */}
        <Animated.View
          key={step}
          entering={slideDirection === "forward" ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
          exiting={slideDirection === "forward" ? SlideOutLeft.duration(300) : SlideOutRight.duration(300)}
          className="flex-1"
        >
          <View className="flex-1 space-y-8 mt-32">
            <Text className="text-white text-4xl tracking-wider mb-3 font-poppins-semibold">{currentSlide.title}</Text>

            <OnboardingInput slide={currentSlide} value={currentValue} onChangeText={handleInputChange} />
          </View>
        </Animated.View>

        {/* Buttons */}
        <View className="mb-12 gap-4">
          <TouchableOpacity
            onPress={nextStep}
            className={`py-4 rounded-full w-full items-center ${
              isValidInput && !isAnimating ? "bg-white" : "bg-neutral-700"
            }`}
            disabled={!isValidInput || isAnimating}
          >
            <Text
              className={`text-xl font-poppins-semibold ${
                isValidInput && !isAnimating ? "text-black" : "text-neutral-400"
              }`}
            >
              {step === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>

          {step > 0 && (
            <TouchableOpacity
              onPress={prevStep}
              className={`py-4 rounded-full w-full items-center 
                border border-neutral-600 bg-neutral-800/50`}
              disabled={isAnimating}
            >
              <Text className="text-lg text-white font-poppins-semibold">Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Onboarding