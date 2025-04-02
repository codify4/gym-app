"use client"

import { useState, useEffect, useCallback } from "react"

import {
  addExercise as addExerciseApi,
  updateExercise as updateExerciseApi,
  deleteExercise as deleteExerciseApi,
  type Exercise,
} from "@/lib/exercises"
import {
  fetchWorkouts,
  addWorkout as addWorkoutApi,
  completeWorkout as completeWorkoutApi,
  deleteWorkout as deleteWorkoutApi,
  updateWorkout as updateWorkoutApi,
  type Workout,
  type CompletedWorkout,
} from "@/lib/workouts"
import { calculateCaloriesBurned } from "@/utils/calories"
import { supabase } from "@/lib/supabase"

export const useWorkouts = (userId: string | undefined) => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>({})
  const [completedWorkoutsData, setCompletedWorkoutsData] = useState<CompletedWorkout[]>([])

  // Calculate calories for a workout
  const getWorkoutCalories = useCallback((workout: Workout): number => {
    return calculateCaloriesBurned(workout.body_part, workout.duration)
  }, [])

  // Fetch workouts
  const fetchWorkoutsData = useCallback(async () => {
    if (!userId) {
      setWorkouts([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await fetchWorkouts(userId)

      // Add calories to each workout
      const workoutsWithCalories = data.map((workout) => ({
        ...workout,
        calories: getWorkoutCalories(workout),
      }))

      setWorkouts(workoutsWithCalories)

      // Check which workouts are completed today
      const completedMap: Record<string, boolean> = {}

      // First, get all completed workouts for this user
      const { data: completedWorkoutsData, error: completedError } = await supabase
        .from("completed_workout")
        .select("*")
        .eq("user_id", userId)

      if (completedError) {
        console.error("Error fetching completed workouts:", completedError)
      } else if (completedWorkoutsData) {
        console.log("Fetched completed workouts:", completedWorkoutsData.length)

        // Store completed workouts data
        setCompletedWorkoutsData(completedWorkoutsData)

        // Get today's date in YYYY-MM-DD format for comparison
        const today = new Date().toISOString().split("T")[0]

        // Process each workout to check if it's completed today
        for (const workout of data) {
          const workoutId = workout.workout_id

          // Find if this workout is completed today
          const isCompleted = completedWorkoutsData.some((cw) => {
            const completedDate = new Date(cw.completed_date).toISOString().split("T")[0]
            return cw.workout_id === workoutId && completedDate === today
          })

          completedMap[workoutId] = isCompleted
          console.log(`Workout ${workout.title} (${workoutId}) completed today: ${isCompleted}`)
        }
      }

      console.log("Completed workouts map:", completedMap)
      setCompletedWorkouts(completedMap)
    } catch (error) {
      console.error("Error fetching workouts:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, getWorkoutCalories])

  // Initial fetch
  useEffect(() => {
    fetchWorkoutsData()
  }, [fetchWorkoutsData])

  // Refresh workouts
  const onRefresh = useCallback(async () => {
    if (!userId) return

    try {
      setRefreshing(true)
      await fetchWorkoutsData()
    } finally {
      setRefreshing(false)
    }
  }, [userId, fetchWorkoutsData])

  // Add a new workout with exercises
  const addWorkout = useCallback(
    async (workoutData: Omit<Workout, "workout_id">, exercisesData: Omit<Exercise, "exercise_id" | "workout_id">[]) => {
      if (!userId) return null

      try {
        const newWorkout = await addWorkoutApi(userId, workoutData, exercisesData)
        if (newWorkout) {
          // Calculate calories for the new workout
          const workoutWithCalories = {
            ...newWorkout,
            calories: calculateCaloriesBurned(newWorkout.body_part, newWorkout.duration),
          }

          setWorkouts((prev) => [workoutWithCalories, ...prev])
          return workoutWithCalories
        }
        return null
      } catch (error) {
        console.error("Error adding workout:", error)
        return null
      }
    },
    [userId],
  )

  // Update a workout
  const updateWorkout = useCallback(async (workoutId: string | number, workoutData: Partial<Workout>) => {
    try {
      const updatedWorkout = await updateWorkoutApi(workoutId, workoutData)
      if (updatedWorkout) {
        setWorkouts((prev) =>
          prev.map((workout) => {
            const currentId = workout.workout_id
            if (currentId === workoutId) {
              // Recalculate calories if duration or body part changed
              const updatedWithCalories = {
                ...workout,
                ...updatedWorkout,
              }

              // Only recalculate if relevant fields changed
              if (workoutData.duration || workoutData.body_part) {
                updatedWithCalories.calories = calculateCaloriesBurned(
                  updatedWithCalories.body_part,
                  updatedWithCalories.duration,
                )
              }

              return updatedWithCalories
            }
            return workout
          }),
        )
        return updatedWorkout
      }
      return null
    } catch (error) {
      console.error("Error updating workout:", error)
      return null
    }
  }, [])

  // Delete a workout
  const deleteWorkout = useCallback(async (workoutId: string | number) => {
    try {
      const success = await deleteWorkoutApi(workoutId)
      if (success) {
        setWorkouts((prev) =>
          prev.filter((workout) => {
            const currentId = workout.workout_id
            return currentId !== workoutId
          }),
        )
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting workout:", error)
      return false
    }
  }, [])

  // Add an exercise to a workout
  const addExercise = useCallback(
    async (workoutId: string | number, exerciseData: Omit<Exercise, "id" | "workout_id" | "user_id">) => {
      if (!userId) return null

      try {
        const newExercise = await addExerciseApi(userId, workoutId, exerciseData)
        if (newExercise) {
          setWorkouts((prev) =>
            prev.map((workout) => {
              const currentId = workout.workout_id
              if (currentId === workoutId) {
                return {
                  ...workout,
                  exercises: [...(workout.exercises || []), newExercise],
                }
              }
              return workout
            }),
          )
          return newExercise
        }
        return null
      } catch (error) {
        console.error("Error adding exercise:", error)
        return null
      }
    },
    [userId],
  )

  // Update an exercise
  const updateExercise = useCallback(async (exerciseId: string | number, exerciseData: Partial<Exercise>) => {
    try {
      const updatedExercise = await updateExerciseApi(exerciseId, exerciseData)
      if (updatedExercise) {
        setWorkouts((prev) =>
          prev.map((workout) => {
            if (workout.exercises?.some((exercise) => exercise.exercise_id === exerciseId)) {
              return {
                ...workout,
                exercises: workout.exercises.map((exercise) =>
                  exercise.exercise_id === exerciseId ? { ...exercise, ...updatedExercise } : exercise,
                ),
              }
            }
            return workout
          }),
        )
        return updatedExercise
      }
      return null
    } catch (error) {
      console.error("Error updating exercise:", error)
      return null
    }
  }, [])

  // Delete an exercise
  const deleteExercise = useCallback(async (exerciseId: number) => {
    try {
      console.log("useWorkouts: Deleting exercise with ID:", exerciseId)

      // Call the deleteExercise function from the API
      const success = await deleteExerciseApi(exerciseId)
      console.log("useWorkouts: API response for delete:", success)

      if (success) {
        // Update the workouts state to remove the deleted exercise
        setWorkouts((prev) =>
          prev.map((workout) => {
            if (workout.exercises?.some((exercise) => exercise.exercise_id === exerciseId)) {
              console.log("useWorkouts: Found workout containing exercise, updating state")
              return {
                ...workout,
                exercises: workout.exercises.filter((exercise) => exercise.exercise_id !== exerciseId),
              }
            }
            return workout
          }),
        )
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting exercise:", error)
      return false
    }
  }, [])

  // Complete a workout with duration and calories
  const completeWorkout = useCallback(
    async (workoutId: string | number, durationSeconds?: number, caloriesBurned?: number) => {
      if (!userId) return false

      try {
        // Call the API with duration and calories
        const completed = await completeWorkoutApi(userId, workoutId, durationSeconds, caloriesBurned)

        if (completed) {
          console.log(
            `Workout ${workoutId} marked as completed today with duration: ${durationSeconds}s, calories: ${caloriesBurned}`,
          )

          // Update the completed workouts map
          setCompletedWorkouts((prev) => {
            const updated = { ...prev, [workoutId]: true }
            console.log("Updated completedWorkouts:", updated)
            return updated
          })

          // Update the workout's last_performed date in the local state
          setWorkouts((prev) =>
            prev.map((workout) => {
              const currentId = workout.workout_id
              if (currentId === workoutId) {
                const updatedWorkout = {
                  ...workout,
                  last_performed: new Date().toISOString(),
                }
                console.log(`Updated workout ${workout.title} last_performed to:`, updatedWorkout.last_performed)
                return updatedWorkout
              }
              return workout
            }),
          )

          // Add to completed workouts data
          if (completed) {
            setCompletedWorkoutsData((prev) => [completed, ...prev])
          }

          // Force a refresh to ensure we have the latest data
          setTimeout(() => {
            fetchWorkoutsData()
          }, 500)

          return true
        }
        return false
      } catch (error) {
        console.error("Error completing workout:", error)
        return false
      }
    },
    [userId, fetchWorkoutsData],
  )

  // Check if a workout is completed on a specific date
  const isWorkoutCompletedOnDate = useCallback(
    (workoutId: string | number, date: Date = new Date()) => {
      return completedWorkouts[workoutId] || false
    },
    [completedWorkouts],
  )

  // Get total calories burned from completed workouts
  const getTotalCaloriesBurned = useCallback(() => {
    return completedWorkoutsData.reduce((total, workout) => {
      return total + (workout.calories || 0)
    }, 0)
  }, [completedWorkoutsData])

  // Get total workout duration in minutes
  const getTotalWorkoutDuration = useCallback(() => {
    const totalSeconds = completedWorkoutsData.reduce((total, workout) => {
      return total + (workout.duration || 0)
    }, 0)

    return totalSeconds / 60 // Convert to minutes
  }, [completedWorkoutsData])

  return {
    workouts,
    loading,
    refreshing,
    onRefresh,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
    completeWorkout,
    isWorkoutCompletedOnDate,
    getWorkoutCalories,
    completedWorkouts,
    completedWorkoutsData,
    getTotalCaloriesBurned,
    getTotalWorkoutDuration,
  }
}