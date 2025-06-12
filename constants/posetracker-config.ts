// PoseTracker Configuration
// Replace YOUR_API_KEY_HERE with your actual PoseTracker API key

export const POSETRACKER_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_POSE_TRACKER_API,
  API_URL: "https://app.posetracker.com/pose_tracker/tracking",
  
  // Exercise settings
  EXERCISE: "squat", // Options: "squat", "lunge", "plank", "push_up", etc.
  DIFFICULTY: "easy", // Options: "easy", "medium", "hard"
  SHOW_SKELETON: true,
  
  // You can change these settings as needed
  EXERCISE_OPTIONS: [
    "squat",
    "lunge", 
    "plank",
    "push_up",
    "balance_left_leg",
    "balance_right_leg",
    "split",
    "needle",
  ],
  
  DIFFICULTY_OPTIONS: [
    "easy",
    "medium", 
    "hard"
  ]
}

export default POSETRACKER_CONFIG 