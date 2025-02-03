export interface Exercise {
  name: string;
  sets: string;
}

export interface Workout {
  title: string;
  exercises: Exercise[];
}
  
export interface MonthlyStats {
  category: string;
  count: number;
}

interface UserProfile {
  username: string;
  avatar: string;
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
];

export const monthlyStats: MonthlyStats[] = [
  { category: "Chest Days", count: 5 },
  { category: "Arm Days", count: 4 },
  { category: "Leg Days", count: 1 },
];

export const userProfile: UserProfile = {
  username: "John Doe",
  avatar: "https://api.dicebear.com/7.x/initials/png?seed=JD",
};