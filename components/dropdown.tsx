"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { ChevronDown } from "lucide-react-native"
import * as Haptics from "expo-haptics"

type UnitPickerProps = {
  title: string
  icon: React.ElementType
  options: Array<{ label: string; value: string }>
  selectedValue: string
  onValueChange: (value: string) => void
}

const UnitPicker = ({ title, icon: Icon, options, selectedValue, onValueChange }: UnitPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false)

  const openPicker = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    setModalVisible(true)
  }

  const handleValueChange = (value: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    onValueChange(value)
    if (Platform.OS === "android") {
      setModalVisible(false)
    }
  }

  // Find the selected label
  const selectedLabel = options.find((option) => option.value === selectedValue)?.label || "Select"

  return (
    <View className="mb-3">
      <TouchableOpacity
        className="flex-row items-center justify-between p-4 bg-neutral-900 rounded-xl"
        onPress={openPicker}
      >
        <View className="flex-row items-center">
          <Icon size={24} color="white" />
          <Text className="text-white text-lg font-poppins ml-3">{title}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-neutral-400 mr-2">{selectedLabel}</Text>
          <ChevronDown size={24} color="white" />
        </View>
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "flex-end" }}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View className="bg-neutral-900 w-full">
              <View className="flex-row justify-between items-center p-4 border-b border-neutral-700">
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text className="text-white text-base">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text className="text-white text-base font-semibold">Done</Text>
                </TouchableOpacity>
              </View>
              <Picker selectedValue={selectedValue} onValueChange={handleValueChange} itemStyle={{ color: "white" }} mode="dialog">
                {options.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {Platform.OS === "android" && modalVisible && (
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleValueChange}
          mode="dropdown"
          dropdownIconColor="white"
          style={{ position: "absolute", bottom: 0, width: 1000, height: 1000, opacity: 0 }}
        >
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      )}
    </View>
  )
}

export default UnitPicker
