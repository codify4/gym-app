"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Platform, Modal, SafeAreaView } from "react-native"
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
  const [tempValue, setTempValue] = useState(selectedValue)

  // Reset temp value when selected value changes
  useEffect(() => {
    setTempValue(selectedValue)
  }, [selectedValue])

  const openPicker = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    setTempValue(selectedValue)
    setModalVisible(true)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  const handleDone = () => {
    onValueChange(tempValue)
    setModalVisible(false)
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
          <Text className="text-white text-lg font-poppins-medium ml-3">{title}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-neutral-400 mr-2">{selectedLabel}</Text>
          <ChevronDown size={24} color="white" />
        </View>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCancel}>
        <SafeAreaView style={{ flex: 1}}>
          <View style={{ flex: 1 }} onTouchEnd={handleCancel}>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#171717",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center p-4 border-b border-neutral-700">
                <TouchableOpacity onPress={handleCancel}>
                  <Text className="text-white text-base font-poppins">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-white text-base font-poppins-semibold">{title}</Text>
                <TouchableOpacity onPress={handleDone}>
                  <Text className="text-white text-base font-poppins">Done</Text>
                </TouchableOpacity>
              </View>

              <View style={{ maxHeight: 250 }}>
                <Picker
                  selectedValue={tempValue}
                  onValueChange={(itemValue) => setTempValue(itemValue)}
                  itemStyle={{ color: "white" }}
                  style={{ color: Platform.OS === "android" ? "white" : undefined }}
                >
                  {options.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={Platform.OS === "android" ? "white" : undefined}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  )
}

export default UnitPicker