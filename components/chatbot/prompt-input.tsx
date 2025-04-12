import { Send } from "lucide-react-native"
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
                className="py-4 flex-row items-center justify-between bg-neutral-900 border border-neutral-700"
                style={{
                    paddingHorizontal: 16,
                    borderRadius: 25,
                    width: "100%",
                }}
            >
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
                    }}
                />
                <TouchableOpacity
                    className={`rounded-full items-center justify-center ${message.trim() ? "bg-white" : "bg-neutral-700"}`}
                    style={{ width: 40, height: 40 }}
                    onPress={handleSend}
                    disabled={message.trim() === "" || isLoading}
                >
                    <Send size={20} color={message.trim() ? "black" : "white"} />
                </TouchableOpacity>
            </View>

            <View className="px-3">
                <Text className="text-neutral-500 text-xs font-poppins">
                    Responses are AI-generated. Always consult do your own reseach.
                </Text>
            </View>
        </Animated.View>
    )
}
export default PromptInput