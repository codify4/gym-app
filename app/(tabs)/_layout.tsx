import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

const TabsLayout = () => {
  return (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: {
                backgroundColor: '#121212',
                position: 'absolute',
                borderTopColor: '#1A1A1A',
                borderTopWidth: 1,
                minHeight: 70
            },
            tabBarActiveTintColor: '#fff',
        }}
    >
        <Tabs.Screen name='home' options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='home' color={color} size={size} />
            )
        }} />

        <Tabs.Screen name='routine' options={{
            title: 'Routine',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='barbell-sharp' color={color} size={size} />
            )
        }} />

        <Tabs.Screen name='calendar' options={{
            title: 'Calendar',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='calendar-outline' color={color} size={size} />
            )
        }} />

        <Tabs.Screen name='suggest' options={{
            title: 'Suggestions',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name='bulb-outline' color={color} size={size} />
            )
        }} />

    </Tabs>
  )
}
export default TabsLayout