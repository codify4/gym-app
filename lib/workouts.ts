"use client"

import { supabase } from "./supabase"

// Update the Exercise and Workout interfaces to match your database schema
// Replace the existing interfaces with these:

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  image: string | null
  tips: string | null
  exercise_id: string
}

export interface Workout {
  id: string
  title: string
  exercise_id: string
  duration: number
  last_performed: string | null
  body_part: string
  image: string | null
  user_id: string
  workout_id: string
  created_at?: string
  exercises?: Exercise[] // This is for convenience in the UI, not in the database
}

export interface CompletedWorkout {
  id: string
  workout_id: string
  completed_date: string
  user_id: string
}

export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0]
}

export const getWorkouts = async (userId: string): Promise<Workout[] | null> => {
  try {
    if (!userId) {
      console.error("User ID is required to fetch workouts")
      return null
    }

    const { data: workouts, error } = await supabase
      .from("workout")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching workouts:", error.message)
      throw error
    }

    return workouts
  } catch (error: any) {
    console.error("Error fetching workouts:", error.message)
    return null
  }
}

// Update the getWorkoutWithExercises function to match the new schema
// Replace the existing function with this:

export const getWorkoutWithExercises = async (workoutId: string): Promise<Workout | null> => {
  try {
    if (!workoutId) {
      console.error("Workout ID is required")
      return null
    }

    // First get the workout
    const { data: workout, error: workoutError } = await supabase
      .from("workout")
      .select("*")
      .eq("id", workoutId)
      .single()

    if (workoutError) {
      console.error("Error fetching workout:", workoutError.message)
      throw workoutError
    }

    if (!workout) {
      return null
    }

    // Then get the exercise for this workout
    const { data: exercise, error: exerciseError } = await supabase
      .from("exercise")
      .select("*")
      .eq("id", workout.exercise_id)
      .single()

    if (exerciseError) {
      console.error("Error fetching exercise:", exerciseError.message)
      throw exerciseError
    }

    // Combine the workout with its exercise
    return {
      ...workout,
      exercises: exercise ? [exercise] : [],
    }
  } catch (error: any) {
    console.error("Error fetching workout with exercise:", error.message)
    return null
  }
}

// Update the getExercises function signature to accept a single workoutId
export const getExercises = async (workoutId: string): Promise<Exercise | null> => {
  try {
    if (!workoutId) {
      console.error("Workout ID is required to fetch exercise")
      return null
    }

    // First get the workout to get its exercise_id
    const { data: workout, error: workoutError } = await supabase
      .from("workout")
      .select("exercise_id")
      .eq("id", workoutId)
      .single()

    if (workoutError) {
      console.error("Error fetching workout:", workoutError.message)
      throw workoutError
    }

    if (!workout || !workout.exercise_id) {
      return null
    }

    // Get the exercise
    const { data: exercise, error: exerciseError } = await supabase
      .from("exercise")
      .select("*")
      .eq("id", workout.exercise_id)
      .single()

    if (exerciseError) {
      console.error("Error fetching exercise:", exerciseError.message)
      throw exerciseError
    }

    return exercise
  } catch (error: any) {
    console.error("Error fetching exercise:", error.message)
    return null
  }
}

// Update the createWorkout function to accept a single exercise
export const createWorkout = async (
  workout: Omit<Workout, "id" | "workout_id" | "exercise_id">,
  exercise: Omit<Exercise, "id" | "exercise_id">,
): Promise<Workout | null> => {
  try {
    if (!workout.user_id) {
      console.error("User ID is required to create a workout")
      return null
    }

    // First create the exercise
    const { data: newExercise, error: exerciseError } = await supabase
      .from("exercise")
      .insert({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        image: exercise.image,
        tips: exercise.tips,
      })
      .select()
      .single()

    if (exerciseError) {
      console.error("Error creating exercise:", exerciseError.message)
      throw exerciseError
    }

    // Then create the workout with the exercise_id
    const { data: newWorkout, error: workoutError } = await supabase
      .from("workout")
      .insert({
        title: workout.title,
        exercise_id: newExercise.id,
        duration: workout.duration,
        body_part: workout.body_part,
        image: workout.image,
        user_id: workout.user_id,
      })
      .select()
      .single()

    if (workoutError) {
      console.error("Error creating workout:", workoutError.message)
      throw workoutError
    }

    return {
      ...newWorkout,
      exercises: [newExercise],
    }
  } catch (error: any) {
    console.error("Error creating workout:", error.message)
    return null
  }
}

export const updateWorkout = async (id: string, updates: Partial<Workout>): Promise<Workout | null> => {
  try {
    if (!id) {
      console.error("Workout ID is required for updates")
      return null
    }

    const { data, error } = await supabase.from("workout").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating workout:", error.message)
      throw error
    }

    return data
  } catch (error: any) {
    console.error("Error updating workout:", error.message)
    return null
  }
}

export const updateExercise = async (id: string, updates: Partial<Exercise>): Promise<Exercise | null> => {
  try {
    if (!id) {
      console.error("Exercise ID is required for updates")
      return null
    }

    const { data, error } = await supabase.from("exercise").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating exercise:", error.message)
      throw error
    }

    return data
  } catch (error: any) {
    console.error("Error updating exercise:", error.message)
    return null
  }
}

export const deleteWorkout = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      console.error("Workout ID is required for deletion")
      return false
    }

    // First delete all exercises associated with this workout
    const { error: exercisesError } = await supabase.from("exercise").delete().eq("workout_id", id)

    if (exercisesError) {
      console.error("Error deleting exercises:", exercisesError.message)
      throw exercisesError
    }

    // Then delete the workout
    const { error: workoutError } = await supabase.from("workout").delete().eq("id", id)

    if (workoutError) {
      console.error("Error deleting workout:", workoutError.message)
      throw workoutError
    }

    return true
  } catch (error: any) {
    console.error("Error deleting workout:", error.message)
    return false
  }
}

export const deleteExercise = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      console.error("Exercise ID is required for deletion")
      return false
    }

    const { error } = await supabase.from("exercise").delete().eq("id", id)

    if (error) {
      console.error("Error deleting exercise:", error.message)
      throw error
    }

    return true
  } catch (error: any) {
    console.error("Error deleting exercise:", error.message)
    return false
  }
}

export const recordWorkoutCompletion = async (
  workoutId: string,
  userId: string,
  date: string = getTodayDateString(),
): Promise<boolean> => {
  try {
    // Record the completion
    const { error: completionError } = await supabase.from("completed_workout").insert({
      workout_id: workoutId,
      user_id: userId,
      completed_date: date,
    })

    if (completionError) {
      console.error("Error recording workout completion:", completionError.message)
      throw completionError
    }

    // Update the last_performed date on the workout
    const { error: updateError } = await supabase.from("workout").update({ last_performed: date }).eq("id", workoutId)

    if (updateError) {
      console.error("Error updating workout last_performed date:", updateError.message)
      throw updateError
    }

    return true
  } catch (error: any) {
    console.error("Error recording workout completion:", error.message)
    return false
  }
}

export const isWorkoutCompletedOnDate = async (
  workoutId: string,
  userId: string,
  date: string = getTodayDateString(),
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("completed_workout")
      .select("*")
      .eq("workout_id", workoutId)
      .eq("user_id", userId)
      .eq("completed_date", date)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error checking workout completion:", error.message)
      throw error
    }

    return !!data
  } catch (error: any) {
    console.error("Error checking workout completion:", error.message)
    return false
  }
}

export const getCompletedWorkouts = async (userId: string): Promise<CompletedWorkout[] | null> => {
  try {
    if (!userId) {
      console.error("User ID is required to fetch completed workouts")
      return null
    }

    const { data: completedWorkouts, error } = await supabase
      .from("completed_workout")
      .select("*")
      .eq("user_id", userId)
      .order("completed_date", { ascending: false })

    if (error) {
      console.error("Error fetching completed workouts:", error.message)
      throw error
    }

    return completedWorkouts
  } catch (error: any) {
    console.error("Error fetching completed workouts:", error.message)
    return null
  }
}