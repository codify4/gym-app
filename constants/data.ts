import { Activity, BicepsFlexed, Carrot, Clock, Dumbbell, Flame, LucideIcon } from "lucide-react-native";
import { ImageSourcePropType } from "react-native";

export interface Exercise {
  name: string
  sets: number
  reps: number
  image: ImageSourcePropType
  tips: string[]
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: string;
  lastPerformed: string;
  bodyPart: string;
  image: string;
}

export interface homeExcercise {
  name: string
  sets: string
}
export interface Workout {
  title: string;
  exercises: homeExcercise[];
}
  
export interface Stats {
  category: string;
  count: string;
  icon: LucideIcon;
  trend: number;
}

  
export const dummyWorkouts: Workout[] = [
  {
    title: "Chest Day",
    exercises: [
      { name: "Bench Press", sets: "3x12" },
      { name: "Chest Flies", sets: "3x15" },
      { name: "Incline Press", sets: "3x12" },
    ],
  },
  {
    title: "Back Day",
    exercises: [
      { name: "Pull-ups", sets: "3x10" },
      { name: "Barbell Rows", sets: "3x12" },
      { name: "Lat Pulldowns", sets: "3x15" },
    ],
  },
  {
    title: "Leg Day",
    exercises: [
      { name: "Squats", sets: "3x10" },
      { name: "Leg Press", sets: "3x12" },
      { name: "Leg Extensions", sets: "3x15" },
    ],
  },
  {
    title: "Bicep Day",
    exercises: [
      { name: "Hammer Curls", sets: "3x10" },
      { name: "Cabel Curls", sets: "3x12" },
      { name: "Preacher Curls", sets: "3x15" },
    ]
  }
];

export const monthlyStats: Stats[] = [
  { category: "Chest Days", count: '5', icon: Flame, trend: 3 },
  { category: "Arm Days", count: '4', icon: Flame, trend: 2 },
  { category: "Leg Days", count: '1', icon: Flame, trend: -1 },
];

export const bodyParts = [
  { name: "All", image: require('@/assets/images/all.png') },
  { name: "Chest", image: require('@/assets/images/chest.png') },
  { name: "Back", image: require('@/assets/images/back.png') },
  { name: "Legs", image: require('@/assets/images/knee.png') },
  { name: "Arms", image: require('@/assets/images/bicep.png') },
  { name: "Shoulders", image: require('@/assets/images/shoulder.png') }
]

export const routines: Routine[] = [
  {
    id: "upper-body-power",
    name: "Upper Body Power",
    exercises: [
      {
        name: "Bench Press",
        sets: 3,
        reps: 10,
        image: require("@/assets/images/anatomy/chest.png"),
        tips: [
          "Lie flat on the bench with your feet on the ground",
          "Grip the bar slightly wider than shoulder-width",
          "Lower the bar to your mid-chest",
          "Push the bar back up to the starting position",
          "Keep your wrists straight and elbows at a 45-degree angle",
        ],
      },
      {
        name: "Shoulder Press",
        sets: 3,
        reps: 12,
        image: require("@/assets/images/anatomy/side-dealts.png"),
        tips: [
          "Start with the bar at shoulder level",
          "Press the bar overhead until your arms are fully extended",
          "Lower the bar back to shoulder level",
          "Keep your core tight and avoid arching your back",
          "Breathe out as you press up",
        ],
      },
      {
        name: "Tricep Pushdowns",
        sets: 3,
        reps: 15,
        image: require("@/assets/images/anatomy/tricep.png"),
        tips: [
          "Stand facing a cable machine with a straight bar attachment",
          "Grip the bar with your palms facing down",
          "Keep your elbows close to your body",
          "Push the bar down until your arms are fully extended",
          "Slowly return to the starting position",
        ],
      },
    ],
    duration: "45 min",
    lastPerformed: "2 days ago",
    bodyPart: "Chest",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "lower-body-focus",
    name: "Lower Body Focus",
    exercises: [
      {
        name: "Squats",
        sets: 4,
        reps: 8,
        image: require("@/assets/images/anatomy/quads.png"),
        tips: [
          "Stand with feet shoulder-width apart",
          "Keep your chest up and core engaged",
          "Lower your body as if sitting back into a chair",
          "Keep your knees in line with your toes",
          "Push through your heels to return to the starting position",
        ],
      },
      {
        name: "Leg Press",
        sets: 3,
        reps: 12,
        image: require("@/assets/images/anatomy/quads.png"),
        tips: [
          "Sit on the leg press machine with your back flat against the pad",
          "Place your feet shoulder-width apart on the platform",
          "Lower the weight until your knees are at a 90-degree angle",
          "Push the platform away until your legs are extended",
          "Don't lock your knees at the top of the movement",
        ],
      },
      {
        name: "Calf Raises",
        sets: 3,
        reps: 15,
        image: require("@/assets/images/anatomy/calves.png"),
        tips: [
          "Stand on a raised platform with the balls of your feet",
          "Let your heels hang off the edge",
          "Raise your heels as high as possible",
          "Lower your heels below the platform level",
          "Keep your knees slightly bent throughout the movement",
        ],
      },
    ],
    duration: "40 min",
    lastPerformed: "5 days ago",
    bodyPart: "Legs",
    image:
      "https://images.unsplash.com/photo-1646495001290-39103b31873a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "full-body-strength",
    name: "Full Body Strength",
    exercises: [
      {
        name: "Deadlifts",
        sets: 3,
        reps: 8,
        image: require("@/assets/images/anatomy/lats.png"),
        tips: [
          "Stand with feet hip-width apart, toes under the barbell",
          "Bend at your hips and knees, grabbing the bar with hands just outside your legs",
          "Keep your back straight and chest up",
          "Lift the bar by extending your hips and knees",
          "Lower the bar back down with control, keeping it close to your legs",
        ],
      },
      {
        name: "Pull-ups",
        sets: 3,
        reps: 10,
        image: require("@/assets/images/anatomy/lats.png"),
        tips: [
          "Grip the bar with hands slightly wider than shoulder-width",
          "Hang with arms fully extended",
          "Pull yourself up until your chin is over the bar",
          "Lower yourself back down with control",
          "Engage your core throughout the movement",
        ],
      },
      {
        name: "Dumbbell Lunges",
        sets: 3,
        reps: 12,
        image: require("@/assets/images/anatomy/quads.png"),
        tips: [
          "Hold a dumbbell in each hand by your sides",
          "Step forward with one leg, lowering your hips",
          "Both knees should be bent at about 90-degree angles",
          "Push back up to the starting position",
          "Alternate legs with each rep",
        ],
      },
    ],
    duration: "50 min",
    lastPerformed: "3 days ago",
    bodyPart: "All",
    image:
      "https://images.unsplash.com/photo-1584863231364-2edc166de576?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]