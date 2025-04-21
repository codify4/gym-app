import { Exercise } from '@/lib/exercises';

// Comprehensive exercise database with shuffled exercises
export const exercisesList: Exercise[] = [
  {
    exercise_id: 1,
    name: "Bench Press",
    sets: 3,
    reps: 8,
    weight: 100,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Keep your back arched and drive through your feet for stability.",
    body_part: "chest"
  },
  {
    exercise_id: 19,
    name: "Squat",
    sets: 4,
    reps: 8,
    weight: 150,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Keep your chest up and knees tracking over your toes.",
    body_part: "quads"
  },
  {
    exercise_id: 13,
    name: "Barbell Curl",
    sets: 3,
    reps: 10,
    weight: 45,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Keep your elbows fixed at your sides throughout the movement.",
    body_part: "biceps"
  },
  {
    exercise_id: 7,
    name: "Lat Pulldown",
    sets: 3,
    reps: 12,
    weight: 120,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Pull the bar to your upper chest while keeping your chest up.",
    body_part: "back"
  },
  {
    exercise_id: 27,
    name: "Crunch",
    sets: 3,
    reps: 20,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Focus on contracting your abs, not pulling with your neck.",
    body_part: "abs"
  },
  {
    exercise_id: 16,
    name: "Tricep Pushdown",
    sets: 3,
    reps: 12,
    weight: 50,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Keep your elbows at your sides and focus on extending your arms.",
    body_part: "triceps"
  },
  {
    exercise_id: 9,
    name: "Overhead Press",
    sets: 3,
    reps: 8,
    weight: 60,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Keep your core tight and press straight up.",
    body_part: "shoulders"
  },
  {
    exercise_id: 35,
    name: "Hip Thrust",
    sets: 3,
    reps: 12,
    weight: 140,
    image: require("@/assets/images/anatomy/hip.png"),
    tips: "Drive through your heels and squeeze your glutes at the top.",
    body_part: "glutes"
  },
  {
    exercise_id: 25,
    name: "Standing Calf Raise",
    sets: 4,
    reps: 15,
    weight: 100,
    image: require("@/assets/images/anatomy/calves.png"),
    tips: "Rise as high as possible on your toes for full contraction.",
    body_part: "calves"
  },
  {
    exercise_id: 22,
    name: "Romanian Deadlift",
    sets: 3,
    reps: 10,
    weight: 120,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Keep a slight bend in your knees and focus on hip hinge.",
    body_part: "hamstrings"
  },
  {
    exercise_id: 2,
    name: "Incline Dumbbell Press",
    sets: 3,
    reps: 10,
    weight: 60,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Keep your shoulders back and focus on upper chest activation.",
    body_part: "chest"
  },
  {
    exercise_id: 31,
    name: "Barbell Shrug",
    sets: 3,
    reps: 12,
    weight: 100,
    image: require("@/assets/images/anatomy/traps.png"),
    tips: "Lift your shoulders straight up, not forward or backward.",
    body_part: "traps"
  },
  {
    exercise_id: 39,
    name: "Deadlift",
    sets: 4,
    reps: 6,
    weight: 180,
    image: require("@/assets/images/anatomy/up-back.png"),
    tips: "Keep the bar close to your body throughout the movement.",
    body_part: "back"
  },
  {
    exercise_id: 6,
    name: "Bent Over Row",
    sets: 3,
    reps: 10,
    weight: 80,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Keep your back flat and pull to your lower ribs.",
    body_part: "back"
  },
  {
    exercise_id: 30,
    name: "Russian Twist",
    sets: 3,
    reps: 20,
    weight: 10,
    image: require("@/assets/images/anatomy/obliques.png"),
    tips: "Rotate from your core, not your shoulders.",
    body_part: "obliques"
  },
  {
    exercise_id: 14,
    name: "Hammer Curl",
    sets: 3,
    reps: 12,
    weight: 30,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Maintain a neutral grip and focus on the brachialis.",
    body_part: "biceps"
  },
  {
    exercise_id: 20,
    name: "Leg Press",
    sets: 3,
    reps: 12,
    weight: 200,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Don't lock your knees at the top of the movement.",
    body_part: "quads"
  },
  {
    exercise_id: 37,
    name: "Adductor Machine",
    sets: 3,
    reps: 15,
    weight: 70,
    image: require("@/assets/images/anatomy/hip-adductor.png"),
    tips: "Start with a wider stance to get a full stretch of the adductors.",
    body_part: "adductors"
  },
  {
    exercise_id: 10,
    name: "Lateral Raise",
    sets: 3,
    reps: 15,
    weight: 15,
    image: require("@/assets/images/anatomy/side-dealts.png"),
    tips: "Lead with your elbows and keep a slight bend in your arm.",
    body_part: "shoulders"
  },
  {
    exercise_id: 33,
    name: "Wrist Curl",
    sets: 3,
    reps: 15,
    weight: 20,
    image: require("@/assets/images/anatomy/forearms.png"),
    tips: "Rest your forearms on a bench with wrists hanging off the edge.",
    body_part: "forearms"
  },
  {
    exercise_id: 4,
    name: "Push-Up",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Keep your core tight and body straight in a plank position.",
    body_part: "chest"
  },
  {
    exercise_id: 40,
    name: "Clean and Press",
    sets: 3,
    reps: 8,
    weight: 80,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Start with a hip hinge, explode up, and catch the bar at shoulders.",
    body_part: "full body"
  },
  {
    exercise_id: 3,
    name: "Chest Fly",
    sets: 3,
    reps: 12,
    weight: 40,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Maintain a slight bend in your elbows throughout the movement.",
    body_part: "chest"
  },
  {
    exercise_id: 18,
    name: "Dips",
    sets: 3,
    reps: 12,
    weight: null,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Lean forward to target chest, stay upright to target triceps.",
    body_part: "triceps"
  },
  {
    exercise_id: 28,
    name: "Plank",
    sets: 3,
    reps: 0,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Hold for 30-60 seconds with a straight body line.",
    body_part: "abs"
  },
  {
    exercise_id: 15,
    name: "Preacher Curl",
    sets: 3,
    reps: 12,
    weight: 40,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Keep your triceps pressed against the pad throughout.",
    body_part: "biceps"
  },
  {
    exercise_id: 5,
    name: "Pull-Up",
    sets: 3,
    reps: 8,
    weight: null,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Pull with your elbows, not your hands, and squeeze your lats at the top.",
    body_part: "back"
  },
  {
    exercise_id: 26,
    name: "Seated Calf Raise",
    sets: 3,
    reps: 20,
    weight: 80,
    image: require("@/assets/images/anatomy/calves.png"),
    tips: "Focus on a slow, controlled movement with full range of motion.",
    body_part: "calves"
  },
  {
    exercise_id: 17,
    name: "Skull Crusher",
    sets: 3,
    reps: 10,
    weight: 40,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Keep your upper arms perpendicular to the floor.",
    body_part: "triceps"
  },
  {
    exercise_id: 29,
    name: "Leg Raise",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Keep your lower back pressed into the ground or bench.",
    body_part: "abs"
  },
  {
    exercise_id: 23,
    name: "Leg Curl",
    sets: 3,
    reps: 12,
    weight: 70,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Squeeze your hamstrings at peak contraction.",
    body_part: "hamstrings"
  },
  {
    exercise_id: 34,
    name: "Reverse Wrist Curl",
    sets: 3,
    reps: 15,
    weight: 15,
    image: require("@/assets/images/anatomy/forearms.png"),
    tips: "Focus on extending your wrists fully against resistance.",
    body_part: "forearms"
  },
  {
    exercise_id: 11,
    name: "Front Raise",
    sets: 3,
    reps: 12,
    weight: 20,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Keep your core engaged and raise to shoulder height.",
    body_part: "shoulders"
  },
  {
    exercise_id: 21,
    name: "Leg Extension",
    sets: 3,
    reps: 15,
    weight: 80,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Focus on squeezing your quads at the top of the movement.",
    body_part: "quads"
  },
  {
    exercise_id: 8,
    name: "T-Bar Row",
    sets: 3,
    reps: 10,
    weight: 90,
    image: require("@/assets/images/anatomy/up-back.png"),
    tips: "Focus on squeezing your shoulder blades together at the top.",
    body_part: "back"
  },
  {
    exercise_id: 36,
    name: "Glute Bridge",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/hip.png"),
    tips: "Keep your core tight and focus on posterior pelvic tilt.",
    body_part: "glutes"
  },
  {
    exercise_id: 12,
    name: "Face Pull",
    sets: 3,
    reps: 15,
    weight: 30,
    image: require("@/assets/images/anatomy/rear-dealts.png"),
    tips: "Pull toward your face with external rotation at the end.",
    body_part: "shoulders"
  },
  {
    exercise_id: 32,
    name: "Upright Row",
    sets: 3,
    reps: 12,
    weight: 60,
    image: require("@/assets/images/anatomy/traps.png"),
    tips: "Keep the bar close to your body as you pull up.",
    body_part: "traps"
  },
  {
    exercise_id: 24,
    name: "Good Morning",
    sets: 3,
    reps: 12,
    weight: 60,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Keep your back flat and bend at the hips, not the waist.",
    body_part: "hamstrings"
  },
  {
    exercise_id: 38,
    name: "Sumo Squat",
    sets: 3,
    reps: 12,
    weight: 100,
    image: require("@/assets/images/anatomy/hip-adductor.png"),
    tips: "Take a wide stance and point toes outward to target inner thighs.",
    body_part: "adductors"
  }
]; 