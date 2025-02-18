import { Activity, BicepsFlexed, Carrot, Clock, Dumbbell, Flame, LucideIcon } from "lucide-react-native";

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  image: string;
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
      { name: "Bench Press", sets: 3, reps: 10, image: "https://example.com/bench-press.png" },
      { name: "Shoulder Press", sets: 3, reps: 12, image: "https://example.com/shoulder-press.png" },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, image: "https://example.com/tricep-pushdowns.png" },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, image: "https://example.com/tricep-pushdowns.png" },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, image: "https://example.com/tricep-pushdowns.png" },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, image: "https://example.com/tricep-pushdowns.png" },
    ],
    duration: "45 min",
    lastPerformed: "2 days ago",
    bodyPart: "Chest",
    image: "https://example.com/upper-body.jpg",
  },
  {
    id: "lower-body-focus",
    name: "Lower Body Focus",
    exercises: [
      { name: "Squats", sets: 4, reps: 8, image: "https://example.com/squats.png" },
      { name: "Leg Press", sets: 3, reps: 12, image: "https://example.com/leg-press.png" },
      { name: "Calf Raises", sets: 3, reps: 15, image: "https://example.com/calf-raises.png" },
    ],
    duration: "40 min",
    lastPerformed: "5 days ago",
    bodyPart: "Legs",
    image: "https://example.com/lower-body.jpg",
  },
  {
    id: "full-body-strength",
    name: "Full Body Strength",
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10, image: "https://example.com/bench-press.png" },
      { name: "Squats", sets: 3, reps: 12, image: "https://example.com/squats.png" },
      { name: "Deadlifts", sets: 3, reps: 15, image: "https://example.com/deadlifts.png" },
    ],
    duration: "50 min",
    lastPerformed: "3 days ago",
    bodyPart: "All",
    image: "https://example.com/full-body.jpg",
  },
  // ... (add more routines with similar structure)
];