'use client';

import Statistics from '@/components/statistics';
import { allTimeStats } from '@/constants/data';
import { useState } from 'react';
import { View, Text, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Stats = () => {
  const platform = Platform.OS;
  const [selected, setSelected] = useState('');

  const workoutDates = {
    '2025-02-01': {selected: true, selectedColor: '#FF3737'},
    '2025-02-02': {selected: true, selectedColor: '#FF3737'},
    '2025-02-03': {selected: true, selectedColor: '#FF3737'},
    '2025-02-05': {selected: true, selectedColor: '#FF3737'},
    '2025-02-06': {selected: true, selectedColor: '#FF3737'},
    '2025-02-07': {selected: true, selectedColor: '#FF3737'},
    '2025-02-09': {selected: true, selectedColor: '#FF3737'},
    '2025-02-10': {selected: true, selectedColor: '#FF3737'},
  };

  const weightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [75, 65, 70, 63, 80, 65],
        color: (opacity = 1) => `rgba(255, 55, 55, ${opacity})`,
        strokeWidth: 3
      }
    ]
  };
  
  const chartConfig = {
    backgroundColor: '#262626',
    backgroundGradientFrom: '#262626',
    backgroundGradientTo: '#262626',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '1',
      stroke: '#FF3737',
      fill: '#FF3737',
    },
    propsForBackgroundLines: {
      strokeDasharray: '6',
      stroke: 'rgba(255, 255, 255)',
      strokeWidth: 1,
    },
    fillShadowGradientFrom: 'rgba(255, 55, 55, 0.2)',
    fillShadowGradientTo: 'rgba(255, 55, 55, 0)',
    paddingRight: 20,
  };
  
  return (
    <SafeAreaView className={`flex-1 bg-neutral-900 ${platform === 'ios' ? '' : 'pt-5'}`}>
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pb-16 gap-2">
          <Text className="text-white text-3xl font-poppins-semibold text-center my-4">
            Stats
          </Text>
          
          <View className="bg-neutral-800 rounded-3xl w-full mb-4 p-4 overflow-hidden">
            <Calendar
              theme={{
                calendarBackground: '#262626',
                textSectionTitleColor: '#ffffff',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#FF3737',
                dayTextColor: '#ffffff',
                textDisabledColor: '#444444',
                monthTextColor: '#ffffff',
                textMonthFontWeight: 'bold',
                arrowColor: '#FF3737',
                dotColor: '#ffffff',
              }}
              markedDates={{
                [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'},
                ...workoutDates
              }}
              enableSwipeMonths={true}
            />
          </View>

          <View className="flex items-center justify-center gap-2 bg-neutral-800 rounded-3xl p-4 w-full overflow-hidden mb-4">
            <Text className="text-white text-2xl font-poppins-semibold mb-2">
              Weight Progress
            </Text>
            <View className="px-2 -mx-4">
              <LineChart
                data={weightData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={false}
                style={{
                  borderRadius: 24,
                }}
                withDots={true}
              />
            </View>
          </View>

          <View className='bg-neutral-800 rounded-3xl px-4 py-5 mb-8'>
            <Statistics stats={allTimeStats} title="All Time Stats" screen='stats' />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stats;