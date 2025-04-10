"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native"
import { X } from "lucide-react-native"

interface AppleStylePickerProps {
  title: string
  unit: string
  minValue: number
  maxValue: number
  initialValue: number
  step: number
  onValueChange: (value: number) => void
  onClose: () => void
  onSave: () => void
  formatValue?: (value: number) => string // Optional formatter for special cases like feet/inches
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const ITEM_WIDTH = 50
const ITEM_SPACING = 10
const CONTAINER_PADDING = 20

const AppleStylePicker = ({
  title,
  unit,
  minValue,
  maxValue,
  initialValue,
  step,
  onValueChange,
  onClose,
  onSave,
  formatValue,
}: AppleStylePickerProps) => {
  const [value, setValue] = useState(initialValue)
  const scrollViewRef = useRef<ScrollView>(null)

  // Generate all possible values based on min, max, and step
  const values: number[] = []
  for (let i = minValue; i <= maxValue; i += step) {
    values.push(i)
  }

  // Calculate initial scroll position
  useEffect(() => {
    // Find the index of the initial value
    const initialIndex = values.findIndex((v) => v === initialValue)
    if (initialIndex !== -1 && scrollViewRef.current) {
      // Wait until after initial render
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: initialIndex * (ITEM_WIDTH + ITEM_SPACING),
          animated: false,
        })
      }, 100)

      return () => clearTimeout(timer)
    }
  }, []) // Empty dependency array so it only runs once

  // Handle scroll events to update the selected value
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / (ITEM_WIDTH + ITEM_SPACING))
    if (index >= 0 && index < values.length) {
      const newValue = values[index]
      if (newValue !== value) {
        setValue(newValue)
        onValueChange(newValue)
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Current Value Display */}
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>
          {formatValue ? formatValue(value) : value}
          {!formatValue && <Text style={styles.unitText}>{unit}</Text>}
        </Text>
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        {/* Center indicator line */}
        <View style={styles.centerIndicator} />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={ITEM_WIDTH + ITEM_SPACING}
          snapToAlignment="center"
          contentContainerStyle={styles.scrollContent}
          onMomentumScrollEnd={handleScroll}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {values.map((val, index) => (
            <View key={index} style={styles.tickContainer}>
              <View style={[styles.tick, val % 5 === 0 ? styles.majorTick : null]} />
              {val % 5 === 0 && <Text style={styles.tickLabel}>{val}</Text>}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      {/* Bottom Indicator */}
      <View style={styles.bottomIndicator} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
  valueContainer: {
    marginBottom: 40,
  },
  valueText: {
    color: "white",
    fontSize: 48,
    fontFamily: "Poppins-Bold",
  },
  unitText: {
    fontSize: 24,
    fontFamily: "Poppins-Medium",
    color: "rgba(255, 255, 255, 0.7)",
  },
  sliderContainer: {
    width: "100%",
    height: 80,
    position: "relative",
    marginBottom: 40,
  },
  centerIndicator: {
    position: "absolute",
    left: "50%",
    top: 0,
    width: 2,
    height: 35,
    backgroundColor: "white",
    zIndex: 10,
    marginLeft: -1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_WIDTH / 2 - ITEM_WIDTH / 2 - CONTAINER_PADDING,
  },
  tickContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
    alignItems: "center",
  },
  tick: {
    width: 1,
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginTop: 20,
  },
  majorTick: {
    height: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  tickLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  saveButton: {
    width: "100%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  bottomIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "white",
    borderRadius: 3,
    marginTop: 10,
  },
})

export default AppleStylePicker