import { View, Text, SafeAreaView, ScrollView, Switch } from 'react-native'
import { useState } from 'react'
import { Vibrate, Volume2, Clock, Dumbbell, LucideIcon } from 'lucide-react-native'

type SettingsOptionProps = {
  title: string
  description: string
  icon: LucideIcon
  isToggle?: boolean
  value?: boolean
  onToggle?: (value: boolean) => void
}

const SettingsOption = ({ 
  title, 
  description, 
  icon: Icon, 
  isToggle = false, 
  value = false, 
  onToggle = () => {} 
}: SettingsOptionProps) => (
  <View className="flex-row items-center justify-between bg-neutral-900 p-4 rounded-2xl mb-4">
    <View className="flex-row items-center flex-1">
      <Icon size={24} color="white" />
      <View className="ml-3 flex-1">
        <Text className="text-white text-lg font-poppins-semibold">{title}</Text>
        <Text className="text-neutral-400 font-poppins-regular">{description}</Text>
      </View>
    </View>
    {isToggle && (
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#4A4A4A', true: '#22C55E' }}
      />
    )}
  </View>
)

const Settings = () => {
  const [vibrations, setVibrations] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [workoutReminders, setWorkoutReminders] = useState(true)
  const [metricSystem, setMetricSystem] = useState(true)

  return (
    <SafeAreaView className='bg-black flex-1'>
      <ScrollView 
        className='flex-1 px-4 bg-black'
        showsVerticalScrollIndicator={false}
      >
        
        <View className="mb-8">
          <Text className="text-neutral-400 text-lg font-poppins-medium mb-4">App Preferences</Text>
          <SettingsOption
            title="Vibrations"
            description="Haptic feedback for interactions"
            icon={Vibrate}
            isToggle
            value={vibrations}
            onToggle={setVibrations}
          />
          <SettingsOption
            title="Sound Effects"
            description="Play sounds for timer and achievements"
            icon={Volume2}
            isToggle
            value={soundEffects}
            onToggle={setSoundEffects}
          />
        </View>

        <View className="mb-8">
          <Text className="text-neutral-400 text-lg font-poppins-medium mb-4">Workout Settings</Text>
          <SettingsOption
            title="Workout Reminders"
            description="Get reminded of your scheduled workouts"
            icon={Clock}
            isToggle
            value={workoutReminders}
            onToggle={setWorkoutReminders}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings