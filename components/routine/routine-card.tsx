import { ChevronRight, Dumbbell, Timer } from 'lucide-react-native'
import { View, Text, TouchableOpacity } from 'react-native'

type Routine = {
    name: string
    exercises: number
    duration: string
    lastPerformed: string
    bodyPart: string
}

const RoutineCard = ({ routine }: { routine: Routine }) => {
    return (
        <TouchableOpacity className="bg-neutral-900 rounded-3xl py-4 px-5 mb-3">
            <View>
                <Text className="text-white text-lg font-semibold mb-2">{routine.name}</Text>
                <View className="flex-row items-center mb-2">
                    <Dumbbell size={16} color="#FF3737" />
                    <Text className="text-neutral-400 text-sm font-poppins-medium ml-1 mr-3">{routine.exercises} exercises</Text>
                    <Timer size={16} color="#FF3737" />
                    <Text className="text-neutral-400 text-sm font-poppins-medium ml-1">{routine.duration}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <Text className="text-neutral-500 text-sm font-poppins-semibold">{routine.lastPerformed}</Text>
                    <ChevronRight size={20} color="white" />
                </View>
            </View>
        </TouchableOpacity>
    )
}
export default RoutineCard