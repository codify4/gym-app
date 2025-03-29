import { supabase } from "./supabase"

// Types
export interface Exercise {
  exercise_id: number
  name: string
  sets: number
  reps: number
  weight: number | null
  image: string | null
  tips: string | null
  workout_id?: string
  user_id?: string
  body_part?: string
}

export interface Workout {
  workout_id: string
  title: string
  duration: number
  body_part: string
  image: string | null
  last_performed: string | null
  user_id: string
  exercises?: Exercise[]
  calories?: number
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
    // Insert the workout without explicitly providing a workout_id
    // Supabase will handle the UUID generation
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
        workout_id: workout.workout_id,
        user_id: userId, // Add user_id to satisfy RLS policy
        body_part: workoutData.body_part, // Add the body part from the workout
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

/**
 * Maps exercise names and body parts to appropriate anatomy images
 * @param exerciseName The name of the exercise
 * @param bodyPart Optional body part targeted by the exercise
 * @returns Image source for the appropriate anatomy image
 */
export const getExerciseImage = (exerciseName: string, bodyPart?: string): any => {
  // Normalize input for better matching
  const name = exerciseName.toLowerCase().trim()
  const part = bodyPart?.toLowerCase().trim()

  // Check for specific exercise names first
  if (
    name.includes("bench press") ||
    name.includes("push up") ||
    name.includes("chest fly") ||
    name.includes("chest press") ||
    name.includes("pec") ||
    name.includes("chest")
  ) {
    return require("@/assets/images/anatomy/chest.png")
  }

  if (
    name.includes("bicep curl") ||
    name.includes("hammer curl") ||
    name.includes("preacher curl") ||
    name.includes("concentration curl") ||
    name.includes("bicep")
  ) {
    return require("@/assets/images/anatomy/bicep.png")
  }

  if (
    name.includes("tricep") ||
    name.includes("skull crusher") ||
    name.includes("pushdown") ||
    name.includes("dip") ||
    name.includes("close grip")
  ) {
    return require("@/assets/images/anatomy/tricep.png")
  }

  if (
    name.includes("squat") ||
    name.includes("leg press") ||
    name.includes("leg extension") ||
    name.includes("lunge") ||
    name.includes("quad")
  ) {
    return require("@/assets/images/anatomy/quads.png")
  }

  if (
    name.includes("deadlift") ||
    name.includes("pull up") ||
    name.includes("row") ||
    name.includes("lat pulldown") ||
    name.includes("lat")
  ) {
    return require("@/assets/images/anatomy/lats.png")
  }

  if (
    name.includes("shoulder press") ||
    name.includes("lateral raise") ||
    name.includes("side raise") ||
    name.includes("side delt")
  ) {
    return require("@/assets/images/anatomy/side-dealts.png")
  }

  if (name.includes("rear delt") || name.includes("reverse fly") || name.includes("face pull")) {
    return require("@/assets/images/anatomy/rear-dealts.png")
  }

  if (name.includes("front raise") || name.includes("front delt")) {
    return require("@/assets/images/anatomy/front-dealts.png")
  }

  if (name.includes("calf raise") || name.includes("calf")) {
    return require("@/assets/images/anatomy/calves.png")
  }

  if (
    name.includes("hamstring curl") ||
    name.includes("hamstring") ||
    name.includes("leg curl") ||
    name.includes("romanian deadlift")
  ) {
    return require("@/assets/images/anatomy/hamstrings.png")
  }

  if (
    name.includes("ab") ||
    name.includes("crunch") ||
    name.includes("sit up") ||
    name.includes("plank") ||
    name.includes("core")
  ) {
    return require("@/assets/images/anatomy/abs.png")
  }

  if (name.includes("oblique") || name.includes("side bend") || name.includes("russian twist")) {
    return require("@/assets/images/anatomy/obliques.png")
  }

  if (name.includes("trap") || name.includes("shrug")) {
    return require("@/assets/images/anatomy/traps.png")
  }

  if (name.includes("forearm") || name.includes("wrist curl") || name.includes("grip")) {
    return require("@/assets/images/anatomy/forearms.png")
  }

  if (name.includes("hip thrust") || name.includes("glute bridge") || name.includes("hip")) {
    return require("@/assets/images/anatomy/hip.png")
  }

  if (name.includes("adductor") || name.includes("inner thigh")) {
    return require("@/assets/images/anatomy/hip-adductor.png")
  }

  if (
    name.includes("back extension") ||
    name.includes("hyperextension") ||
    name.includes("good morning") ||
    name.includes("upper back")
  ) {
    return require("@/assets/images/anatomy/up-back.png")
  }

  // If no match by exercise name, try matching by body part
  if (part) {
    if (part.includes("chest")) {
      return require("@/assets/images/anatomy/chest.png")
    }
    if (part.includes("bicep") || part.includes("arm")) {
      return require("@/assets/images/anatomy/bicep.png")
    }
    if (part.includes("tricep") || part.includes("arm")) {
      return require("@/assets/images/anatomy/tricep.png")
    }
    if (part.includes("quad") || part.includes("leg")) {
      return require("@/assets/images/anatomy/quads.png")
    }
    if (part.includes("back") || part.includes("lat")) {
      return require("@/assets/images/anatomy/lats.png")
    }
    if (part.includes("shoulder")) {
      return require("@/assets/images/anatomy/side-dealts.png")
    }
    if (part.includes("calf")) {
      return require("@/assets/images/anatomy/calves.png")
    }
    if (part.includes("hamstring")) {
      return require("@/assets/images/anatomy/hamstrings.png")
    }
    if (part.includes("ab") || part.includes("core")) {
      return require("@/assets/images/anatomy/abs.png")
    }
    if (part.includes("trap")) {
      return require("@/assets/images/anatomy/traps.png")
    }
    if (part.includes("forearm")) {
      return require("@/assets/images/anatomy/forearms.png")
    }
  }

  // Default image if no match is found
  return require("@/assets/images/anatomy/chest.png")
}

// Helper function to get just the image name based on exercise
function getImageNameFromExercise(exerciseName: string, bodyPart?: string): string {
  const name = exerciseName.toLowerCase().trim()
  const part = bodyPart?.toLowerCase().trim()

  if (name.includes("chest") || part?.includes("chest")) return "chest.png"
  if (name.includes("bicep") || part?.includes("bicep")) return "bicep.png"
  if (name.includes("tricep") || part?.includes("tricep")) return "tricep.png"
  if (name.includes("quad") || part?.includes("quad") || name.includes("leg") || part?.includes("leg"))
    return "quads.png"
  if (name.includes("lat") || part?.includes("lat") || name.includes("back") || part?.includes("back"))
    return "lats.png"
  if (name.includes("shoulder") || part?.includes("shoulder")) return "side-dealts.png"
  if (name.includes("calf") || part?.includes("calf")) return "calves.png"
  if (name.includes("hamstring") || part?.includes("hamstring")) return "hamstrings.png"
  if (name.includes("ab") || part?.includes("ab") || name.includes("core") || part?.includes("core")) return "abs.png"
  if (name.includes("trap") || part?.includes("trap")) return "traps.png"
  if (name.includes("forearm") || part?.includes("forearm")) return "forearms.png"

  // Default
  return "chest.png"
}

// Update the addExercise function to use the getExerciseImage utility
export const addExercise = async (
  userId: string | undefined,
  workoutId: string | number,
  exerciseData: Omit<Exercise, "id" | "workout_id" | "user_id" | "image">,
): Promise<Exercise | null> => {
  if (!userId) return null

  try {
    // For database storage, we need to convert the require() result to a string path
    // We'll store the path in a format that can be used by the Image component
    const imagePath = `anatomy/${getImageNameFromExercise(exerciseData.name, exerciseData.body_part)}`

    // Get the workout to get its body_part
    const { data: workout, error: workoutError } = await supabase
      .from("workout")
      .select("body_part")
      .eq("workout_id", workoutId)
      .single()

    if (workoutError) {
      console.error("Error fetching workout for body part:", workoutError)
    }

    const body_part = workout?.body_part || exerciseData.body_part || "All"

    const { data, error } = await supabase
      .from("exercise")
      .insert([
        {
          ...exerciseData,
          image: imagePath, // Store the path in the database
          workout_id: workoutId,
          user_id: userId, // Add user_id to satisfy RLS policy
          body_part, // Add the body part from the workout
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
export const deleteExercise = async (exerciseId: number): Promise<boolean> => {
  try {
    console.log("API: Deleting exercise with ID:", exerciseId)

    const { error } = await supabase.from("exercise").delete().eq("exercise_id", exerciseId)

    if (error) {
      console.error("API: Error deleting exercise:", error)
      return false
    }

    console.log("API: Successfully deleted exercise")
    return true
  } catch (error) {
    console.error("API: Error in deleteExercise:", error)
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
    await supabase.from("workout").update({ last_performed: completedDate }).eq("workout_id", workoutId)

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