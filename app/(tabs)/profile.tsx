import React from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useAuth } from '@/context/auth';
import { Settings, Lock, Bell, ChevronRight, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { signOut } from '@/lib/auth-lib';
import Animated, { SlideInRight } from 'react-native-reanimated';

const Profile = () => {
  const { session } = useAuth();
  const user = session?.user;
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const platform = Platform.OS;

  const stats = [
    { label: 'Height', value: '180cm' },
    { label: 'Weight', value: '80kg' },
    { label: 'Age', value: '18yo' },
  ];

  const menuItems = [
    {
      title: 'Notifications',
      icon: Bell,
      rightElement: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: '#4ade80' }}
        />
      ),
    },
    {
      title: 'Other',
      items: [
        { title: 'Privacy Policy', icon: Lock, path: '/(tabs)/(settings)/privacy-policies' as const },
        { title: 'Terms and Services', icon: Lock, path: '/(tabs)/(settings)/terms-and-services' as const },
        { title: 'Settings', icon: Settings, path: '/(tabs)/(settings)/settings' as const },
      ],
    },
  ];

  return (
    <SafeAreaView className={`flex-1 bg-black ${platform === 'ios' ? '' : 'pt-5'}`}>
      <Animated.View
        className={`flex-1 bg-black pt-7`}
        entering={SlideInRight}
      >
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: platform === "ios" ? 60 : 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="flex items-center justify-center gap-5 mt-8 mb-6">
          <Avatar.Image 
            size={150} 
            source={{ uri: user?.user_metadata?.avatar_url }} 
            className="bg-white rounded-full mb-4" 
          />
          <Text className="text-white text-4xl font-poppins-bold">
            {user?.user_metadata?.full_name || 'User'}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex flex-row items-center justify-center gap-2 mb-8 w-full">
          {stats.map((stat, index) => (
            <View 
              key={index} 
              className="bg-neutral-900 rounded-2xl px-6 py-3 w-[33%] items-center"
            >
              <Text className="text-white text-xl font-poppins-semibold">{stat.value}</Text>
              <Text className="text-neutral-400 text-base">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text className="text-white text-2xl font-poppins-semibold mb-4">
              {section.title}
            </Text>
            <View className="bg-neutral-900 rounded-2xl overflow-hidden">
              {section.items ? (
                section.items.map((item, index) => (
                  <TouchableOpacity 
                    key={index}
                    className="flex-row items-center justify-between p-4 border-b border-neutral-700 last:border-b-0"
                    onPress={() => router.push(item.path)}
                  >
                    <View className="flex-row items-center">
                      <item.icon size={24} color="white" />
                      <Text className="text-white text-lg ml-3">{item.title}</Text>
                    </View>
                    <ChevronRight size={24} color="white" />
                  </TouchableOpacity>
                ))
              ) : (
                <View className="flex-row items-center justify-between p-4">
                  <View className="flex-row items-center">
                    <section.icon size={24} color="white" />
                    <Text className="text-white text-lg ml-3">{section.title}</Text>
                  </View>
                  {section.rightElement}
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Logout */}      
        <View className="mt-4 bg-neutral-900 rounded-2xl overflow-hidden">
          <TouchableOpacity className="flex-row items-center justify-between p-4" onPress={signOut}>
              <View className="flex-row items-center">
                  <LogOut size={24} color="red" />
                  <Text style={{color: 'red'}} className="text-lg ml-3">Logout</Text>
              </View>
              <ChevronRight size={24} color="red" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Profile;