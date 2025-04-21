import { Exercise } from '@/lib/exercises';

// Comprehensive exercise database with shuffled exercises
export const exercisesList: Omit<Exercise, "exercise_id">[] = [
  {
    name: "Bench Press",
    sets: 3,
    reps: 8,
    weight: 100,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Keep your back arched and drive through your feet for stability.",
    body_part: "chest"
  },
  {
    name: "Squat",
    sets: 4,
    reps: 8,
    weight: 150,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Keep your chest up and knees tracking over your toes.",
    body_part: "quads"
  },
  {
    name: "Barbell Curl",
    sets: 3,
    reps: 10,
    weight: 45,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Keep your elbows fixed at your sides throughout the movement.",
    body_part: "biceps"
  },
  {
    name: "Lat Pulldown",
    sets: 3,
    reps: 12,
    weight: 120,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Pull the bar to your upper chest while keeping your chest up.",
    body_part: "back"
  },
  {
    name: "Crunch",
    sets: 3,
    reps: 20,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Focus on contracting your abs, not pulling with your neck.",
    body_part: "abs"
  },
  {
    name: "Tricep Pushdown",
    sets: 3,
    reps: 12,
    weight: 50,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Keep your elbows at your sides and focus on extending your arms.",
    body_part: "triceps"
  },
  {
    name: "Overhead Press",
    sets: 3,
    reps: 8,
    weight: 60,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Keep your core tight and press straight up.",
    body_part: "shoulders"
  },
  {
    name: "Hip Thrust",
    sets: 3,
    reps: 12,
    weight: 140,
    image: require("@/assets/images/anatomy/hip.png"),
    tips: "Drive through your heels and squeeze your glutes at the top.",
    body_part: "glutes"
  },
  {
    name: "Standing Calf Raise",
    sets: 4,
    reps: 15,
    weight: 100,
    image: require("@/assets/images/anatomy/calves.png"),
    tips: "Rise as high as possible on your toes for full contraction.",
    body_part: "calves"
  },
  {
    name: "Romanian Deadlift",
    sets: 3,
    reps: 10,
    weight: 120,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Keep a slight bend in your knees and focus on hip hinge.",
    body_part: "hamstrings"
  },
  {
    name: "Incline Dumbbell Press",
    sets: 3,
    reps: 10,
    weight: 60,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Keep your shoulders back and focus on upper chest activation.",
    body_part: "chest"
  },
  {
    name: "Barbell Shrug",
    sets: 3,
    reps: 12,
    weight: 100,
    image: require("@/assets/images/anatomy/traps.png"),
    tips: "Lift your shoulders straight up, not forward or backward.",
    body_part: "traps"
  },
  {
    name: "Deadlift",
    sets: 4,
    reps: 6,
    weight: 180,
    image: require("@/assets/images/anatomy/up-back.png"),
    tips: "Keep the bar close to your body throughout the movement.",
    body_part: "back"
  },
  {
    name: "Bent Over Row",
    sets: 3,
    reps: 10,
    weight: 80,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Keep your back flat and pull to your lower ribs.",
    body_part: "back"
  },
  {
    name: "Russian Twist",
    sets: 3,
    reps: 20,
    weight: 10,
    image: require("@/assets/images/anatomy/obliques.png"),
    tips: "Rotate from your core, not your shoulders.",
    body_part: "obliques"
  },
  {
    name: "Hammer Curl",
    sets: 3,
    reps: 12,
    weight: 30,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Maintain a neutral grip and focus on the brachialis.",
    body_part: "biceps"
  },
  {
    name: "Leg Press",
    sets: 3,
    reps: 12,
    weight: 200,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Don't lock your knees at the top of the movement.",
    body_part: "quads"
  },
  {
    name: "Adductor Machine",
    sets: 3,
    reps: 15,
    weight: 70,
    image: require("@/assets/images/anatomy/hip-adductor.png"),
    tips: "Start with a wider stance to get a full stretch of the adductors.",
    body_part: "adductors"
  },
  {
    name: "Lateral Raise",
    sets: 3,
    reps: 15,
    weight: 15,
    image: require("@/assets/images/anatomy/side-dealts.png"),
    tips: "Lead with your elbows and keep a slight bend in your arm.",
    body_part: "shoulders"
  },
  {
    name: "Wrist Curl",
    sets: 3,
    reps: 15,
    weight: 20,
    image: require("@/assets/images/anatomy/forearms.png"),
    tips: "Rest your forearms on a bench with wrists hanging off the edge.",
    body_part: "forearms"
  },
  {
    name: "Push-Up",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Keep your core tight and body straight in a plank position.",
    body_part: "chest"
  },
  {
    name: "Clean and Press",
    sets: 3,
    reps: 8,
    weight: 80,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Start with a hip hinge, explode up, and catch the bar at shoulders.",
    body_part: "full body"
  },
  {
    name: "Chest Fly",
    sets: 3,
    reps: 12,
    weight: 40,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Maintain a slight bend in your elbows throughout the movement.",
    body_part: "chest"
  },
  {
    name: "Dips",
    sets: 3,
    reps: 12,
    weight: null,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Lean forward to target chest, stay upright to target triceps.",
    body_part: "triceps"
  },
  {
    name: "Plank",
    sets: 3,
    reps: 0,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Hold for 30-60 seconds with a straight body line.",
    body_part: "abs"
  },
  {
    name: "Preacher Curl",
    sets: 3,
    reps: 12,
    weight: 40,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Keep your triceps pressed against the pad throughout.",
    body_part: "biceps"
  },
  {
    name: "Pull-Up",
    sets: 3,
    reps: 8,
    weight: null,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Pull with your elbows, not your hands, and squeeze your lats at the top.",
    body_part: "back"
  },
  {
    name: "Seated Calf Raise",
    sets: 3,
    reps: 20,
    weight: 80,
    image: require("@/assets/images/anatomy/calves.png"),
    tips: "Focus on a slow, controlled movement with full range of motion.",
    body_part: "calves"
  },
  {
    name: "Skull Crusher",
    sets: 3,
    reps: 10,
    weight: 40,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Keep your upper arms perpendicular to the floor.",
    body_part: "triceps"
  },
  {
    name: "Leg Raise",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Keep your lower back pressed into the ground or bench.",
    body_part: "abs"
  },
  {
    name: "Leg Curl",
    sets: 3,
    reps: 12,
    weight: 70,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Squeeze your hamstrings at peak contraction.",
    body_part: "hamstrings"
  },
  {
    name: "Reverse Wrist Curl",
    sets: 3,
    reps: 15,
    weight: 15,
    image: require("@/assets/images/anatomy/forearms.png"),
    tips: "Focus on extending your wrists fully against resistance.",
    body_part: "forearms"
  },
  {
    name: "Front Raise",
    sets: 3,
    reps: 12,
    weight: 20,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Keep your core engaged and raise to shoulder height.",
    body_part: "shoulders"
  },
  {
    name: "Leg Extension",
    sets: 3,
    reps: 15,
    weight: 80,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Focus on squeezing your quads at the top of the movement.",
    body_part: "quads"
  },
  {
    name: "T-Bar Row",
    sets: 3,
    reps: 10,
    weight: 90,
    image: require("@/assets/images/anatomy/up-back.png"),
    tips: "Focus on squeezing your shoulder blades together at the top.",
    body_part: "back"
  },
  {
    name: "Glute Bridge",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/hip.png"),
    tips: "Keep your core tight and focus on posterior pelvic tilt.",
    body_part: "glutes"
  },
  {
    name: "Face Pull",
    sets: 3,
    reps: 15,
    weight: 30,
    image: require("@/assets/images/anatomy/rear-dealts.png"),
    tips: "Pull toward your face with external rotation at the end.",
    body_part: "shoulders"
  },
  {
    name: "Upright Row",
    sets: 3,
    reps: 12,
    weight: 60,
    image: require("@/assets/images/anatomy/traps.png"),
    tips: "Keep the bar close to your body as you pull up.",
    body_part: "traps"
  },
  {
    name: "Good Morning",
    sets: 3,
    reps: 12,
    weight: 60,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Keep your back flat and bend at the hips, not the waist.",
    body_part: "hamstrings"
  },
  {
    name: "Sumo Squat",
    sets: 3,
    reps: 12,
    weight: 100,
    image: require("@/assets/images/anatomy/hip-adductor.png"),
    tips: "Take a wide stance and point toes outward to target inner thighs.",
    body_part: "adductors"
  },
  {
    name: "Decline Bench Press",
    sets: 3,
    reps: 10,
    weight: 90,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Lower the bar to your lower chest, keeping your elbows at a 45-degree angle.",
    body_part: "chest"
  },
  {
    name: "Cable Fly",
    sets: 3,
    reps: 12,
    weight: 30,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Keep a slight bend in the elbows and focus on bringing hands together in front of you.",
    body_part: "chest"
  },
  {
    name: "Pec Deck",
    sets: 3,
    reps: 12,
    weight: 70,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Focus on squeezing your chest at the peak of contraction.",
    body_part: "chest"
  },
  {
    name: "Single-Arm Dumbbell Row",
    sets: 3,
    reps: 12,
    weight: 45,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Keep your back flat and pull the dumbbell to your hip.",
    body_part: "back"
  },
  {
    name: "Cable Row",
    sets: 3,
    reps: 12,
    weight: 80,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Keep your chest up and pull the handle to your lower ribs.",
    body_part: "back"
  },
  {
    name: "Chin-Up",
    sets: 3,
    reps: 8,
    weight: null,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Use an underhand grip and focus on squeezing your lats.",
    body_part: "back"
  },
  {
    name: "Rack Pull",
    sets: 3,
    reps: 8,
    weight: 200,
    image: require("@/assets/images/anatomy/up-back.png"),
    tips: "Set the pins at knee height and focus on the top portion of the deadlift.",
    body_part: "back"
  },
  {
    name: "Hack Squat",
    sets: 3,
    reps: 10,
    weight: 160,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Keep your back flat against the pad and drive through your heels.",
    body_part: "quads"
  },
  {
    name: "Bulgarian Split Squat",
    sets: 3,
    reps: 10,
    weight: 40,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Keep your front knee tracking over your toes and torso upright.",
    body_part: "quads"
  },
  {
    name: "Front Squat",
    sets: 3,
    reps: 8,
    weight: 120,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Keep your elbows high and chest up throughout the movement.",
    body_part: "quads"
  },
  {
    name: "Walking Lunge",
    sets: 3,
    reps: 20,
    weight: 30,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Take a step forward, lunge down until knee is at 90 degrees, then push through front heel.",
    body_part: "quads"
  },
  {
    name: "Stiff Leg Deadlift",
    sets: 3,
    reps: 10,
    weight: 100,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Keep legs straight with slight knee bend, hinge at hips, and keep back flat.",
    body_part: "hamstrings"
  },
  {
    name: "Nordic Hamstring Curl",
    sets: 3,
    reps: 8,
    weight: null,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Have partner hold ankles, lower torso as far as possible, then pull back up.",
    body_part: "hamstrings"
  },
  {
    name: "Seated Leg Curl",
    sets: 3,
    reps: 12,
    weight: 60,
    image: require("@/assets/images/anatomy/hamstrings.png"),
    tips: "Adjust the machine to fit your leg length and focus on full range of motion.",
    body_part: "hamstrings"
  },
  {
    name: "Donkey Calf Raise",
    sets: 4,
    reps: 15,
    weight: 100,
    image: require("@/assets/images/anatomy/calves.png"),
    tips: "Bend at hips, keep legs straight, and push through balls of feet.",
    body_part: "calves"
  },
  {
    name: "Single Leg Calf Raise",
    sets: 3,
    reps: 15,
    weight: 20,
    image: require("@/assets/images/anatomy/calves.png"),
    tips: "Hold onto something for balance and focus on a full stretch at the bottom.",
    body_part: "calves"
  },
  {
    name: "Reverse Hyperextension",
    sets: 3,
    reps: 12,
    weight: 25,
    image: require("@/assets/images/anatomy/hip.png"),
    tips: "Lie face down on bench with hips at edge, lift legs while keeping them straight.",
    body_part: "glutes"
  },
  {
    name: "Cable Glute Kickback",
    sets: 3,
    reps: 12,
    weight: 20,
    image: require("@/assets/images/anatomy/hip.png"),
    tips: "Attach ankle strap, kick leg back while keeping it straight.",
    body_part: "glutes"
  },
  {
    name: "Arnold Press",
    sets: 3,
    reps: 10,
    weight: 35,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Start with palms facing you, rotate to palms forward as you press up.",
    body_part: "shoulders"
  },
  {
    name: "Upright Cable Row",
    sets: 3,
    reps: 12,
    weight: 50,
    image: require("@/assets/images/anatomy/traps.png"),
    tips: "Pull cable to chin level with elbows leading the movement.",
    body_part: "shoulders"
  },
  {
    name: "Reverse Pec Deck",
    sets: 3,
    reps: 15,
    weight: 50,
    image: require("@/assets/images/anatomy/rear-dealts.png"),
    tips: "Keep chest pressed against pad and focus on squeezing shoulder blades together.",
    body_part: "shoulders"
  },
  {
    name: "Dumbbell Rear Delt Fly",
    sets: 3,
    reps: 15,
    weight: 15,
    image: require("@/assets/images/anatomy/rear-dealts.png"),
    tips: "Bend at hips, keep back flat, and lift dumbbells out to sides.",
    body_part: "shoulders"
  },
  {
    name: "Machine Shoulder Press",
    sets: 3,
    reps: 12,
    weight: 70,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Keep back pressed against seat and push handles directly overhead.",
    body_part: "shoulders"
  },
  {
    name: "Concentration Curl",
    sets: 3,
    reps: 12,
    weight: 25,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Rest elbow on inner thigh and curl dumbbell with no momentum.",
    body_part: "biceps"
  },
  {
    name: "EZ Bar Curl",
    sets: 3,
    reps: 10,
    weight: 50,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Keep elbows at sides and focus on squeezing biceps at the top.",
    body_part: "biceps"
  },
  {
    name: "Incline Dumbbell Curl",
    sets: 3,
    reps: 12,
    weight: 20,
    image: require("@/assets/images/anatomy/bicep.png"),
    tips: "Set bench to 45 degrees and let arms hang fully extended at bottom.",
    body_part: "biceps"
  },
  {
    name: "Cable Tricep Extension",
    sets: 3,
    reps: 12,
    weight: 30,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Keep elbows high and stationary, extend arms fully at bottom.",
    body_part: "triceps"
  },
  {
    name: "Close Grip Bench Press",
    sets: 3,
    reps: 10,
    weight: 80,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Place hands shoulder-width apart and keep elbows close to body.",
    body_part: "triceps"
  },
  {
    name: "Overhead Dumbbell Extension",
    sets: 3,
    reps: 12,
    weight: 25,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Hold dumbbell with both hands overhead, lower behind head, then extend.",
    body_part: "triceps"
  },
  {
    name: "Bench Dip",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Place hands on bench behind you, extend legs, lower body, then push up.",
    body_part: "triceps"
  },
  {
    name: "Farmer's Walk",
    sets: 3,
    reps: 0,
    weight: 70,
    image: require("@/assets/images/anatomy/forearms.png"),
    tips: "Hold heavy dumbbells at sides and walk 40-50 steps maintaining posture.",
    body_part: "forearms"
  },
  {
    name: "Plate Pinch",
    sets: 3,
    reps: 0,
    weight: 10,
    image: require("@/assets/images/anatomy/forearms.png"),
    tips: "Pinch weight plates together with fingers and hold for 30 seconds.",
    body_part: "forearms"
  },
  {
    name: "Ab Wheel Rollout",
    sets: 3,
    reps: 10,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Start on knees, roll wheel forward as far as possible, then pull back.",
    body_part: "abs"
  },
  {
    name: "Cable Crunch",
    sets: 3,
    reps: 15,
    weight: 60,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Kneel facing cable machine, hold rope at temples, crunch downward.",
    body_part: "abs"
  },
  {
    name: "Hanging Leg Raise",
    sets: 3,
    reps: 12,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Hang from bar, keep legs straight, raise until parallel with floor.",
    body_part: "abs"
  },
  {
    name: "Decline Sit-Up",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Hook feet under pads of decline bench, cross arms over chest, sit all the way up.",
    body_part: "abs"
  },
  {
    name: "Side Plank",
    sets: 3,
    reps: 0,
    weight: null,
    image: require("@/assets/images/anatomy/obliques.png"),
    tips: "Hold for 30 seconds on each side with straight body alignment.",
    body_part: "obliques"
  },
  {
    name: "Woodchopper",
    sets: 3,
    reps: 12,
    weight: 25,
    image: require("@/assets/images/anatomy/obliques.png"),
    tips: "Use cable machine, pull handle diagonally across body from high to low.",
    body_part: "obliques"
  },
  {
    name: "Dumbbell Side Bend",
    sets: 3,
    reps: 15,
    weight: 25,
    image: require("@/assets/images/anatomy/obliques.png"),
    tips: "Hold dumbbell at side, bend sideways as far as possible, then return.",
    body_part: "obliques"
  },
  {
    name: "Superman",
    sets: 3,
    reps: 12,
    weight: null,
    image: require("@/assets/images/anatomy/up-back.png"),
    tips: "Lie on stomach, lift arms and legs simultaneously, hold briefly at top.",
    body_part: "lower back"
  },
  {
    name: "Back Extension",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/up-back.png"),
    tips: "Use hyperextension bench, bend at waist, then extend to straight position.",
    body_part: "lower back"
  },
  {
    name: "Pendlay Row",
    sets: 3,
    reps: 8,
    weight: 100,
    image: require("@/assets/images/anatomy/up-back.png"),
    tips: "Start with bar on floor, bend over, pull bar to abdomen, then lower to floor.",
    body_part: "back"
  },
  {
    name: "Standing Cable Rotation",
    sets: 3,
    reps: 12,
    weight: 20,
    image: require("@/assets/images/anatomy/obliques.png"),
    tips: "Stand side-on to cable machine, pull handle across body with extended arms.",
    body_part: "obliques"
  },
  {
    name: "Jump Squat",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Squat down, then explosively jump as high as possible, land softly.",
    body_part: "quads"
  },
  {
    name: "Box Jump",
    sets: 3,
    reps: 10,
    weight: null,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Stand in front of box, jump onto it with both feet, step back down.",
    body_part: "quads"
  },
  {
    name: "Kettlebell Swing",
    sets: 3,
    reps: 20,
    weight: 35,
    image: require("@/assets/images/anatomy/hip.png"),
    tips: "Hinge at hips, swing kettlebell between legs, then thrust hips forward.",
    body_part: "full body"
  },
  {
    name: "Turkish Get-Up",
    sets: 3,
    reps: 5,
    weight: 25,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Hold weight above you, rise from lying to standing while keeping arm extended.",
    body_part: "full body"
  },
  {
    name: "Battle Ropes",
    sets: 3,
    reps: 0,
    weight: null,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Move ropes in wave pattern for 30 seconds with high intensity.",
    body_part: "full body"
  },
  {
    name: "Medicine Ball Slam",
    sets: 3,
    reps: 15,
    weight: 20,
    image: require("@/assets/images/anatomy/abs.png"),
    tips: "Raise ball overhead, then slam it down forcefully using abs and arms.",
    body_part: "full body"
  },
  {
    name: "Landmine Press",
    sets: 3,
    reps: 10,
    weight: 45,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Hold end of barbell, press forward and up at 45-degree angle.",
    body_part: "shoulders"
  },
  {
    name: "Landmine Twist",
    sets: 3,
    reps: 10,
    weight: 25,
    image: require("@/assets/images/anatomy/obliques.png"),
    tips: "Hold end of barbell, twist from side to side keeping arms extended.",
    body_part: "obliques"
  },
  {
    name: "Z Press",
    sets: 3,
    reps: 10,
    weight: 30,
    image: require("@/assets/images/anatomy/front-dealts.png"),
    tips: "Sit on floor with legs extended, press weight directly overhead.",
    body_part: "shoulders"
  },
  {
    name: "Reverse Lunge",
    sets: 3,
    reps: 12,
    weight: 30,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Step backward into lunge position, lower knee toward floor, then return.",
    body_part: "quads"
  },
  {
    name: "Goblet Squat",
    sets: 3,
    reps: 12,
    weight: 40,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Hold kettlebell or dumbbell at chest, squat while keeping torso upright.",
    body_part: "quads"
  },
  {
    name: "Pistol Squat",
    sets: 3,
    reps: 8,
    weight: null,
    image: require("@/assets/images/anatomy/quads.png"),
    tips: "Stand on one leg, extend other leg forward, squat down as low as possible.",
    body_part: "quads"
  },
  {
    name: "Incline Push-Up",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Place hands on elevated surface, perform push-up with body at angle.",
    body_part: "chest"
  },
  {
    name: "Decline Push-Up",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Place feet on elevated surface, perform push-up with head lower than feet.",
    body_part: "chest"
  },
  {
    name: "Diamond Push-Up",
    sets: 3,
    reps: 12,
    weight: null,
    image: require("@/assets/images/anatomy/tricep.png"),
    tips: "Form diamond shape with hands directly under chest, perform push-up.",
    body_part: "triceps"
  },
  {
    name: "Inverted Row",
    sets: 3,
    reps: 12,
    weight: null,
    image: require("@/assets/images/anatomy/lats.png"),
    tips: "Hang from bar set at waist height, pull chest to bar while keeping body straight.",
    body_part: "back"
  },
  {
    name: "Burpee",
    sets: 3,
    reps: 15,
    weight: null,
    image: require("@/assets/images/anatomy/chest.png"),
    tips: "Drop to floor, perform push-up, jump feet to hands, jump up with hands overhead.",
    body_part: "full body"
  }
]; 