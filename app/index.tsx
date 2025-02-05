import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const Welcome = () => {
  const router = useRouter();

  return (
    <View className='flex-1'>
      <View className='absolute w-full h-full'>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
          resizeMode="cover"
          className='w-full h-full'
        />
        {/* Dark overlay for better text visibility */}
        <View className='absolute w-full h-full bg-black/50' />
      </View>
      
      <View className='flex-1 justify-between pt-20 pb-16 px-6 z-50'>
        {/* Top Section */}
        <Animated.View 
          entering={FadeInDown.duration(1000).delay(300)}
          className='items-center'
        >
          <Text className='text-white text-2xl mb-2 font-poppins-medium'>Welcome to</Text>
          <Text className='text-white text-8xl tracking-wider font-poppins-bold'>
            Workout
          </Text>
          <Text className='text-white text-8xl tracking-wider mb-4 font-poppins-bold'>
            Mate
          </Text>
        </Animated.View>

        {/* Bottom Section */}
        <Animated.View 
          entering={FadeInUp.duration(1000).delay(600)}
          className='space-y-6'
        >
          <View className='space-y-4'>
            <Text className='text-white text-3xl font-bold text-center font-poppins-medium'>
              Your Personal Fitness Journey
            </Text>
            <Text className='text-gray-200 text-center text-lg font-poppins'>
              Track workouts, set goals, and achieve your fitness dreams with a personalized experience
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/onboarding')}
            className='flex flex-row justify-center bg-white py-4 rounded-full w-full items-center mt-5'
          >
            <Text className='text-black text-xl font-semibold font-poppins mr-2'>Get Started</Text>
            <ChevronRight size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/signin')}
            className='bg-black py-4 rounded-full w-full items-center mt-5'
          >
            <Text className='text-white underline text-xl font-semibold font-poppins'>Already have an account</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default Welcome;