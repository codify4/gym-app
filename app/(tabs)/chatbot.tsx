import Input from '@/components/input'
import { router } from 'expo-router'
import { BicepsFlexed, ChevronLeft, Dumbbell, GalleryVerticalEnd, Info, Send } from 'lucide-react-native'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native'

const Chatbot = () => {
    return (
        <KeyboardAvoidingView behavior="height" style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#000' }}>
            <SafeAreaView className="flex-1 bg-black justify-between items-center">
                <View className='flex-row items-center justify-between px-5 py-6 w-full'>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
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
                        <Text className="text-neutral-400 text-base font-poppins-semibold">Talk to Mate</Text>
                    </View>

                    <View className='w-full flex-row items-center justify-center gap-2 mt-5' style={{ paddingHorizontal: 20 }}>
                        <View className='bg-neutral-900 rounded-3xl p-5 flex-col'>
                            <Info size={24} color="white" />
                            <Text className='text-white text-base font-poppins'>Give me a chest workout</Text>
                        </View>
                        <View className='bg-neutral-900 rounded-3xl p-5 flex-col'>
                            <BicepsFlexed size={24} color="white" />
                            <Text className='text-white text-base font-poppins'>Give me a bicep workout</Text>
                        </View>
                    </View>
                </ScrollView>

                <View className='py-5 w-full flex-row items-center justify-center gap-2 bg-neutral-900' style={{ marginBottom: 60, marginHorizontal: 30, paddingHorizontal: 20, borderRadius: 30 }}>
                    <TextInput 
                        placeholder='Ask a question...'
                        value=''
                        onChangeText={() => {}}
                        style={{ width: '90%', height: 70, borderRadius: 30, backgroundColor: '#171717', color: '#fff', fontSize: 16, fontFamily: 'Poppins-Regular' }}
                    />
                    <TouchableOpacity className='bg-white rounded-full items-center justify-center' style={{ width: 50, height: 50 }}>
                        <Send size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default Chatbot