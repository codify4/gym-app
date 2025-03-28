/**
 * Utility function to generate exercise tips based on body part or exercise name
 * @param exerciseName The name of the exercise
 * @param bodyPart The body part targeted by the exercise
 * @returns Array of tips for the exercise
 */
export const getExerciseTips = (exerciseName: string, bodyPart?: string): string[] => {
  const name = exerciseName.toLowerCase().trim()
  const part = bodyPart?.toLowerCase().trim()

  // General tips that apply to most exercises
  const generalTips = [
    "Start with proper form and positioning",
    "Perform the movement with controlled motion",
    "Focus on the target muscle group",
    "Breathe properly throughout the exercise",
    "Complete all reps with good form",
  ]

  // Body part specific tips
  if (part === "chest" || name.includes("chest") || name.includes("bench press") || name.includes("push up")) {
    return [
      "Keep your back flat on the bench",
      "Lower the weight with control to chest level",
      "Push through your chest muscles, not just your arms",
      "Keep your elbows at a 45-degree angle to protect your shoulders",
      "Squeeze your chest at the top of the movement",
    ]
  }

  if (
    part === "back" ||
    name.includes("back") ||
    name.includes("row") ||
    name.includes("pull up") ||
    name.includes("lat")
  ) {
    return [
      "Pull with your back muscles, not your arms",
      "Keep your shoulders down and back",
      "Squeeze your shoulder blades together at peak contraction",
      "Maintain a slight arch in your lower back",
      "Focus on a full range of motion",
    ]
  }

  if (
    part === "legs" ||
    name.includes("leg") ||
    name.includes("squat") ||
    name.includes("lunge") ||
    name.includes("quad") ||
    name.includes("hamstring")
  ) {
    return [
      "Keep your knees aligned with your toes",
      "Push through your heels to engage your glutes",
      "Maintain a neutral spine throughout the movement",
      "Lower to at least parallel (for squats)",
      "Engage your core for stability",
    ]
  }

  if (part === "shoulders" || name.includes("shoulder") || name.includes("press") || name.includes("delt")) {
    return [
      "Keep your core tight to avoid arching your back",
      "Press directly overhead, not in front of you",
      "Lower the weight with control to shoulder level",
      "Keep your elbows slightly forward to protect your shoulders",
      "Avoid shrugging your shoulders during the movement",
    ]
  }

  if (part === "arms" || name.includes("bicep") || name.includes("curl")) {
    return [
      "Keep your elbows close to your body",
      "Avoid swinging or using momentum",
      "Fully extend your arms at the bottom",
      "Squeeze your biceps at the top of the movement",
      "Control the weight on the way down",
    ]
  }

  if (name.includes("tricep") || name.includes("extension") || name.includes("pushdown")) {
    return [
      "Keep your elbows close to your body",
      "Fully extend your arms at the bottom of the movement",
      "Keep your upper arms stationary",
      "Focus on squeezing your triceps",
      "Control the weight on the way up",
    ]
  }

  if (name.includes("ab") || name.includes("core") || name.includes("crunch") || name.includes("plank")) {
    return [
      "Keep your lower back pressed into the floor (for crunches)",
      "Engage your core throughout the entire movement",
      "Breathe steadily and don't hold your breath",
      "Focus on quality contractions rather than quantity",
      "Avoid pulling on your neck with your hands",
    ]
  }

  if (name.includes("calf") || name.includes("raise")) {
    return [
      "Stand on the edge of a platform for a full range of motion",
      "Rise up as high as possible onto your toes",
      "Lower your heels below the platform level",
      "Pause at the top of the movement",
      "Perform both slow and explosive repetitions for best results",
    ]
  }

  // Exercise-specific tips
  if (name.includes("deadlift")) {
    return [
      "Keep the bar close to your body throughout the movement",
      "Hinge at your hips, not your waist",
      "Keep your back flat and core engaged",
      "Push through your heels as you stand up",
      "Keep your shoulders back and down",
    ]
  }

  if (name.includes("bench press")) {
    return [
      "Plant your feet firmly on the ground",
      "Keep your wrists straight and elbows at a 45-degree angle",
      "Lower the bar to your mid-chest",
      "Drive your feet into the floor as you push",
      "Keep your glutes and shoulders on the bench",
    ]
  }

  if (name.includes("squat")) {
    return [
      "Keep your chest up and core braced",
      "Push your knees outward as you descend",
      "Aim to get your thighs parallel to the ground or lower",
      "Drive through your heels as you stand up",
      "Keep your back in a neutral position",
    ]
  }

  if (name.includes("pull up") || name.includes("chin up")) {
    return [
      "Start from a dead hang with arms fully extended",
      "Pull your shoulder blades down and back before pulling up",
      "Pull until your chin is over the bar",
      "Lower with control to a full hang",
      "Avoid swinging or kipping unless specifically training for it",
    ]
  }

  if (name.includes("push up")) {
    return [
      "Keep your body in a straight line from head to heels",
      "Position your hands slightly wider than shoulder-width",
      "Lower your chest to just above the ground",
      "Push through your palms and engage your chest",
      "Keep your elbows at a 45-degree angle to your body",
    ]
  }

  // Return general tips if no specific tips are found
  return generalTips
}
  
  