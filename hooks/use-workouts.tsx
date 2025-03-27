"use client"

import { useState, useEffect, useCallback } from "react"
import {
  fetchWorkouts,
  addWorkout as addWorkoutApi,
  completeWorkout as completeWorkoutApi,
  isWorkoutCompletedOnDate as isWorkoutCompletedOnDateApi,
  deleteWorkout as deleteWorkoutApi,
  addExercise as addExerciseApi,
  updateWorkout as updateWorkoutApi,
  updateExercise as updateExerciseApi,
  deleteExercise as deleteExerciseApi,
  type Workout,
  type Exercise,
} from "@/lib/workouts"

export const useWorkouts = (userId: string | undefined) => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>({})

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
      setWorkouts(data)

      // Check which workouts are completed today
      const completedMap: Record<string, boolean> = {}
      for (const workout of data) {
        const workoutId = workout.workout_id
        completedMap[workoutId] = await isWorkoutCompletedOnDateApi(userId, workoutId)
      }
      setCompletedWorkouts(completedMap)
    } catch (error) {
      console.error("Error fetching workouts:", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

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
    async (workoutData: Omit<Workout, "workout_id">, exercisesData: Omit<Exercise, "id" | "workout_id">[]) => {
      if (!userId) return null

      try {
        const newWorkout = await addWorkoutApi(userId, workoutData, exercisesData)
        if (newWorkout) {
          setWorkouts((prev) => [newWorkout, ...prev])
          return newWorkout
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
            return currentId === workoutId ? { ...workout, ...updatedWorkout } : workout
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
            if (workout.exercises?.some((exercise) => exercise.id === exerciseId)) {
              return {
                ...workout,
                exercises: workout.exercises.map((exercise) =>
                  exercise.id === exerciseId ? { ...exercise, ...updatedExercise } : exercise,
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
  const deleteExercise = useCallback(async (exerciseId: string | number) => {
    try {
      const success = await deleteExerciseApi(exerciseId)
      if (success) {
        setWorkouts((prev) =>
          prev.map((workout) => {
            if (workout.exercises?.some((exercise) => exercise.id === exerciseId)) {
              return {
                ...workout,
                exercises: workout.exercises.filter((exercise) => exercise.id !== exerciseId),
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

  // Complete a workout
  const completeWorkout = useCallback(
    async (workoutId: string | number) => {
      if (!userId) return false

      try {
        const completed = await completeWorkoutApi(userId, workoutId)
        if (completed) {
          setCompletedWorkouts((prev) => ({ ...prev, [workoutId]: true }))

          // Update the workout's last_performed date in the local state
          setWorkouts((prev) =>
            prev.map((workout) => {
              const currentId = workout.workout_id
              if (currentId === workoutId) {
                return {
                  ...workout,
                  last_performed: new Date().toISOString(),
                }
              }
              return workout
            }),
          )

          return true
        }
        return false
      } catch (error) {
        console.error("Error completing workout:", error)
        return false
      }
    },
    [userId],
  )

  // Check if a workout is completed on a specific date
  const isWorkoutCompletedOnDate = useCallback(
    (workoutId: string | number, date: Date = new Date()) => {
      return completedWorkouts[workoutId] || false
    },
    [completedWorkouts],
  )

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
  }
}

