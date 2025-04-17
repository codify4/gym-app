import BotSheet from '@/components/bot-sheet'
import BottomSheet from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { ChevronLeft, Search } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { View, Text, SafeAreaView, TextInput, ScrollView, Platform, Touchable, TouchableOpacity } from 'react-native'
import * as Haptics from 'expo-haptics'
import Exercise from '@/components/suggestions/exercise'
import { Exercise as ExerciseType } from '@/lib/exercises'
import ExerciseInfo from '@/components/routine/exercise-info'
import { useWorkouts } from '@/hooks/use-workouts'
import { useAuth } from '@/context/auth'
import WorkoutCard from '@/components/routine/routine-card'
import { Workout } from '@/lib/workouts'

export const exercises: ExerciseType[] = [
    {
        exercise_id: 1,
        name: "Bench Press",
        sets: 3,
        reps: 8,
        weight: 100,
        image: require("@/assets/images/anatomy/chest.png"),
        tips: "Keep your back arched and drive through your feet.",
        body_part: "chest"
    }
]

const Exercises = () => {
    const { session } = useAuth();
    const user = session?.user
    const { workouts } = useWorkouts(user?.id);

    const addSheetRef = useRef<BottomSheet>();
    const infoSheetRef = useRef<BottomSheet>();

    const [selectedWorkout, setSelectedWorkout] = useState(false);
    
    const handleOpenAddSheet = (exercise: ExerciseType) => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        addSheetRef.current?.expand()
    }

    const handleSelectedWorkout = (workout: Workout) => {
        setSelectedWorkout(true);
    }

    const handleOpenInfoSheet = (exercise: ExerciseType) => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        infoSheetRef.current?.expand()
    }

    return (
        <SafeAreaView className='flex-1 bg-black'>
            <View className='flex-row items-center justify-between p-5'>
                <ChevronLeft size={24} color={"white"} onPress={() => router.push('/(tabs)/suggest')} />
                <Text className='text-white text-xl font-poppins-semibold'>Exercise Library</Text>
                <View></View>
            </View>
            <View className='flex-row items-center justify-start bg-neutral-900 rounded-3xl p-5 mt-4 gap-3 mx-5 border border-neutral-700'>
                <Search size={24} color={"white"} />
                <TextInput placeholder='Search for an exercise' className='bg-neutral-900 rounded-3xl font-poppins' />
            </View>

            <ScrollView className='px-5 mt-5'>
                <Exercise 
                    exercise={exercises[0]}
                    index={0}
                    onInfoPress={() => handleOpenInfoSheet(exercises[0])}
                    onAddPress={() => handleOpenAddSheet(exercises[0])}
                />
            </ScrollView>

            <BotSheet ref={addSheetRef} snapPoints={["60%"]}>
                <View className='flex-col items-center justify-between w-full h-full pb-5'>
                    <View className='flex-col items-center justify-center'>
                        <Text className='font-poppins-semibold text-white text-xl'>Add Exercise</Text>
                        <Text className='font-poppins text-white'>Select one or more workouts to add this exercise to.</Text>
                    </View>
                    <View className='w-full mt-5'>
                        {workouts.map((workout, index) => (
                            <TouchableOpacity 
                                key={index} 
                                className={`rounded-3xl`} 
                                onPress={() => handleSelectedWorkout(workout)}
                                style={selectedWorkout ? { borderColor: '#ef4444'}: { borderColor: '#f4f4f4'}}
                            >
                                <WorkoutCard workout={workout} pressable={false} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity className='bg-white py-5 rounded-full mt-5 w-full'>
                        <Text className='text-black text-lg font-poppins-semibold text-center'>Add to workout</Text>
                    </TouchableOpacity>
                </View>
            </BotSheet>
            <BotSheet ref={infoSheetRef} snapPoints={["88%"]}>
                <Text className='font-poppins-semibold text-white text-xl'>
                    <ExerciseInfo exercise={exercises[0]} />
                </Text>
            </BotSheet>
        </SafeAreaView>
  )
}
export default Exercises