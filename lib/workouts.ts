import { Exercise } from "./exercises"
import { supabase } from "./supabase"

export interface Workout {
  workout_id: string
  title: string
  duration: number
  body_part: string
  image: string | null
  last_performed: string | null
  user_id: string
  exercises?: Exercise[]
  calories?: number // Add calories field
}

export interface CompletedWorkout {
  id: string
  workout_id: string
  user_id: string
  completed_date: string
}

// Fetch all workouts for a user with their exercises
export const fetchWorkouts = async (userId: string | undefined): Promise<Workout[]> => {
  if (!userId) return []

  try {
    // First get all workouts
    const { data: workouts, error: workoutsError } = await supabase
      .from("workout")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (workoutsError) {
      console.error("Error fetching workouts:", workoutsError)
      return []
    }

    if (!workouts || workouts.length === 0) {
      return []
    }

    // Then get all exercises for these workouts
    const workoutIds = workouts.map((workout) => workout.workout_id)
    const { data: exercises, error: exercisesError } = await supabase
      .from("exercise")
      .select("*")
      .in("workout_id", workoutIds)

    if (exercisesError) {
      console.error("Error fetching exercises:", exercisesError)
      return workouts
    }

    // Map exercises to their respective workouts
    const workoutsWithExercises = workouts.map((workout) => ({
      ...workout,
      exercises: exercises?.filter((exercise) => exercise.workout_id === workout.workout_id) || [],
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
  exercisesData: Omit<Exercise, "exercise_id" | "workout_id">[],
): Promise<Workout | null> => {
  if (!userId) return null

  try {
    // Format the date properly to avoid timezone issues
    const formattedWorkoutData = { ...workoutData }

    // If last_performed is provided, ensure it's in ISO format without timezone info
    if (formattedWorkoutData.last_performed) {
      // Parse the date and convert to ISO string, then remove timezone part
      const date = new Date(formattedWorkoutData.last_performed)
      formattedWorkoutData.last_performed = date.toISOString().split("T")[0] + "T00:00:00Z"
    }

    // Insert the workout without explicitly providing a workout_id
    // Supabase will handle the UUID generation
    const { data: workout, error: workoutError } = await supabase
      .from("workout")
      .insert([
        {
          ...formattedWorkoutData,
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
        workout_id: workout.workout_id,
        user_id: userId, // Add user_id to satisfy RLS policy
        body_part: formattedWorkoutData.body_part, // Add the body part from the workout
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
      .eq("workout_id", workoutId)
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
    const { error: workoutError } = await supabase.from("workout").delete().eq("workout_id", workoutId)

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

// Mark a workout as completed
export const completeWorkout = async (
  userId: string | undefined,
  workoutId: string | number,
): Promise<CompletedWorkout | null> => {
  if (!userId) return null

  try {
    // Format date in ISO format without timezone info
    const now = new Date()
    const completedDate = now.toISOString()

    console.log(`Marking workout ${workoutId} as completed at ${completedDate}`)

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

    console.log("Completed workout data:", data)

    // Update the last_performed date on the workout
    const { error: updateError } = await supabase
      .from("workout")
      .update({ last_performed: completedDate })
      .eq("workout_id", workoutId)

    if (updateError) {
      console.error("Error updating last_performed date:", updateError)
    } else {
      console.log(`Updated last_performed date for workout ${workoutId}`)
    }

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

    console.log(`Checking if workout ${workoutId} is completed on ${formattedDate}`)

    const { data, error } = await supabase
      .from("completed_workout")
      .select("*")
      .eq("workout_id", workoutId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error checking completed workout:", error)
      return false
    }

    // Check if any of the completed dates match the requested date
    const isCompleted =
      data &&
      data.some((record) => {
        const recordDate = new Date(record.completed_date).toISOString().split("T")[0]
        const matches = recordDate === formattedDate
        console.log(`Comparing dates: ${recordDate} vs ${formattedDate} = ${matches}`)
        return matches
      })

    return !!isCompleted
  } catch (error) {
    console.error("Error in isWorkoutCompletedOnDate:", error)
    return false
  }
}