"use client"

import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import type { Workout } from "@/lib/workouts"
import { CheckCircle } from "lucide-react-native"

interface WeekDay {
  date: Date
  day: string
  isToday: boolean
  isPast: boolean
  isFuture: boolean
  workout: Workout | null
}

interface WeeklyOverviewProps {
  workouts: Workout[]
  completedWorkouts: Record<string, boolean>
}

const WeeklyOverview = ({ workouts, completedWorkouts }: WeeklyOverviewProps) => {
  const [weekDays, setWeekDays] = useState<WeekDay[]>([])

  // Add useEffect to log completedWorkouts for debugging
  useEffect(() => {
  }, [completedWorkouts, workouts])

  useEffect(() => {
    generateWeekDays()
  }, [workouts, completedWorkouts])

  // Update the generateWeekDays function to better handle completed workouts
  const generateWeekDays = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const today = new Date()
    const currentDay = today.getDay() // 0-6, starting from Sunday
    const mondayOffset = currentDay === 0 ? 6 : currentDay - 1 // Calculate days since Monday

    // Format today's date for comparison
    const todayStr = today.toISOString().split("T")[0]

    const weekDaysData = days.map((day, index) => {
      // Calculate the date for this day of the week
      const date = new Date(today)
      date.setDate(today.getDate() - mondayOffset + index)

      // Format date as ISO string for comparison with workout dates
      const dateStr = date.toISOString().split("T")[0]

      // Check if this day is today or in the past
      const isToday = dateStr === todayStr
      const isPast = date < today && !isToday
      const isFuture = date > today

      // Find workout completed on this date
      let dayWorkout: Workout | null = null

      // For today, check completedWorkouts object
      if (isToday) {
        // Find the first workout that's marked as completed today
        const completedWorkoutId = Object.keys(completedWorkouts).find((id) => completedWorkouts[id])
        if (completedWorkoutId) {
          dayWorkout = workouts.find((w) => w.workout_id === completedWorkoutId) || null
        }
      }
      // For past days, check last_performed date
      else if (isPast) {
        for (const workout of workouts) {
          if (workout.last_performed) {
            const workoutDate = new Date(workout.last_performed).toISOString().split("T")[0]
            if (workoutDate === dateStr) {
              dayWorkout = workout
              break
            }
          }
        }
      }

      return {
        date,
        day,
        isToday,
        isPast,
        isFuture,
        workout: dayWorkout,
      }
    })

    setWeekDays(weekDaysData)
  }

  // Format date as day number (e.g., "15")
  const formatDayNumber = (date: Date) => {
    return date.getDate().toString()
  }

  return (
    <View className="bg-neutral-900 rounded-3xl p-6 mb-6">
      <Text className="text-white text-xl font-poppins-semibold mb-4">Weekly Overview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekDays.map((item, index) => (
          <TouchableOpacity
            key={item.day}
            className={`mr-4 items-center ${item.isToday ? "opacity-100" : "opacity-70"}`}
            style={{ width: 65 }}
          >
            <View
              className={`w-12 h-12 rounded-full items-center justify-center mb-2
                ${item.isToday ? "bg-white" : "bg-neutral-800"}`}
            >
              {item.isPast ? (
                <CheckCircle size={24} color={item.isToday ? "black" : "white"} />
              ) : (
                <Text className={`font-poppins-bold text-lg ${item.isToday ? "text-black" : "text-white"}`}>
                  {formatDayNumber(item.date)}
                </Text>
              )}
            </View>
            <Text className="text-white text-sm font-poppins-medium">{item.day}</Text>

            {/* Show workout title if available for any day */}
            {item.workout && (
              <Text className="text-neutral-400 text-xs font-poppins-medium text-center" numberOfLines={1}>
                {item.workout.title}
              </Text>
            )}

            {/* Show "Rest" only for past days and today if no workout */}
            {!item.workout && !item.isFuture && !item.isToday && (
              <Text className="text-neutral-400 text-xs font-poppins-medium text-center" numberOfLines={1}>
                Rest
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default WeeklyOverview