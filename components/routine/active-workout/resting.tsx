import { Exercise } from '@/lib/exercises'
import { ChevronRight } from 'lucide-react-native'
import { View, Text, TouchableOpacity } from 'react-native'

type RestingProps = {
    nextExercise: Exercise | null
    currentSetIndex: number
    totalSets: number
    handleEndRest: () => void
}

const Resting = ({ nextExercise, currentSetIndex, totalSets, handleEndRest }: RestingProps) => {
    return (
        <View className="bg-neutral-800 rounded-3xl p-6 items-center">
            <View className="bg-neutral-700 px-4 py-2 rounded-full mb-4">
                <Text className="text-white font-poppins-medium">REST TIME</Text>
            </View>

            <Text className="text-white text-2xl mb-6 font-poppins-semibold">Take a short break</Text>

            {nextExercise && (
                <View className="bg-neutral-900 rounded-2xl p-4 w-full mb-6">
                    <Text className="text-neutral-400 text-sm mb-1 font-poppins-medium">NEXT UP</Text>
                    <Text className="text-white text-xl mb-1 font-poppins-semibold">{nextExercise.name}</Text>
                    <View className="flex-row items-center">
                        <Text className="text-neutral-400 font-poppins-medium">
                            {currentSetIndex < totalSets - 1 ? `Set ${currentSetIndex + 2}` : "Set 1"} • {nextExercise.reps}{" "}
                            reps
                        </Text>
                        {nextExercise.weight && <Text className="text-neutral-400 font-poppins"> • {nextExercise.weight} kg</Text>}
                    </View>
                </View>
            )}

            <TouchableOpacity className="bg-white px-8 py-5 rounded-full flex-row items-center justify-center w-full" onPress={handleEndRest}>
                <Text className="text-black text-lg mr-2 font-poppins-semibold">Continue</Text>
                <ChevronRight size={20} color="black" />
            </TouchableOpacity>
        </View>
    )
}
export default Resting