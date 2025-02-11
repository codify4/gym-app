import { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native'
import { Platform } from 'react-native'
import { Calendar } from 'react-native-calendars';

const Stats = () => {
  const platform = Platform.OS;
  const [selected, setSelected] = useState('');


  const workoutDates = {
    '2025-02-01': {selected: true, selectedColor: 'red'},
    '2025-02-02': {selected: true, selectedColor: 'red'},
    '2025-02-03': {selected: true, selectedColor: 'red'},
    '2025-02-05': {selected: true, selectedColor: 'red'},
    '2025-02-06': {selected: true, selectedColor: 'red'},
    '2025-02-07': {selected: true, selectedColor: 'red'},
    '2025-02-09': {selected: true, selectedColor: 'red'},
    '2025-02-10': {selected: true, selectedColor: 'red'},
  };
  
  return (
    <SafeAreaView className={`flex-1 bg-neutral-900 ${platform === 'ios' ? '' : 'pt-5'}`}>
      <Text className='text-white text-2xl font-poppins-semibold'>Stats</Text> 
      <Calendar
        theme={{
          calendarBackground: '#2A2A2A',
          textSectionTitleColor: '#ffffff',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#FF4757',
          dayTextColor: '#ffffff',
          textDisabledColor: '#444444',
          monthTextColor: '#ffffff',
          textMonthFontWeight: 'bold',
          arrowColor: '#FF4757',
          dotColor: '#ffffff',
        }}
        style={{
          borderRadius: 20,
          margin: 10,
        }}
        markedDates={{
          [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'},
          ...workoutDates
        }}
        enableSwipeMonths={true}
      />
    </SafeAreaView>
  )
}
export default Stats