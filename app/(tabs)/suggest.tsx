import { View, Text, SafeAreaView } from 'react-native'
import { Platform } from 'react-native'

const Suggestions = () => {
  const platform = Platform.OS;

  return (
    <SafeAreaView className={`flex-1 bg-neutral-900 ${platform === 'ios' ? '' : 'pt-5'}`}>
      <Text className='text-white text-2xl font-poppins-semibold'>Suggestions</Text>
    </SafeAreaView>
  )
}
export default Suggestions