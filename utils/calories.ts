// MET values for different exercise types
// MET = Metabolic Equivalent of Task
// Values from the Compendium of Physical Activities
export const MET_VALUES: Record<string, number> = {
  // Strength training
  "weight lifting": 3.5,
  "resistance training": 3.5,
  "bodyweight exercise": 3.8,
  "circuit training": 4.3,

  // Cardio
  running: 8.0,
  jogging: 7.0,
  cycling: 7.5,
  swimming: 6.0,
  rowing: 7.0,
  elliptical: 5.0,
  "stair climbing": 9.0,
  "jump rope": 10.0,

  // Specific body parts
  chest: 3.5,
  back: 3.5,
  legs: 4.0,
  shoulders: 3.5,
  arms: 3.0,
  core: 3.0,
  abs: 3.0,

  // Default value for unknown exercise types
  default: 3.5,
}

// Default user weight in kg (can be replaced with actual user weight later)
export const DEFAULT_USER_WEIGHT_KG = 70
  
/**
 * Calculate calories burned during a workout
 * Formula: Calories = MET * Weight (kg) * Duration (hours)
 *
 * @param bodyPart The primary body part or exercise type
 * @param durationMinutes Duration of the workout in minutes
 * @param weightKg User's weight in kg (optional, defaults to 70kg)
 * @returns Estimated calories burned
*/
export const calculateCaloriesBurned = (
  bodyPart: string,
  durationMinutes: number,
  weightKg: number = DEFAULT_USER_WEIGHT_KG,
): number => {
  // Convert body part to lowercase for matching
  const normalizedBodyPart = bodyPart.toLowerCase()

  // Find the appropriate MET value
  let metValue = MET_VALUES.default

  // Try to find a direct match
  if (normalizedBodyPart in MET_VALUES) {
    metValue = MET_VALUES[normalizedBodyPart]
  } else {
    // Try to find a partial match
    for (const [key, value] of Object.entries(MET_VALUES)) {
      if (normalizedBodyPart.includes(key)) {
        metValue = value
        break
      }
    }
  }

  // Convert duration from minutes to hours
  const durationHours = durationMinutes / 60

  // Calculate calories: MET * weight (kg) * duration (hours)
  const calories = metValue * weightKg * durationHours

  // Round to nearest whole number
  return Math.round(calories)
}

/**
 * Get a formatted string of calories burned
 * @param calories Number of calories
 * @returns Formatted string (e.g., "150 kcal")
 */
export const formatCalories = (calories: number): string => {
  return `${calories} kcal`
}
    