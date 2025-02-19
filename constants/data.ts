import { Activity, BicepsFlexed, Carrot, Clock, Dumbbell, Flame, LucideIcon } from "lucide-react-native";
import { ImageSourcePropType } from "react-native";

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  image: ImageSourcePropType;
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
      { name: "Bench Press", sets: 3, reps: 10, image: require("@/assets/images/anatomy/chest.png") },
      { name: "Shoulder Press", sets: 3, reps: 12, image: require("@/assets/images/anatomy/side-dealts.png") },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, image: require("@/assets/images/anatomy/tricep.png") },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, image: require("@/assets/images/anatomy/tricep.png") },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, image: require("@/assets/images/anatomy/tricep.png") },
      { name: "Tricep Pushdowns", sets: 3, reps: 15, image: require("@/assets/images/anatomy/tricep.png") },
    ],
    duration: "45 min",
    lastPerformed: "2 days ago",
    bodyPart: "Chest",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "lower-body-focus",
    name: "Lower Body Focus",
    exercises: [
      { name: "Squats", sets: 4, reps: 8, image: require("@/assets/images/anatomy/quads.png") },
      { name: "Leg Press", sets: 3, reps: 12, image: require("@/assets/images/anatomy/quads.png") },
      { name: "Calf Raises", sets: 3, reps: 15, image: require("@/assets/images/anatomy/calves.png") },
    ],
    duration: "40 min",
    lastPerformed: "5 days ago",
    bodyPart: "Legs",
    image: "https://images.unsplash.com/photo-1646495001290-39103b31873a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "full-body-strength",
    name: "Full Body Strength",
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10, image: require("@/assets/images/anatomy/chest.png") },
      { name: "Squats", sets: 3, reps: 12, image: require("@/assets/images/anatomy/quads.png") },
      { name: "Deadlifts", sets: 3, reps: 15, image: require("@/assets/images/anatomy/lats.png") },
    ],
    duration: "50 min",
    lastPerformed: "3 days ago",
    bodyPart: "All",
    image: "https://images.unsplash.com/photo-1584863231364-2edc166de576?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // ... (add more routines with similar structure)
];