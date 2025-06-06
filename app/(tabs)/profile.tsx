"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native"
import { useAuth } from "@/context/auth"
import { Settings, Lock, Bell, ChevronRight, LogOut, Ruler, Weight, User } from "lucide-react-native"
import { router } from "expo-router"
import { signOut } from "@/lib/auth-lib"
import Animated, { SlideInRight } from "react-native-reanimated"
import * as Haptics from "expo-haptics"
import { supabase } from "@/lib/supabase"
import UserInfo from "@/components/profile/user-info"
import BotSheet from "@/components/bot-sheet"
import type BottomSheet from "@gorhom/bottom-sheet"
import HeightPicker from "@/components/profile/height-picker"
import WeightPicker from "@/components/profile/weight-picker"
import UnitPicker from "@/components/unit-picker"
import { useUnits } from "@/context/units-context"
import type { DistanceUnit, WeightUnit, BodyUnit } from "@/context/units-context"

const Profile = () => {
  const { session } = useAuth()
  const user = session?.user
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const platform = Platform.OS
  const [loading, setLoading] = useState(true)
  const [selectedStat, setSelectedStat] = useState<string | null>(null)
  const [onboardingDataId, setOnboardingDataId] = useState<number | null>(null)
  const [userData, setUserData] = useState({
    height: 170,
    weight: 70,
    age: 25,
  })

  // Get units from context
  const {
    distanceUnit,
    weightUnit,
    heightUnit,
    setDistanceUnit,
    setWeightUnit,
    setHeightUnit,
    formatWeight,
    formatHeight,
    bodyUnit,
    setBodyUnit,
  } = useUnits()

  // Bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null)
  const handleOpenBottomSheet = (statLabel: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    setSelectedStat(statLabel)
    bottomSheetRef.current?.expand()
  }

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close()
  }

  // State for user stats
  const [stats, setStats] = useState([
    { label: "Height", value: "---" },
    { label: "Weight", value: "---" },
    { label: "Age", value: "---" },
  ])

  // Fetch user data on component mount
  async function fetchUserData() {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("Fetching user data for profile:", user.id)

      const { data: userInfoData, error: userInfoError } = await supabase
        .from("user_info")
        .select("onboarding_data_id")
        .eq("id", user.id)
        .maybeSingle()

      console.log("Auth user ID:", user?.id)
      console.log("Fetched user_info row:", userInfoData)

      if (userInfoError) {
        console.error("Error fetching user info:", userInfoError)
        setLoading(false)
        return
      }

      if (!userInfoData) {
        console.log("No user_info row found for user:", user.id)
        setLoading(false)
        return
      }

      const onboardingDataId = userInfoData.onboarding_data_id
      setOnboardingDataId(onboardingDataId)

      if (!onboardingDataId) {
        console.log("No onboarding_data_id associated with this user.")
        setLoading(false)
        return
      }

      // 2. Fetch actual onboarding data
      const { data: onboardingData, error: onboardingError } = await supabase
        .from("onboarding_data")
        .select("*")
        .eq("onboarding_data_id", onboardingDataId)
        .maybeSingle()

      if (onboardingError) {
        console.error("Error fetching onboarding data:", onboardingError)
        setLoading(false)
        return
      }

      if (!onboardingData) {
        console.log("No onboarding data found for ID:", onboardingDataId)
        setLoading(false)
        return
      }

      // 3. Update UI and store raw data
      setUserData({
        height: onboardingData.height,
        weight: onboardingData.weight,
        age: onboardingData.age,
      })

      // Format the values using the unit context
      setStats([
        { label: "Height", value: formatHeight(onboardingData.height) },
        { label: "Weight", value: formatWeight(onboardingData.weight) },
        { label: "Age", value: `${onboardingData.age}` },
      ])
    } catch (error) {
      console.error("Unexpected error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Update stats when units change
  useEffect(() => {
    if (userData) {
      setStats([
        { label: "Height", value: formatHeight(userData.height) },
        { label: "Weight", value: formatWeight(userData.weight) },
        { label: "Age", value: `${userData.age}` },
      ])
    }
  }, [weightUnit, heightUnit, userData])

  useEffect(() => {
    fetchUserData()
  }, [user?.id])

  const menuItems = [
    {
      title: "Notifications",
      icon: Bell,
      rightElement: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "#767577", true: "#4ade80" }}
        />
      ),
    },
    {
      title: "Other",
      items: [
        { title: "Privacy Policy", icon: Lock, path: "/(tabs)/(settings)/privacy-policies" as const },
        { title: "Terms and Services", icon: Lock, path: "/(tabs)/(settings)/terms-and-services" as const }
      ],
    },
  ]

  const handleLogout = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      await signOut()
      router.replace("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Render the appropriate picker based on the selected stat
  const renderPicker = () => {
    if (!user?.id || onboardingDataId === null) {
      return (
        <View className="p-6 items-center">
          <Text className="text-white text-lg">User data not available</Text>
        </View>
      )
    }

    switch (selectedStat) {
      case "Height":
        return (
          <HeightPicker
            userId={user.id}
            onboardingDataId={onboardingDataId}
            initialHeight={userData.height}
            onClose={handleCloseBottomSheet}
            onUpdate={fetchUserData}
          />
        )
      case "Weight":
        return (
          <WeightPicker
            userId={user.id}
            onboardingDataId={onboardingDataId}
            initialWeight={userData.weight}
            onClose={handleCloseBottomSheet}
            onUpdate={fetchUserData}
          />
        )
      case "Age":
        return (
          <View className="p-6 items-center">
            <Text className="text-white text-xl font-poppins-semibold">Age</Text>
            <Text className="text-neutral-400 text-base mt-2">Age cannot be modified</Text>
          </View>
        )
      default:
        return (
          <View className="p-6 items-center">
            <Text className="text-white text-lg">Select a stat to edit</Text>
          </View>
        )
    }
  }

  return (
    <SafeAreaView className={`flex-1 bg-black ${platform === "ios" ? "" : "pt-5"}`}>
      <Animated.View className={`flex-1 bg-black pt-7`} entering={SlideInRight}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: platform === "ios" ? 60 : 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View className="flex items-center justify-center gap-5 mt-8 mb-6">
            <Image
              source={{ uri: user?.user_metadata?.avatar_url }}
              resizeMode="contain"
              style={{ width: 150, height: 150 }}
              className="bg-white rounded-full mb-4"
            />
            <Text className="text-white text-4xl font-poppins-bold">{user?.user_metadata?.full_name || "User"}</Text>
          </View>

          {/* Stats */}
          <View className="flex flex-row items-center justify-between mb-8 w-full">
            {loading ? (
              <View className="bg-neutral-900 rounded-2xl px-6 py-6 w-full items-center">
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-neutral-400 text-base mt-2">Loading stats...</Text>
              </View>
            ) : (
              stats.map((stat, index) => (
                <UserInfo
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  handleOpenBottomSheet={() => handleOpenBottomSheet(stat.label)}
                  editable={stat.label !== "Age"}
                />
              ))
            )}
          </View>

          {/* Units */}
          <View className="mb-6">
            <Text className="text-white text-2xl font-poppins-semibold mb-4">Units</Text>
            <View className="flex-col justify-center">
              <UnitPicker
                title="Distance"
                icon={Ruler}
                options={[
                  { label: "Kilometers", value: "km" },
                  { label: "Miles", value: "mi" },
                ]}
                selectedValue={distanceUnit}
                onValueChange={(value) => setDistanceUnit(value as DistanceUnit)}
              />

              <UnitPicker
                title="Weights"
                icon={Weight}
                options={[
                  { label: "Kilogram", value: "kg" },
                  { label: "Pounds", value: "lb" },
                ]}
                selectedValue={weightUnit}
                onValueChange={(value) => setWeightUnit(value as WeightUnit)}
              />

              <UnitPicker
                title="Body"
                icon={User}
                options={[
                  { label: "Metric (cm & kg)", value: "metric" },
                  { label: "Imperial (ft & lb)", value: "imperial" },
                ]}
                selectedValue={bodyUnit}
                onValueChange={(value) => setBodyUnit(value as BodyUnit)}
              />
            </View>
          </View>

          {/* Menu Items */}
          {menuItems.map((section, sectionIndex) => (
            <View key={sectionIndex} className="mb-6">
              <Text className="text-white text-2xl font-poppins-semibold mb-4">{section.title}</Text>
              <View className="gap-2 rounded-2xl overflow-hidden">
                {section.items ? (
                  section.items.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      className={"flex-row items-center justify-between p-4 bg-neutral-900 rounded-xl"}
                      onPress={() => router.push(item.path)}
                    >
                      <View className="flex-row items-center">
                        <item.icon size={24} color="white" />
                        <Text className="text-white text-lg font-poppins ml-3">{item.title}</Text>
                      </View>
                      <ChevronRight size={24} color="white" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="flex-row items-center justify-between p-4 bg-neutral-900 rounded-xl">
                    <View className="flex-row items-center">
                      <section.icon size={24} color="white" />
                      <Text className="text-white text-lg font-poppins ml-3">{section.title}</Text>
                    </View>
                    {section.rightElement}
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* Logout */}
          <View className="mt-4 bg-neutral-900 rounded-2xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-4" onPress={handleLogout}>
              <View className="flex-row items-center">
                <LogOut size={24} color="red" />
                <Text style={{ color: "red" }} className="text-lg ml-3 font-poppins">
                  Logout
                </Text>
              </View>
              <ChevronRight size={24} color="red" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      <BotSheet snapPoints={["60%"]} ref={bottomSheetRef}>
        {renderPicker()}
      </BotSheet>
    </SafeAreaView>
  )
}

export default Profile