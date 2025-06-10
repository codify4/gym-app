import { Dumbbell, ChevronLeft, ChartNoAxesColumnIncreasing, Brain, BookOpenText, Camera } from 'lucide-react-native'
import { router, Tabs } from 'expo-router'
import { Platform, TouchableOpacity } from 'react-native'
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
                borderTopWidth: Platform.OS === 'ios' ? 1 : 0,
                minHeight: Platform.OS === 'ios' ? 70 : 40,
                alignContent: 'center',
            },
            tabBarActiveTintColor: '#fff',
            tabBarHideOnKeyboard: true,
            tabBarLabelStyle: {
                fontFamily: 'Poppins-Regular'
            }
        }}
    >
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
            name='suggest' 
            options={{
                title: 'Tips',
                tabBarIcon: ({ color, size }) => (
                    <BookOpenText color={color} size={size} />
                )
            }}
        />

        <Tabs.Screen 
            name='stats' 
            options={{
                title: 'Stats',
                tabBarIcon: ({ color, size }) => (
                    <ChartNoAxesColumnIncreasing color={color} size={size} />
                )
            }}
        />

        

        <Tabs.Screen 
            name='chatbot' 
            options={{
                title: 'Mate',
                tabBarIcon: ({ color, size }) => (
                    <Brain color={color} size={size} />
                ),
            }}
        />

        <Tabs.Screen 
            name='[id]' 
            options={{
                href: null,
            }}
        />

        <Tabs.Screen 
            name='workout' 
            options={{
                href: null,
                tabBarStyle: {display: 'none'}
            }}
        />
        
        <Tabs.Screen 
            name='workout-complete' 
            options={{
                href: null,
                tabBarStyle: {display: 'none'}
            }}
        />

        <Tabs.Screen 
            name='exercises' 
            options={{
                href: null,
                tabBarStyle: {display: 'none'}
            }}
        />
        <Tabs.Screen 
            name='camera' 
            options={{
                href: null,
                tabBarStyle: {display: 'none'}
            }}
        />
        <Tabs.Screen 
            name='profile' 
            options={{
                href: null,
                title: 'Profile',
                headerShown: true,
                headerStyle: {
                    backgroundColor: 'black',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: '600',
                },
                headerShadowVisible: false,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <ChevronLeft size={30} color={'#fff'} />
                    </TouchableOpacity>
                )
            }}
        />
        <Tabs.Screen 
            name='(settings)/privacy-policies' 
            options={{
                href: null,
                title: 'Privacy Policy',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#171717',
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
                    backgroundColor: '#171717',
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
                    backgroundColor: '#000000',
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
            name='home' 
            options={{
                href: null,
                title: 'Home',
            }}
        />

    </Tabs>
  )
}
export default TabsLayout