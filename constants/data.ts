import { Flame, LucideIcon } from "lucide-react-native";
import { ImageSourcePropType } from "react-native";

export interface Exercise {
  name: string
  sets: number
  reps: number
  image: ImageSourcePropType
  tips?: string[]
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

export interface Video {
  id: string
  title: string
  module: string
  thumbnail: string
  duration: string
  videoId: string // YouTube video ID
  difficulty?: string // easy, medium, hard
  tips?: string // Exercise tips to show in the bottom sheet
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

export const suggestionVideos: Video[] = [
  // Chest
  {
    id: "chest1",
    title: "Bench Press",
    duration: "3:45",
    thumbnail: "https://images.pexels.com/photos/5327556/pexels-photo-5327556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    module: "Chest",
    videoId: "SCVCLChPQFY",
    difficulty: "Medium",
    tips: "Lie flat on a bench with your feet planted firmly on the ground. Grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest, keeping elbows at a 45-degree angle. Press the bar back up until your arms are fully extended. Focus on smooth and controlled motion, engaging the chest, and avoiding excessive arching of the back."
  },
  {
    id: "chest2",
    title: "Chest Flys",
    duration: "2:30",
    thumbnail: "https://images.pexels.com/photos/18060022/pexels-photo-18060022/free-photo-of-muscular-man-exercising-on-the-peck-deck-machine-at-the-gym.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    module: "Chest",
    videoId: "0-hNkTL23ps",
    difficulty: "Easy",
    tips: "Lie on a flat bench holding dumbbells directly above your chest with palms facing each other. With a slight bend in your elbows, slowly lower your arms out to the sides in a wide arc until you feel a stretch in your chest. Bring the dumbbells back to the starting position. Focus on maintaining a slight bend in the elbows, slow and controlled movement, and squeezing the chest at the top."
  },
  
  // Back
  {
    id: "back1",
    title: "Pull Ups",
    duration: "2:22",
    thumbnail: "https://images.pexels.com/photos/14623673/pexels-photo-14623673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    module: "Back",
    videoId: "HRV5YKKaeVw",
    difficulty: "Hard",
    tips: "Grab the pull-up bar with an overhand grip, hands slightly wider than shoulder-width. Hang with arms fully extended. Pull yourself up until your chin is above the bar, then lower yourself back down with control. Focus on engaging your lats and upper back, avoiding swinging, and full range of motion."
  },
  {
    id: "back2",
    title: "Bent Over Rows",
    duration: "3:10",
    thumbnail: "https://media.istockphoto.com/id/498526985/photo/rowing-barbell.jpg?b=1&s=612x612&w=0&k=20&c=MIq5ZA-p8oBIedE6_xH_Vt529rd_oWiTGAEDf4t6Qdc=",
    module: "Back",
    videoId: "_MtfJKqDF00",
    difficulty: "Medium",
    tips: "Hold a barbell or dumbbells with a shoulder-width grip. Bend at the hips while keeping your back flat and knees slightly bent. Pull the weight towards your waist, squeezing your shoulder blades together. Lower the weight back down. Focus on keeping a neutral spine, squeezing at the top, and avoiding jerky movements."
  },
  
  // Triceps
  {
    id: "tri1",
    title: "Dips",
    duration: "1:45",
    thumbnail: "https://images.pexels.com/photos/8520085/pexels-photo-8520085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    module: "Triceps",
    videoId: "wjUmnZH528Y",
    difficulty: "Medium",
    tips: "Grip parallel bars and lift your body with arms extended. Lean slightly forward and lower your body by bending your elbows to about 90 degrees. Push back up to the starting position. Focus on controlled lowering, engaging chest and triceps, and avoiding flaring elbows."
  },
  {
    id: "tri2",
    title: "Triceps Pushdown",
    duration: "1:30",
    thumbnail: "https://images.pexels.com/photos/6243176/pexels-photo-6243176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    module: "Triceps",
    videoId: "2-LAMcpzODU", // Placeholder ID since it's from lyfta.app
    difficulty: "Easy",
    tips: "Stand in front of a cable machine with a straight or rope attachment. Grip the handle with elbows close to your body. Push the handle down until your arms are fully extended, then slowly return to the start. Focus on keeping elbows stationary, full triceps contraction at the bottom, and avoiding shoulder involvement."
  },
  
  // Biceps
  {
    id: "bi1",
    title: "Biceps Curl",
    duration: "2:15",
    thumbnail: "https://images.pexels.com/photos/17898145/pexels-photo-17898145/free-photo-of-a-muscular-man-exercising-at-the-gym.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    module: "Biceps",
    videoId: "ykJmrZ5v0Oo", // Placeholder ID since it's from lyfta.app
    difficulty: "Easy",
    tips: "Stand upright holding dumbbells or a barbell with palms facing up. Curl the weight toward your shoulders, keeping elbows close to your sides. Lower the weight back down under control. Focus on isolating the biceps, avoiding momentum, and full range of motion."
  },
  {
    id: "bi2",
    title: "Hammer Curls",
    duration: "2:00",
    thumbnail: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    module: "Biceps",
    videoId: "zC3nLlEvin4", // Placeholder ID since it's from lyfta.app
    difficulty: "Easy",
    tips: "Hold dumbbells with palms facing your torso. Curl the dumbbells upward while keeping your elbows stationary. Lower them back to the starting position with control. Focus on targeting both the biceps and forearms, keeping wrists neutral, and avoiding swinging."
  },
  
  // Shoulders
  {
    id: "sh1",
    title: "Overhead Press",
    duration: "2:40",
    thumbnail: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    module: "Shoulders",
    videoId: "QAQ64hK4Xxs", // Placeholder ID since it's from lyfta.app
    difficulty: "Medium",
    tips: "Stand or sit with a barbell or dumbbells at shoulder height. Press the weight overhead until your arms are fully extended. Lower it back down under control. Focus on engaging core for stability, maintaining a straight path, and not locking out harshly."
  },
  {
    id: "sh2",
    title: "Lateral Raises",
    duration: "1:50",
    thumbnail: "https://images.pexels.com/photos/29793977/pexels-photo-29793977/free-photo-of-muscular-man-performing-dumbbell-side-raises.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    module: "Shoulders",
    videoId: "3VcKaXpzqRo", // Placeholder ID
    difficulty: "Easy",
    tips: "Stand upright holding dumbbells at your sides. Raise your arms out to the sides until they are parallel to the ground, then slowly lower them. Focus on lifting with control, slight bend in elbows, and isolating the deltoids."
  },
  
  // Legs
  {
    id: "leg1",
    title: "Squats",
    duration: "3:30",
    thumbnail: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    module: "Legs",
    videoId: "gsNoPYwWXeM", // Placeholder ID since it's from lyfta.app
    difficulty: "Medium",
    tips: "Stand with feet shoulder-width apart and barbell resting on your upper traps. Lower your body by bending your knees and hips until your thighs are parallel to the ground. Drive back up through your heels to return to the starting position. Focus on keeping chest up, knees tracking over toes, and maintaining a neutral spine."
  },
  {
    id: "leg2",
    title: "Lunges",
    duration: "2:45",
    thumbnail: "https://images.pexels.com/photos/999257/pexels-photo-999257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    module: "Legs",
    videoId: "3XDriUn0udo", // Placeholder ID since it's from lyfta.app
    difficulty: "Medium",
    tips: "Stand upright holding dumbbells or with bodyweight. Step forward with one leg, lowering your hips until both knees are at 90 degrees. Push through your front heel to return to the starting position. Focus on keeping the torso upright, balanced movement, and engaging glutes and quads."
  }
]