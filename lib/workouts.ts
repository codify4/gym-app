import { supabase } from "./supabase"

// Types
export interface Exercise {
  id: string // or number if your IDs are integers
  name: string
  sets: number
  reps: number
  image: string | null
  tips: string | null
  workout_id?: string // or number if your IDs are integers
  user_id?: string
}

export interface Workout {
  // Use the correct primary key name based on your schema
  // This could be 'id' or 'workout_id' based on the error
  workout_id: string // or number if your IDs are integers
  title: string
  duration: number
  body_part: string
  image: string | null
  last_performed: string | null
  user_id: string
  exercises?: Exercise[]
}

export interface CompletedWorkout {
  id: string // or number
  workout_id: string // or number
  user_id: string
  completed_date: string
}

// Fetch all workouts for a user with their exercises
export const fetchWorkouts = async (userId: string | undefined): Promise<Workout[]> => {
  if (!userId) return []

  try {
    // First get all workouts
    // Note: Use the correct column name for the primary key (workout_id or id)
    const { data: workouts, error: workoutsError } = await supabase
      .from("workout")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (workoutsError) {
      console.error("Error fetching workouts:", workoutsError)
      return []
    }

    if (!workouts || workouts.length === 0) {
      return []
    }

    // Then get all exercises for these workouts
    // Use the correct primary key name from workout table
    const workoutIds = workouts.map((workout) => workout.workout_id || workout.id)
    const { data: exercises, error: exercisesError } = await supabase
      .from("exercise")
      .select("*")
      .in("workout_id", workoutIds)

    if (exercisesError) {
      console.error("Error fetching exercises:", exercisesError)
      return workouts
    }

    // Map exercises to their respective workouts
    // Use the correct primary key name
    const workoutsWithExercises = workouts.map((workout) => ({
      ...workout,
      exercises: exercises?.filter((exercise) => exercise.workout_id === (workout.workout_id || workout.id)) || [],
    }))

    return workoutsWithExercises
  } catch (error) {
    console.error("Error in fetchWorkouts:", error)
    return []
  }
}

// Add a new workout with multiple exercises
export const addWorkout = async (
  userId: string | undefined,
  workoutData: Omit<Workout, "workout_id">,
  exercisesData: Omit<Exercise, "id" | "workout_id">[],
): Promise<Workout | null> => {
  if (!userId) return null

  try {
    // Insert the workout with the generated workout_id
    const { data: workout, error: workoutError } = await supabase
      .from("workout")
      .insert([
        {
          ...workoutData,
          user_id: userId,
        },
      ])
      .select()
      .single()

    if (workoutError) {
      console.error("Error adding workout:", workoutError)
      return null
    }

    if (!workout) {
      console.error("No workout returned after insert")
      return null
    }

    // Insert all exercises with the workout_id and user_id
    if (exercisesData.length > 0) {
      const exercisesWithIds = exercisesData.map((exercise) => ({
        ...exercise,
        workout_id: workout.workout_id, // Use the workout_id returned from Supabase
        user_id: userId // Add user_id to satisfy RLS policy
      }))
    
      const { data: exercises, error: exercisesError } = await supabase
        .from("exercise")
        .insert(exercisesWithIds)
        .select()
    
      if (exercisesError) {
        console.error("Error adding exercises:", exercisesError)
        // We still return the workout even if exercises failed
      }
    
      // Return the workout with exercises
      return {
        ...workout,
        exercises: exercises || [],
      }
    }

    return workout
  } catch (error) {
    console.error("Error in addWorkout:", error)
    return null
  }
}

// Update a workout
export const updateWorkout = async (
  workoutId: string | number,
  workoutData: Partial<Workout>,
): Promise<Workout | null> => {
  try {
    // Use the correct primary key column name
    const { data, error } = await supabase
      .from("workout")
      .update(workoutData)
      .eq("workout_id", workoutId) // Change to "id" if that's your primary key
      .select()
      .single()

    if (error) {
      console.error("Error updating workout:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateWorkout:", error)
    return null
  }
}

// Delete a workout and its exercises
export const deleteWorkout = async (workoutId: string | number): Promise<boolean> => {
  try {
    // First delete all exercises for this workout
    const { error: exercisesError } = await supabase.from("exercise").delete().eq("workout_id", workoutId)

    if (exercisesError) {
      console.error("Error deleting exercises:", exercisesError)
      return false
    }

    // Then delete the workout
    // Use the correct primary key column name
    const { error: workoutError } = await supabase.from("workout").delete().eq("workout_id", workoutId) // Change to "id" if that's your primary key

    if (workoutError) {
      console.error("Error deleting workout:", workoutError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteWorkout:", error)
    return false
  }
}

// Add an exercise to a workout
export const addExercise = async (
  userId: string | undefined,
  workoutId: string | number,
  exerciseData: Omit<Exercise, "id" | "workout_id" | "user_id">,
): Promise<Exercise | null> => {
  if (!userId) return null

  try {
    const { data, error } = await supabase
      .from("exercise")
      .insert([
        {
          ...exerciseData,
          workout_id: workoutId,
          user_id: userId, // Add user_id to satisfy RLS policy
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error adding exercise:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in addExercise:", error)
    return null
  }
}

// Update an exercise
export const updateExercise = async (
  exerciseId: string | number,
  exerciseData: Partial<Exercise>,
): Promise<Exercise | null> => {
  try {
    const { data, error } = await supabase.from("exercise").update(exerciseData).eq("id", exerciseId).select().single()

    if (error) {
      console.error("Error updating exercise:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateExercise:", error)
    return null
  }
}

// Delete an exercise
export const deleteExercise = async (exerciseId: string | number): Promise<boolean> => {
  try {
    const { error } = await supabase.from("exercise").delete().eq("id", exerciseId)

    if (error) {
      console.error("Error deleting exercise:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteExercise:", error)
    return false
  }
}

// Mark a workout as completed
export const completeWorkout = async (
  userId: string | undefined,
  workoutId: string | number,
): Promise<CompletedWorkout | null> => {
  if (!userId) return null

  try {
    const completedDate = new Date().toISOString()

    const { data, error } = await supabase
      .from("completed_workout")
      .insert([
        {
          workout_id: workoutId,
          user_id: userId,
          completed_date: completedDate,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error completing workout:", error)
      return null
    }

    // Update the last_performed date on the workout
    // Use the correct primary key column name
    await supabase.from("workout").update({ last_performed: completedDate }).eq("workout_id", workoutId) // Change to "id" if that's your primary key

    return data
  } catch (error) {
    console.error("Error in completeWorkout:", error)
    return null
  }
}

// Check if a workout is completed on a specific date
export const isWorkoutCompletedOnDate = async (
  userId: string | undefined,
  workoutId: string | number,
  date: Date = new Date(),
): Promise<boolean> => {
  if (!userId) return false

  try {
    // Format the date to match the database format (YYYY-MM-DD)
    const formattedDate = date.toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("completed_workout")
      .select("*")
      .eq("workout_id", workoutId)
      .eq("user_id", userId)
      .gte("completed_date", `${formattedDate}T00:00:00.000Z`)
      .lt("completed_date", `${formattedDate}T23:59:59.999Z`)

    if (error) {
      console.error("Error checking completed workout:", error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error("Error in isWorkoutCompletedOnDate:", error)
    return false
  }
}

