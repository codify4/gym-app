# PoseTracker Integration Setup

Your app has been successfully integrated with PoseTracker API! Here's how to complete the setup:

## 🔑 Step 1: Add Your API Key

1. Open `constants/posetracker-config.ts`
2. Replace `"YOUR_API_KEY_HERE"` with your actual PoseTracker API key:

```typescript
export const POSETRACKER_CONFIG = {
  API_KEY: "your-actual-api-key-here", // 👈 Replace this
  // ... rest of config
}
```

## 🏋️ Step 2: Customize Exercise Settings (Optional)

In the same config file, you can customize:

- **Exercise type**: Change `EXERCISE` to any supported exercise
- **Difficulty**: Adjust `DIFFICULTY` (easy, medium, hard)  
- **Skeleton overlay**: Toggle `SHOW_SKELETON`

Available exercises:
- squat
- lunge
- plank
- push_up
- balance_left_leg
- balance_right_leg
- split
- needle

## 🚀 Step 3: Test the Integration

1. Start your Expo development server:
   ```bash
   npx expo start
   ```

2. Open the app on your device (recommended) or simulator
3. Navigate to the Camera tab
4. You should see:
   - PoseTracker camera view (instead of placeholder)
   - Real-time pose detection
   - Dynamic suggestions based on your movement
   - Exercise counter
   - AI status indicator

## 📱 How It Works

### Real-time Features:
- **Pose Detection**: AI analyzes your form in real-time
- **Exercise Counting**: Automatically counts reps
- **Form Suggestions**: Dynamic tips like "Move left", "Keep back straight"
- **Ready Status**: Shows when you're properly positioned
- **Form Analysis**: Tracks good form vs total reps for scoring

### UI Elements:
- **Recording Timer**: Shows workout duration (top right)
- **Rep Counter**: Displays exercise count (top left)
- **AI Status**: Indicates if AI is ready or calibrating (left side)
- **Dynamic Suggestions**: Real-time form corrections (overlaid)

### Post-Workout Summary:
- **Exercise Stats**: Displays exercise type, reps, and duration
- **AI Form Score**: Calculated score out of 10 based on form quality
- **Form Analysis**: Shows good form reps vs total reps with percentage
- **AI Recommendations**: Personalized suggestions for improvement
- **Color-coded Scoring**: Green (8-10), Yellow (6-7), Red (0-5)

## 🔧 Troubleshooting

### If you see "Please add your PoseTracker API key":
- Make sure you've replaced the API key in `constants/posetracker-config.ts`
- Check that there are no quotes or spaces in your API key

### If camera permissions are requested:
- Allow camera access when prompted
- This is required for pose tracking to work

### If WebView shows errors:
- Check your internet connection
- Ensure your API key is valid
- Look for error messages in the console logs

## 📚 PoseTracker API Reference

For more details about the PoseTracker API, visit:
https://posetracker.gitbook.io/posetracker-api/

## 🎯 Next Steps

The integration is complete! You can now:
- Test different exercises by changing the config
- Customize the suggestion logic in `camera.tsx`
- Add more exercise types as they become available
- Integrate the rep counter with your workout tracking system

Enjoy your AI-powered form correction! 🏋️‍♀️💪 