import { View, Text, SafeAreaView } from 'react-native'
import { Platform } from 'react-native'

const Stats = () => {
  const platform = Platform.OS;
  
  return (
    <SafeAreaView className={`flex-1 bg-neutral-900 ${platform === 'ios' ? '' : 'pt-5'}`}>
      <Text className='text-white text-2xl font-poppins-semibold'>Stats</Text>
    </SafeAreaView>
  )
}
export default Stats