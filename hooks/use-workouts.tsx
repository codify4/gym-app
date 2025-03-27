"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "../lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { Alert } from "react-native"
import {
  getWorkouts,
  getExercises,
  getCompletedWorkouts,
  createWorkout,
  deleteWorkout,
  recordWorkoutCompletion,
  getTodayDateString,
  type Workout,
  type Exercise,
  type CompletedWorkout,
} from "../lib/workouts"

export interface CompletionsByDate {
  [date: string]: string[] // date string in format 'YYYY-MM-DD' -> array of workout IDs
}

export const useWorkouts = (userId: string | undefined) => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([])
  const [completionsByDate, setCompletionsByDate] = useState<CompletionsByDate>({})
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch completed workouts
  const loadCompletedWorkouts = useCallback(async () => {
    if (!userId) return

    const completed = await getCompletedWorkouts(userId)
    if (completed) {
      setCompletedWorkouts(completed)

      // Also update completionsByDate for the calendar
      const byDate: CompletionsByDate = {}
      completed.forEach((completion) => {
        const date = completion.completed_date
        if (!byDate[date]) {
          byDate[date] = []
        }
        byDate[date].push(completion.workout_id)
      })
      setCompletionsByDate(byDate)

      return completed
    }
    return null
  }, [userId])

  // Fetch workouts function
  const loadWorkouts = useCallback(async () => {
    if (!userId) {
      console.log("No user ID available")
      return
    }

    setLoading(true)
    try {
      const fetchedWorkouts = await getWorkouts(userId)
      const completed = await getCompletedWorkouts(userId)

      if (fetchedWorkouts && fetchedWorkouts.length > 0) {
        // For each workout, fetch its exercise
        const workoutsWithExercises = await Promise.all(
          fetchedWorkouts.map(async (workout) => {
            const exercise = await getExercises(workout.id)
            return {
              ...workout,
              exercises: exercise ? [exercise] : [],
            }
          }),
        )

        setWorkouts(workoutsWithExercises)
      } else if (fetchedWorkouts) {
        setWorkouts(fetchedWorkouts)
      }

      if (completed) {
        setCompletedWorkouts(completed)

        // Also update completionsByDate for the calendar
        const byDate: CompletionsByDate = {}
        completed.forEach((completion) => {
          const date = completion.completed_date
          if (!byDate[date]) {
            byDate[date] = []
          }
          byDate[date].push(completion.workout_id)
        })
        setCompletionsByDate(byDate)
      }
    } catch (error) {
      console.error("Error in loadWorkouts:", error)
      Alert.alert("Error", "Something went wrong while loading your workouts.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [userId])

  // Set up Supabase real-time subscription
  useEffect(() => {
    if (!userId) return

    let workoutsSubscription: RealtimeChannel
    let exercisesSubscription: RealtimeChannel
    let completionsSubscription: RealtimeChannel

    const setupSubscriptions = async () => {
      // Subscribe to changes on the workout table for the current user
      workoutsSubscription = supabase
        .channel("workout-changes")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "workout", // Make sure this matches your table name
            filter: `user_id=eq.${userId}`, // Only listen to changes for the current user
          },
          (payload) => {
            console.log("Real-time workout change received:", payload)

            // Handle different types of changes
            if (payload.eventType === "INSERT") {
              const newWorkout = payload.new as Workout
              // Fetch exercises for this new workout
              getExercises(newWorkout.id).then((exercise) => {
                setWorkouts((prevWorkouts) => [
                  { ...newWorkout, exercises: exercise ? [exercise] : [] },
                  ...prevWorkouts,
                ])
              })
            } else if (payload.eventType === "UPDATE") {
              const updatedWorkout = payload.new as Workout
              setWorkouts((prevWorkouts) =>
                prevWorkouts.map((workout) => {
                  if (workout.id === updatedWorkout.id) {
                    // Preserve the exercises
                    return {
                      ...updatedWorkout,
                      exercises: workout.exercises,
                    }
                  }
                  return workout
                }),
              )
            } else if (payload.eventType === "DELETE") {
              const deletedWorkoutId = payload.old.id
              setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== deletedWorkoutId))
            }
          },
        )
        .subscribe()

      // Subscribe to changes on the exercise table
      exercisesSubscription = supabase
        .channel("exercise-changes")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "exercise", // Make sure this matches your table name
          },
          (payload) => {
            console.log("Real-time exercise change received:", payload)

            // Handle different types of changes
            if (payload.eventType === "INSERT") {
              const newExercise = payload.new as Exercise

              // When a new exercise is added, we need to check if any workouts reference it
              // and update those workouts
              loadWorkouts() // Reload all workouts to get the updated relationships
            } else if (payload.eventType === "UPDATE") {
              const updatedExercise = payload.new as Exercise

              // Update the exercise in any workouts that reference it
              setWorkouts((prevWorkouts) =>
                prevWorkouts.map((workout) => {
                  if (workout.exercise_id === updatedExercise.id) {
                    return {
                      ...workout,
                      // Update the exercises array if it exists
                      exercises: workout.exercises
                        ? workout.exercises.map((e) => (e.id === updatedExercise.id ? updatedExercise : e))
                        : undefined,
                    }
                  }
                  return workout
                }),
              )
            } else if (payload.eventType === "DELETE") {
              const deletedExercise = payload.old as Exercise

              // Handle the case where an exercise is deleted
              // This might require special handling depending on your app's requirements
              // For now, we'll just reload all workouts
              loadWorkouts()
            }
          },
        )
        .subscribe()

      // Subscribe to changes on the completed_workout table for the current user
      completionsSubscription = supabase
        .channel("completion-changes")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "completed_workout", // Make sure this matches your table name
            filter: `user_id=eq.${userId}`, // Only listen to changes for the current user
          },
          (payload) => {
            console.log("Real-time completion change received:", payload)

            if (payload.eventType === "INSERT") {
              const completion = payload.new as CompletedWorkout
              const workoutId = completion.workout_id
              const date = completion.completed_date

              // Update completedWorkouts
              setCompletedWorkouts((prev) => [...prev, completion])

              // Update completionsByDate for the calendar
              setCompletionsByDate((prev) => {
                const updated = { ...prev }
                if (!updated[date]) {
                  updated[date] = []
                }
                if (!updated[date].includes(workoutId)) {
                  updated[date].push(workoutId)
                }
                return updated
              })

              // Update the last_performed date of the workout
              setWorkouts((prevWorkouts) =>
                prevWorkouts.map((workout) =>
                  workout.id === workoutId
                    ? {
                        ...workout,
                        last_performed: date,
                      }
                    : workout,
                ),
              )
            } else if (payload.eventType === "DELETE") {
              const deletedCompletion = payload.old as CompletedWorkout
              const workoutId = deletedCompletion.workout_id
              const date = deletedCompletion.completed_date

              // Update completedWorkouts
              setCompletedWorkouts((prev) => prev.filter((c) => c.id !== deletedCompletion.id))

              // Update completionsByDate for the calendar
              setCompletionsByDate((prev) => {
                const updated = { ...prev }
                if (updated[date]) {
                  updated[date] = updated[date].filter((id) => id !== workoutId)
                  if (updated[date].length === 0) {
                    delete updated[date]
                  }
                }
                return updated
              })
            }
          },
        )
        .subscribe()
    }

    setupSubscriptions()

    // Clean up subscriptions when component unmounts
    return () => {
      if (workoutsSubscription) {
        supabase.removeChannel(workoutsSubscription)
      }
      if (exercisesSubscription) {
        supabase.removeChannel(exercisesSubscription)
      }
      if (completionsSubscription) {
        supabase.removeChannel(completionsSubscription)
      }
    }
  }, [userId])

  // Fetch workouts on hook initialization
  useEffect(() => {
    if (userId) {
      loadWorkouts()
    }
  }, [userId, loadWorkouts])

  // Check if a workout has been completed on a specific date
  const isWorkoutCompletedOnDate = useCallback(
    (workoutId: string, date: string = getTodayDateString()): boolean => {
      return !!(completionsByDate[date] && completionsByDate[date].includes(workoutId))
    },
    [completionsByDate],
  )

  // Handle completing a workout
  const completeWorkout = async (id: string) => {
    try {
      if (!userId) return

      // Check if the workout has already been completed today
      const today = getTodayDateString()
      if (isWorkoutCompletedOnDate(id, today)) {
        console.log("Workout already completed today")
        return
      }

      // Find the workout to update
      const workout = workouts.find((w) => w.id === id)
      if (!workout) return

      // Optimistically update UI
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((w) =>
          w.id === id
            ? {
                ...w,
                last_performed: today,
              }
            : w,
        ),
      )

      // Optimistically update completions
      const newCompletion: CompletedWorkout = {
        id: `temp-${Date.now()}`, // Temporary ID until we get the real one
        workout_id: id,
        user_id: userId,
        completed_date: today,
      }

      setCompletedWorkouts((prev) => [...prev, newCompletion])

      // Update completionsByDate for the calendar
      setCompletionsByDate((prev) => {
        const updated = { ...prev }
        if (!updated[today]) {
          updated[today] = []
        }
        if (!updated[today].includes(id)) {
          updated[today].push(id)
        }
        return updated
      })

      // Record the completion in the database
      const success = await recordWorkoutCompletion(id, userId)

      if (!success) {
        // If recording fails, revert the optimistic updates
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((w) =>
            w.id === id
              ? {
                  ...w,
                  last_performed: workout.last_performed,
                }
              : w,
          ),
        )

        setCompletedWorkouts((prev) => prev.filter((c) => c.id !== newCompletion.id))

        setCompletionsByDate((prev) => {
          const updated = { ...prev }
          if (updated[today]) {
            updated[today] = updated[today].filter((wId) => wId !== id)
            if (updated[today].length === 0) {
              delete updated[today]
            }
          }
          return updated
        })

        Alert.alert("Error", "Failed to record workout completion. Please try again.")
      }
    } catch (error) {
      console.error("Error completing workout:", error)
      Alert.alert("Error", "Something went wrong while recording your workout completion.")
      // Refresh workouts to ensure UI is in sync with database
      loadWorkouts()
    }
  }

  // Add a new workout with exercises
  const addWorkout = async (
    workoutData: Omit<Workout, "id" | "workout_id" | "exercise_id">,
    exerciseData: Omit<Exercise, "id" | "exercise_id">,
  ) => {
    try {
      if (!userId) return null

      // Create the workout in the database
      const newWorkout = await createWorkout({ ...workoutData, user_id: userId }, exerciseData)

      if (!newWorkout) {
        Alert.alert("Error", "Failed to create workout. Please try again.")
        return null
      }

      // The real-time subscription should handle updating the UI
      return newWorkout
    } catch (error) {
      console.error("Error adding workout:", error)
      Alert.alert("Error", "Something went wrong while creating your workout.")
      return null
    }
  }

  // Remove a workout
  const removeWorkout = async (id: string) => {
    try {
      // Find the workout to delete
      const workoutToDelete = workouts.find((w) => w.id === id)
      if (!workoutToDelete) return

      // Optimistically update UI
      setWorkouts((prevWorkouts) => prevWorkouts.filter((w) => w.id !== id))

      // Delete workout from Supabase
      const success = await deleteWorkout(id)

      if (!success) {
        // If deletion fails, revert the optimistic update
        setWorkouts((prevWorkouts) => [...prevWorkouts, workoutToDelete])
        Alert.alert("Error", "Failed to delete workout. Please try again.")
      }
      // No need to manually update the state here as the real-time subscription will handle it
    } catch (error) {
      console.error("Error deleting workout:", error)
      Alert.alert("Error", "Something went wrong while deleting your workout.")
      // Refresh workouts to ensure UI is in sync with database
      loadWorkouts()
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadWorkouts()
  }, [loadWorkouts])

  // Helper function to check if a date has any completions
  const hasCompletionsOnDate = useCallback(
    (date: string) => {
      return !!completionsByDate[date] && completionsByDate[date].length > 0
    },
    [completionsByDate],
  )

  // Get workouts completed on a specific date
  const getWorkoutsCompletedOnDate = useCallback(
    (date: string): string[] => {
      return completionsByDate[date] || []
    },
    [completionsByDate],
  )

  return {
    workouts,
    loading,
    refreshing,
    onRefresh,
    completeWorkout,
    addWorkout,
    removeWorkout,
    completionsByDate,
    hasCompletionsOnDate,
    getWorkoutsCompletedOnDate,
    isWorkoutCompletedOnDate,
  }
}