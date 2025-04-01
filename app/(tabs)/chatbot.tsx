import { BicepsFlexed, ChevronLeft, Dumbbell, GalleryVerticalEnd, Info, Send } from 'lucide-react-native'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
const Chatbot = () => {
    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className='flex-row items-center justify-between px-5 py-6'>
                <TouchableOpacity>
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <GalleryVerticalEnd size={24} color="white" />
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingBottom: 60 }}>
                <View className="px-5 w-full flex-col items-center justify-center mt-5">
                    <Dumbbell size={100} color="white" style={{ transform: [{ rotate: '-45deg' }] }} />
                    <Text className="text-white text-4xl font-poppins-bold mb-3">Mate</Text>
                    <Text className="text-neutral-400 text-base font-poppins-semibold">Talk to the Mate</Text>
                </View>

                <View className='px-5 w-full flex-row items-center justify-center gap-2 mt-5'>
                    <View className='bg-neutral-900 rounded-3xl p-6 flex-col'>
                        <Info size={24} color="white" />
                        <Text className='text-white text-base font-poppins'>Give me a chest workout</Text>
                    </View>
                    <View className='bg-neutral-900 rounded-3xl p-6 flex-col'>
                        <BicepsFlexed size={24} color="white" />
                        <Text className='text-white text-base font-poppins'>Give me a bicep workout</Text>
                    </View>
                </View>
            </ScrollView>

            <View className='p-5 mb-8 w-full' style={{ paddingBottom: 40 }}>
                <View className='bg-neutral-900 rounded-3xl p-6 w-full flex-row justify-between'> 
                    <View>
                        <Text className='text-neutral-400 text-xl font-poppins mb-4'>Ask a question...</Text>
                    </View>
                    <TouchableOpacity className='bg-white rounded-full py-2 px-5'>
                        <Send size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default Chatbot