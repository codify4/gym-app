import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Welcome = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
        resizeMode="cover"
        style={styles.background}
      />
      
      <View style={styles.overlay}>
        <Text style={styles.title}>Workout Mate</Text>
        <Text style={styles.subtitle}>Your Personal Fitness Journey</Text>
        <TouchableOpacity
          onPress={() => router.push({pathname: '/onboarding'})}
          className='bg-black py-4 px-8 rounded-full'
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Welcome;