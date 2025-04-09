import { ChevronRight } from "lucide-react-native"
import { View, Text, TouchableOpacity } from "react-native"

interface UserInfoProps {
  value: string
  label: string
  handleOpenBottomSheet: () => void
  editable?: boolean
}

const UserInfo = ({ value, label, handleOpenBottomSheet, editable = true }: UserInfoProps) => {
  return (
    <TouchableOpacity
      onPress={handleOpenBottomSheet}
      disabled={!editable}
      className={"bg-neutral-900 rounded-2xl px-4 py-3 flex-1 flex-row mx-1 items-center justify-center"}
    >
      <View className="flex-col items-center flex-1">
        <Text className="text-white text-xl font-poppins-semibold">{value}</Text>
        <Text className="text-neutral-400 text-base">{label}</Text>
      </View>
      {editable && <ChevronRight size={16} color="white" />}
    </TouchableOpacity>
  )
}

export default UserInfo