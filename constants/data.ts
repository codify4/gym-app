import { BicepsFlexed, Carrot, Clock, Flame, LucideIcon } from "lucide-react-native";

export interface Exercise {
  name: string;
  sets: string;
}

export interface Workout {
  title: string;
  exercises: Exercise[];
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