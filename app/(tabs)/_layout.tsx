import { Home, Dumbbell, Lightbulb, ChartLine } from 'lucide-react-native'
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
                minHeight: 70,
                alignContent: 'center',
            },
            tabBarActiveTintColor: '#fff',
            tabBarHideOnKeyboard: true,
        }}
    >
        <Tabs.Screen 
            name='home' 
            options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <Home color={color} size={size} />
                ),
                tabBarItemStyle: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            }}
        />

        <Tabs.Screen 
            name='routine' 
            options={{
                title: 'Routine',
                tabBarIcon: ({ color, size }) => (
                    <Dumbbell color={color} size={size} />
                )
            }}
        />

        <Tabs.Screen 
            name='stats' 
            options={{
                title: 'Stats',
                tabBarIcon: ({ color, size }) => (
                    <ChartLine color={color} size={size} />
                )
            }}
        />

        <Tabs.Screen 
            name='suggest' 
            options={{
                title: 'Suggestions',
                tabBarIcon: ({ color, size }) => (
                    <Lightbulb color={color} size={size} />
                )
            }}
        />

        <Tabs.Screen 
            name='profile' 
            options={{
                href: null
            }}
        />

    </Tabs>
  )
}
export default TabsLayout