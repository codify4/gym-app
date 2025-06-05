"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Workout } from "@/lib/workouts"
import type { Exercise } from "@/lib/exercises"
import {
  addExercise as addExerciseApi,
  updateExercise as updateExerciseApi,
  deleteExercise as deleteExerciseApi,
} from "@/lib/exercises"
import {
  fetchWorkouts,
  addWorkout as addWorkoutApi,
  completeWorkout as completeWorkoutApi,
  deleteWorkout as deleteWorkoutApi,
  updateWorkout as updateWorkoutApi,
  type CompletedWorkout,
} from "@/lib/workouts"
import { calculateCaloriesBurned } from "@/utils/calories"

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

  // Force refresh function that can be called externally
  const refreshWorkouts = useCallback(async () => {
    await fetchWorkoutsData()
  }, [fetchWorkoutsData])

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
    async (workoutId: string | number, exerciseData: Omit<Exercise, "workout_id" | "user_id" | "id">) => {
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

  // Get weekly trends
  const getWorkoutTrend = useCallback(() => {
    if (!completedWorkoutsData || completedWorkoutsData.length === 0) return 0

    // Get today's date and date from a week ago
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)

    // Get two weeks ago date for comparison
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(today.getDate() - 14)

    // Count workouts in the last week
    const workoutsLastWeek = completedWorkoutsData.filter((workout) => {
      const workoutDate = new Date(workout.completed_date)
      return workoutDate >= oneWeekAgo && workoutDate <= today
    }).length

    // Count workouts in the previous week
    const workoutsPreviousWeek = completedWorkoutsData.filter((workout) => {
      const workoutDate = new Date(workout.completed_date)
      return workoutDate >= twoWeeksAgo && workoutDate < oneWeekAgo
    }).length

    // Calculate trend - if no previous workouts, just return 0 or positive value
    if (workoutsPreviousWeek === 0) {
      return workoutsLastWeek > 0 ? 100 : 0 // 100% increase if there are workouts this week but none last week
    }

    // Calculate percentage change
    const percentageChange = Math.round(((workoutsLastWeek - workoutsPreviousWeek) / workoutsPreviousWeek) * 100)
    return percentageChange
  }, [completedWorkoutsData])

  // Get calorie trend
  const getCalorieTrend = useCallback(() => {
    if (!completedWorkoutsData || completedWorkoutsData.length === 0) return 0

    // Get today's date and date from a week ago
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)

    // Get two weeks ago date for comparison
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(today.getDate() - 14)

    // Sum calories in the last week
    const caloriesLastWeek = completedWorkoutsData
      .filter((workout) => {
        const workoutDate = new Date(workout.completed_date)
        return workoutDate >= oneWeekAgo && workoutDate <= today
      })
      .reduce((sum, workout) => sum + (workout.calories || 0), 0)

    // Sum calories in the previous week
    const caloriesPreviousWeek = completedWorkoutsData
      .filter((workout) => {
        const workoutDate = new Date(workout.completed_date)
        return workoutDate >= twoWeeksAgo && workoutDate < oneWeekAgo
      })
      .reduce((sum, workout) => sum + (workout.calories || 0), 0)

    // Calculate trend - if no previous calories, just return 0 or positive value
    if (caloriesPreviousWeek === 0) {
      return caloriesLastWeek > 0 ? 100 : 0
    }

    // Calculate percentage change
    const percentageChange = Math.round(((caloriesLastWeek - caloriesPreviousWeek) / caloriesPreviousWeek) * 100)
    return percentageChange
  }, [completedWorkoutsData])

  // Get duration trend
  const getDurationTrend = useCallback(() => {
    if (!completedWorkoutsData || completedWorkoutsData.length === 0) return 0

    // Get today's date and date from a week ago
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)

    // Get two weeks ago date for comparison
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(today.getDate() - 14)

    // Get workouts in the last week
    const workoutsLastWeek = completedWorkoutsData.filter((workout) => {
      const workoutDate = new Date(workout.completed_date)
      return workoutDate >= oneWeekAgo && workoutDate <= today
    })

    // Get workouts in the previous week
    const workoutsPreviousWeek = completedWorkoutsData.filter((workout) => {
      const workoutDate = new Date(workout.completed_date)
      return workoutDate >= twoWeeksAgo && workoutDate < oneWeekAgo
    })

    // Calculate average duration for last week
    let avgDurationLastWeek = 0
    if (workoutsLastWeek.length > 0) {
      const totalDurationLastWeek = workoutsLastWeek.reduce((sum, workout) => sum + (workout.duration || 0), 0)
      avgDurationLastWeek = totalDurationLastWeek / workoutsLastWeek.length / 60 // Convert to minutes
    }

    // Calculate average duration for previous week
    let avgDurationPreviousWeek = 0
    if (workoutsPreviousWeek.length > 0) {
      const totalDurationPreviousWeek = workoutsPreviousWeek.reduce((sum, workout) => sum + (workout.duration || 0), 0)
      avgDurationPreviousWeek = totalDurationPreviousWeek / workoutsPreviousWeek.length / 60 // Convert to minutes
    }

    // Calculate trend - if no previous workouts, just return 0 or positive value
    if (avgDurationPreviousWeek === 0) {
      return avgDurationLastWeek > 0 ? 100 : 0
    }

    // Calculate percentage change
    const percentageChange = Math.round(
      ((avgDurationLastWeek - avgDurationPreviousWeek) / avgDurationPreviousWeek) * 100,
    )
    return percentageChange
  }, [completedWorkoutsData])

  // Get a random workout for "Today's Workout" section
  const getRandomWorkout = useCallback(() => {
    if (!workouts || workouts.length === 0) return null

    // Filter out workouts that have been completed today
    const availableWorkouts = workouts.filter((workout) => !completedWorkouts[workout.workout_id])

    // If all workouts are completed today, just return a random one from all workouts
    if (availableWorkouts.length === 0) {
      const randomIndex = Math.floor(Math.random() * workouts.length)
      return workouts[randomIndex]
    }

    // Return a random workout from available workouts
    const randomIndex = Math.floor(Math.random() * availableWorkouts.length)
    return availableWorkouts[randomIndex]
  }, [workouts, completedWorkouts])

  // Get body part workout stats
  const getBodyPartStats = useCallback(() => {
    if (!completedWorkoutsData || completedWorkoutsData.length === 0) return []

    // Create a map to store body part counts
    const bodyPartCounts: Record<string, number> = {}

    // Count completed workouts by body part
    completedWorkoutsData.forEach((completedWorkout) => {
      // Find the workout details
      const workout = workouts.find((w) => w.workout_id === completedWorkout.workout_id)
      if (workout && workout.body_part) {
        const bodyPart = workout.body_part
        bodyPartCounts[bodyPart] = (bodyPartCounts[bodyPart] || 0) + 1
      }
    })

    // Convert to array of stats
    const stats = Object.entries(bodyPartCounts).map(([bodyPart, count]) => ({
      category: bodyPart,
      count: count.toString(),
      // We'll calculate trend later
      trend: 0,
    }))

    // Sort by count (highest first)
    stats.sort((a, b) => Number.parseInt(b.count) - Number.parseInt(a.count))

    // Return top 3 or all if less than 3
    return stats.slice(0, 3)
  }, [completedWorkoutsData, workouts])

  // Calculate trends for body part stats
  const getBodyPartTrends = useCallback(() => {
    if (!completedWorkoutsData || completedWorkoutsData.length === 0) return []

    // Get today's date and date from a week ago
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)

    // Get two weeks ago date for comparison
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(today.getDate() - 14)

    // Get stats with trends
    const stats = getBodyPartStats()

    // Calculate trend for each body part
    return stats.map((stat) => {
      const bodyPart = stat.category

      // Count workouts for this body part in the last week
      const lastWeekCount = completedWorkoutsData.filter((workout) => {
        const workoutDate = new Date(workout.completed_date)
        const matchingWorkout = workouts.find((w) => w.workout_id === workout.workout_id)
        return (
          workoutDate >= oneWeekAgo && workoutDate <= today && matchingWorkout && matchingWorkout.body_part === bodyPart
        )
      }).length

      // Count workouts for this body part in the previous week
      const previousWeekCount = completedWorkoutsData.filter((workout) => {
        const workoutDate = new Date(workout.completed_date)
        const matchingWorkout = workouts.find((w) => w.workout_id === workout.workout_id)
        return (
          workoutDate >= twoWeeksAgo &&
          workoutDate < oneWeekAgo &&
          matchingWorkout &&
          matchingWorkout.body_part === bodyPart
        )
      }).length

      // Calculate trend
      let trend = 0
      if (previousWeekCount === 0) {
        trend = lastWeekCount > 0 ? 100 : 0
      } else {
        trend = Math.round(((lastWeekCount - previousWeekCount) / previousWeekCount) * 100)
      }

      return {
        ...stat,
        trend,
      }
    })
  }, [completedWorkoutsData, workouts, getBodyPartStats])

  // Get stats for specific body parts (chest, legs, arms)
  const getSpecificBodyPartStats = useCallback(() => {
    if (!completedWorkoutsData || completedWorkoutsData.length === 0) return []

    // Define the specific body parts we want to track
    const specificBodyParts = ["Chest", "Legs", "Arms"]

    // Create a map to store body part counts
    const bodyPartCounts: Record<string, number> = {}

    // Initialize counts for our specific body parts
    specificBodyParts.forEach((part) => {
      bodyPartCounts[part] = 0
    })

    // Count completed workouts by body part
    completedWorkoutsData.forEach((completedWorkout) => {
      // Find the workout details
      const workout = workouts.find((w) => w.workout_id === completedWorkout.workout_id)
      if (workout && workout.body_part) {
        const bodyPart = workout.body_part

        // Check if this is one of our specific body parts or can be mapped to one
        if (specificBodyParts.includes(bodyPart)) {
          bodyPartCounts[bodyPart] = (bodyPartCounts[bodyPart] || 0) + 1
        } else if (bodyPart.toLowerCase().includes("chest")) {
          bodyPartCounts["Chest"] = (bodyPartCounts["Chest"] || 0) + 1
        } else if (
          bodyPart.toLowerCase().includes("leg") ||
          bodyPart.toLowerCase().includes("quad") ||
          bodyPart.toLowerCase().includes("hamstring")
        ) {
          bodyPartCounts["Legs"] = (bodyPartCounts["Legs"] || 0) + 1
        } else if (
          bodyPart.toLowerCase().includes("arm") ||
          bodyPart.toLowerCase().includes("bicep") ||
          bodyPart.toLowerCase().includes("tricep")
        ) {
          bodyPartCounts["Arms"] = (bodyPartCounts["Arms"] || 0) + 1
        }
      }
    })

    // Convert to array of stats
    const stats = specificBodyParts.map((bodyPart) => ({
      category: bodyPart,
      count: bodyPartCounts[bodyPart].toString(),
      // We'll calculate trend later
      trend: 0,
    }))

    return stats
  }, [completedWorkoutsData, workouts])

  // Calculate trends for specific body parts
  const getSpecificBodyPartTrends = useCallback(() => {
    if (!completedWorkoutsData || completedWorkoutsData.length === 0) return []

    // Get today's date and date from a week ago
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)

    // Get two weeks ago date for comparison
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(today.getDate() - 14)

    // Get stats without trends
    const stats = getSpecificBodyPartStats()

    // Calculate trend for each body part
    return stats.map((stat) => {
      const bodyPart = stat.category

      // Count workouts for this body part in the last week
      const lastWeekCount = completedWorkoutsData.filter((workout) => {
        const workoutDate = new Date(workout.completed_date)
        const matchingWorkout = workouts.find((w) => w.workout_id === workout.workout_id)

        if (!matchingWorkout) return false

        // Check if this workout matches our body part
        let matches = false
        if (matchingWorkout.body_part === bodyPart) {
          matches = true
        } else if (bodyPart === "Chest" && matchingWorkout.body_part.toLowerCase().includes("chest")) {
          matches = true
        } else if (
          bodyPart === "Legs" &&
          (matchingWorkout.body_part.toLowerCase().includes("leg") ||
            matchingWorkout.body_part.toLowerCase().includes("quad") ||
            matchingWorkout.body_part.toLowerCase().includes("hamstring"))
        ) {
          matches = true
        } else if (
          bodyPart === "Arms" &&
          (matchingWorkout.body_part.toLowerCase().includes("arm") ||
            matchingWorkout.body_part.toLowerCase().includes("bicep") ||
            matchingWorkout.body_part.toLowerCase().includes("tricep"))
        ) {
          matches = true
        }

        return workoutDate >= oneWeekAgo && workoutDate <= today && matches
      }).length

      // Count workouts for this body part in the previous week
      const previousWeekCount = completedWorkoutsData.filter((workout) => {
        const workoutDate = new Date(workout.completed_date)
        const matchingWorkout = workouts.find((w) => w.workout_id === workout.workout_id)

        if (!matchingWorkout) return false

        // Check if this workout matches our body part
        let matches = false
        if (matchingWorkout.body_part === bodyPart) {
          matches = true
        } else if (bodyPart === "Chest" && matchingWorkout.body_part.toLowerCase().includes("chest")) {
          matches = true
        } else if (
          bodyPart === "Legs" &&
          (matchingWorkout.body_part.toLowerCase().includes("leg") ||
            matchingWorkout.body_part.toLowerCase().includes("quad") ||
            matchingWorkout.body_part.toLowerCase().includes("hamstring"))
        ) {
          matches = true
        } else if (
          bodyPart === "Arms" &&
          (matchingWorkout.body_part.toLowerCase().includes("arm") ||
            matchingWorkout.body_part.toLowerCase().includes("bicep") ||
            matchingWorkout.body_part.toLowerCase().includes("tricep"))
        ) {
          matches = true
        }

        return workoutDate >= twoWeeksAgo && workoutDate < oneWeekAgo && matches
      }).length

      // Calculate trend
      let trend = 0
      if (previousWeekCount === 0) {
        trend = lastWeekCount > 0 ? 100 : 0
      } else {
        trend = Math.round(((lastWeekCount - previousWeekCount) / previousWeekCount) * 100)
      }

      return {
        ...stat,
        trend,
      }
    })
  }, [completedWorkoutsData, workouts, getSpecificBodyPartStats])

  // Add these functions to the return statement
  return {
    workouts,
    loading,
    refreshing,
    onRefresh,
    refreshWorkouts, // Expose the refresh function
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
    getWorkoutTrend,
    getCalorieTrend,
    getDurationTrend,
    getRandomWorkout,
    getBodyPartStats,
    getBodyPartTrends,
    getSpecificBodyPartStats,
    getSpecificBodyPartTrends,
  }
}
