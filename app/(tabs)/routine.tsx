import { View, Text, SafeAreaView } from 'react-native'
import { Platform } from 'react-native'

const Routine = () => {
  const platform = Platform.OS;
  
  return (
    <SafeAreaView className={`flex-1 bg-neutral-900 ${platform === 'ios' ? '' : 'pt-5'}`}>
      <Text className='text-white text-2xl font-poppins-semibold'>Routine</Text>
    </SafeAreaView>
  )
}
export default Routine