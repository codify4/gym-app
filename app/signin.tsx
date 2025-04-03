import React from 'react';
import { View, Text, TouchableOpacity, Image} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Dumbbell } from 'lucide-react-native';
import * as Linking from "expo-linking";
import { useAuth } from '@/context/auth';
import { createSessionFromUrl, performOAuth } from '@/lib/auth-lib';
import { router } from 'expo-router';
const Signin = () => {
    const url = Linking.useURL();
    const { session, signOut } = useAuth();
    
    React.useEffect(() => {
        if (url) {
            createSessionFromUrl(url).catch(console.error);
        }
    }, [url]);

    // If we already have a session, we'll be redirected by _layout.tsx
    if (session) return null;

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
                        className='bg-white flex flex-row items-center justify-center py-5 rounded-full mb-2'
                        onPress={performOAuth}
                    >
                        <FontAwesome name="google" size={24} color="#171717" />
                        <Text className='text-black text-lg font-poppins-semibold ml-3'>
                            Continue with Google
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className='bg-transparent border border-white flex flex-row items-center justify-between py-5 px-5 rounded-full mb-2'
                        onPress={() => router.push('/onboarding')}
                    >
                        <View></View>
                        <Text className='text-white text-lg font-poppins-semibold ml-3'>
                            Skip for now
                        </Text>
                        <ChevronRight size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Signin