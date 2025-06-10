import { View, Text, TouchableOpacity } from 'react-native'

const StartRecording = ({ handleGoToCamera }: { handleGoToCamera: () => void }) => {
    return (
        <View className="flex-1 w-full">
            <Text className="text-white font-poppins-semibold text-xl text-center mb-6">
                Correct your form with Mate
            </Text>
            
            <View className="bg-neutral-800 rounded-2xl p-6 mb-6">
                <Text className="text-white font-poppins-semibold text-lg mb-3">
                    How to record
                </Text>
                <Text className="text-neutral-300 font-poppins-regular text-sm leading-6">
                    While recording Mate will give u voice instructions.{'\n'}
                    So use some type of headphones if u want.
                </Text>
            </View>

            <TouchableOpacity 
                className="bg-white py-5 rounded-full"
                onPress={handleGoToCamera}
            >
                <Text className="text-black font-poppins-semibold text-center text-lg">
                    Start recording
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default StartRecording