import { Trash2 } from 'lucide-react-native'
import { View, Text, TouchableOpacity } from 'react-native'

type ChatInfoProps = {
    conversation: any
    onSelectConversation: (conversationId: string) => void
    handleDeleteChat: (conversationId: string) => void
    formatTimestamp: (dateString: string) => string
}
const ChatInfo = ({ conversation, onSelectConversation, handleDeleteChat, formatTimestamp }: ChatInfoProps) => {
    return (
        <TouchableOpacity
        key={conversation.conversation_id}
        className="mb-2 mx-3 px-4 py-3 rounded-2xl bg-neutral-800 active:bg-neutral-700"
        onPress={() => onSelectConversation(conversation.conversation_id)}
        >
            <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-2">
                <Text className="text-white font-poppins-medium" numberOfLines={1}>
                {conversation.title}
                </Text>
                <Text className="text-neutral-400 text-sm font-poppins mt-1" numberOfLines={1}>
                {conversation.messages?.[conversation.messages.length - 1]?.content || ""}
                </Text>
            </View>
            <View className="flex-row items-center">
                <Text className="text-neutral-500 text-xs font-poppins mr-2">
                    {formatTimestamp(conversation.updated_at)}
                </Text>
                <TouchableOpacity
                onPress={(e) => {
                    e.stopPropagation()
                    handleDeleteChat(conversation.conversation_id)
                }}
                >
                <Trash2 size={14} color="#666" />
                </TouchableOpacity>
            </View>
            </View>
        </TouchableOpacity>
    )
}
export default ChatInfo