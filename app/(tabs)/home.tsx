import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Avatar, Card, Button } from 'react-native-paper';
import { userProfile, dummyWorkouts, monthlyStats } from '@/constants/data';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  return (
    <SafeAreaView className='flex-1 bg-neutral-800'>
      <ScrollView className='h-full'>
        <View className='flex flex-row items-center p-4 gap-4'>
          <Avatar.Image size={50} source={{ uri: userProfile.avatar }} className='bg-black' />
          <Text className='text-white text-2xl font-poppins-semibold'>{userProfile.username}</Text>
        </View>

        <Card style={styles.workoutCard}>
          <Card.Cover
            source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' }}
            style={styles.workoutImage}
          />
          <View>
            <Text className='text-white text-3xl font-poppins-bold'>Today's Workout</Text>
            <Text className='text-white text-lg font-poppins-semibold'>Chest</Text>
            <TouchableOpacity
              className='bg-white rounded-full w-full px-4 py-4 items-center justify-center'
            >
              <Text className='text-xl font-poppins-semibold'>Start workout</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.exercisesCard}>
          <Card.Title title="My Workouts" titleStyle={styles.cardTitle} />
          <Card.Content>
            {dummyWorkouts[0].exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseRow}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseSets}>{exercise.sets}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Title title="This Month" titleStyle={styles.cardTitle} />
          <Card.Content style={styles.statsContainer}>
            {monthlyStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statCount}>{stat.count}</Text>
                <Text style={styles.statLabel}>{stat.category}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  username: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  workoutCard: {
    margin: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    overflow: 'hidden',
  },
  workoutImage: {
    height: 200,
  },
  workoutOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  workoutTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  workoutSubtitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#FF4757',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercisesCard: {
    margin: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
  },
  exerciseSets: {
    color: '#FF4757',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    margin: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    color: '#FF4757',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 30,
    margin: 20,
  },
});

export default Home;