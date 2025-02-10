import { View, Text, SafeAreaView } from 'react-native'
import { Platform } from 'react-native'
import Animated, { SlideInRight } from 'react-native-reanimated';

const Stats = () => {
  const platform = Platform.OS;
  
  return (
    <SafeAreaView className={`flex-1 bg-neutral-900 ${platform === 'ios' ? '' : 'pt-5'}`}>
      <Animated.View
        className={`flex-1 bg-neutral-900 ${platform === 'ios' ? '' : 'pt-5'}`}
        key={1}
        entering={SlideInRight}
      >
        <Text className='text-white text-2xl font-poppins-semibold'>Stats</Text>
      </Animated.View>
    </SafeAreaView>
  )
}
export default Stats