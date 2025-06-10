import { Camera, Send } from "lucide-react-native"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated
} from "react-native"

type PromptInputProps = {
    bottomMargin: Animated.Value
    setMessage: (message: string) => void
    message: string
    isLoading: boolean
    handleSend: () => void
}

const PromptInput = ({ bottomMargin, setMessage, message, isLoading, handleSend }: PromptInputProps) => {
    return (
        <Animated.View
            style={{
                marginBottom: bottomMargin,
                borderRadius: 30,
                width: "95%",
                alignSelf: "center",
            }}
        >
            <View
                className="py-10 flex-row items-center justify-between bg-neutral-900 border border-neutral-700"
                style={{
                    paddingHorizontal: 16,
                    borderRadius: 25,
                    width: "100%",
                    minHeight: 80,
                }}
            >
                <View className="flex-col items-center justify-between">
                    <TextInput
                        placeholder="Ask about workouts, nutrition, etc..."
                        placeholderTextColor="#999"
                        value={message}
                        onChangeText={setMessage}
                        style={{
                            flex: 1,
                            color: "#fff",
                            fontSize: 16,
                            fontFamily: "Poppins-Regular",
                            marginRight: 10,
                            minHeight: 60,
                            alignSelf: "flex-start",
                        }}
                    />
                    <View className="flex-row items-center justify-between w-full mb-1">
                        <TouchableOpacity className="bg-neutral-800 border border-neutral-700 rounded-full px-5 py-2 flex-row items-center gap-2 self-start">
                            <Camera size={20} color="white" />
                            <Text className="text-white text-sm font-poppins-semibold">
                                Capture
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`border border-neutral-700 flex-row items-center justify-center gap-2 px-5 py-2 rounded-full ${message.trim() ? "bg-white" : "bg-neutral-800"}`}
                            onPress={handleSend}
                            disabled={message.trim() === "" || isLoading}
                        >
                            <Send size={20} color={message.trim() ? "black" : "white"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className="px-3">
                <Text className="text-neutral-500 text-xs font-poppins text-center">
                    Responses are AI-generated. Always consult do your own reseach.
                </Text>
            </View>
        </Animated.View>
    )
}
export default PromptInput