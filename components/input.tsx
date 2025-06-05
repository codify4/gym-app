"use client"

import { TextInput, View, Text, type ViewStyle, type TextStyle } from "react-native"
import { useState } from "react"

type InputProps = {
  mode: "outlined" | "flat"
  value: string
  onChangeText: (text: string) => void
  placeholder: string | undefined
  focus?: boolean
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "number-pad"
    | "name-phone-pad"
    | "decimal-pad"
    | "twitter"
    | "web-search"
  moreStyles?: ViewStyle
  label?: string
}

const Input = ({ mode, value, onChangeText, placeholder, focus, keyboardType, moreStyles, label }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const getContainerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      height: 60,
      borderRadius: 10,
      paddingHorizontal: 16,
      justifyContent: "center",
    }

    const modeStyles: ViewStyle =
      mode === "outlined"
        ? {
            borderWidth: 1,
            borderColor: isFocused ? "white" : "#404040",
            backgroundColor: "transparent",
          }
        : {
            backgroundColor: "#262626",
            borderWidth: 0,
            borderBottomWidth: isFocused ? 2 : 1,
            borderBottomColor: isFocused ? "white" : "#404040",
            borderRadius: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }

    // Apply moreStyles last to ensure they override base styles
    return {
      ...baseStyles,
      ...modeStyles,
      ...moreStyles,
    }
  }

  const getTextInputStyles = (): TextStyle => {
    return {
      color: "white",
      fontSize: 16,
      fontFamily: "Poppins-Regular",
      paddingVertical: 0,
      // Remove flex: 1 to allow container width to control sizing
    }
  }

  const getLabelStyles = (): TextStyle => {
    const isActive = isFocused || value.length > 0

    return {
      position: "absolute",
      left: 16,
      color: isFocused ? "white" : "#9ca3af",
      fontFamily: "Poppins-Regular",
      fontSize: isActive ? 12 : 16,
      top: isActive ? (mode === "outlined" ? -8 : 8) : 20,
      backgroundColor: mode === "outlined" && isActive ? "#000" : "transparent",
      paddingHorizontal: mode === "outlined" && isActive ? 4 : 0,
      zIndex: 1,
    }
  }

  return (
    <View style={{ position: "relative" }}>
      {label && <Text style={getLabelStyles()}>{label}</Text>}
      <View style={getContainerStyles()}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={!label ? placeholder : undefined}
          placeholderTextColor="#9ca3af"
          style={getTextInputStyles()}
          autoFocus={focus ? true : false}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  )
}

export default Input
