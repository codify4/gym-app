import { Exercise as ExerciseType } from '@/lib/exercises'
import { getImageSource } from '@/utils/exercise-muscle'
import { LinearGradient } from 'expo-linear-gradient'
import { CirclePlus, Dumbbell, InfoIcon } from 'lucide-react-native'
import { View, Text, TouchableOpacity, Image } from 'react-native'

interface ExerciseCardProps {
    exercise: ExerciseType
    index: number
    onInfoPress: () => void
    onAddPress: () => void
}

const Exercise = ({ exercise, index, onInfoPress, onAddPress }: ExerciseCardProps) => {
    return (
        <LinearGradient
            colors={["#2A2A2A", "#1A1A1A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24, flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between' }}
        >
            <View className='flex-row items-center gap-3'>
                <Image source={getImageSource(exercise)} style={{ width: 40, height: 80 }} resizeMode='contain' />
                <Text className='text-white text-xl font-poppins-semibold'>{exercise.name}</Text>
            </View>
            <View className='flex-row items-center gap-3'>
                <TouchableOpacity className='bg-red-500/50 p-2 rounded-xl' onPress={onAddPress}>
                    <CirclePlus size={24} color={"white"} />
                </TouchableOpacity>
                <TouchableOpacity className='bg-neutral-700 p-2 rounded-xl' onPress={onInfoPress}>
                    <InfoIcon size={24} color={"white"} />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}
export default Exercise