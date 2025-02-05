import { Home, Dumbbell, Lightbulb, ChartLine, ArrowBigLeft, ChevronLeft } from 'lucide-react-native'
import { router, Tabs } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import React from 'react'

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
        <Tabs.Screen 
            name='(settings)/privacy-policies' 
            options={{
                href: null,
                title: 'Privacy Policy',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: '600',
                },
                headerShadowVisible: false,
                headerLeft: () => (
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                    <ChevronLeft size={30} color={'#fff'} />
                </TouchableOpacity>
                ),
            }}
        />
        <Tabs.Screen 
            name='(settings)/terms-and-services' 
            options={{
                href: null,
                title: 'ToS',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: '600',
                },
                headerShadowVisible: false,
                headerLeft: () => (
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                    <ChevronLeft size={30} color={'#fff'} />
                </TouchableOpacity>
                ),
            }}
        />
        <Tabs.Screen 
            name='(settings)/settings' 
            options={{
                href: null,
                title: 'Settings',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: '600',
                },
                headerShadowVisible: false,
                headerLeft: () => (
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                    <ChevronLeft size={30} color={'#fff'} />
                </TouchableOpacity>
                ),
            }}
        />

    </Tabs>
  )
}
export default TabsLayout