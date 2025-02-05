import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell } from 'lucide-react-native';

const { height } = Dimensions.get('window');

const Signin = () => {
    return (
        <View className='flex-1 bg-neutral-900'>
            <View className='h-[50%]'>
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
                    className='w-full h-full'
                    resizeMode='cover'
                />
                <LinearGradient
                    colors={['transparent', 'rgba(23, 23, 23, 0.8)', '#171717']}
                    className='absolute w-full h-full'
                />
            </View>

            <View className='flex-1 justify-between items-center px-6'>
                <View className='flex flex-col items-center mt-6'>
                    <View className='bg-white/10 p-3 rounded-full mb-4'>
                        <Dumbbell size={30} color="white" />
                    </View>
                    <Text className='text-white text-3xl font-poppins-semibold'>Welcome to</Text>
                    <Text className='text-white text-5xl font-poppins-bold'>Workout Mate</Text>
                    <View className='flex-row items-center mt-4 space-x-2'>
                        <Text className='text-gray-300 text-lg font-poppins'>
                            Your fitness journey awaits
                        </Text>
                    </View>
                </View>
                
                <View className='w-full space-y-4 mb-10'>
                    <TouchableOpacity 
                        className='bg-white flex flex-row items-center justify-center py-4 rounded-full mb-2'
                        onPress={() => router.push({pathname: '/home'})}
                    >
                        <FontAwesome name="google" size={24} color="#171717" />
                        <Text className='text-[#171717] text-lg font-poppins-semibold ml-3'>
                            Continue with Google
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Signin