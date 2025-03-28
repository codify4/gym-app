import { Exercise, getExerciseImage } from "@/lib/workouts"

// Add this helper function to the ExerciseCard component to handle image rendering
export const getImageSource = (exercise: Exercise) => {
    if (!exercise.image) {
      // If no image is provided, use the getExerciseImage function
      return getExerciseImage(exercise.name)
    }

    // If the image is a string path from the database
    if (typeof exercise.image === "string") {
      // If it's a full path starting with http/https, use it directly
      if (exercise.image.startsWith("http")) {
        return { uri: exercise.image }
      }

      // If it's a path to an anatomy image
      if (exercise.image.includes("anatomy/")) {
        const imageName = exercise.image.split("/").pop() // Get the filename

        // Map the filename to the require statement
        switch (imageName) {
          case "chest.png":
            return require("@/assets/images/anatomy/chest.png")
          case "bicep.png":
            return require("@/assets/images/anatomy/bicep.png")
          case "tricep.png":
            return require("@/assets/images/anatomy/tricep.png")
          case "quads.png":
            return require("@/assets/images/anatomy/quads.png")
          case "lats.png":
            return require("@/assets/images/anatomy/lats.png")
          case "side-dealts.png":
            return require("@/assets/images/anatomy/side-dealts.png")
          case "rear-dealts.png":
            return require("@/assets/images/anatomy/rear-dealts.png")
          case "front-dealts.png":
            return require("@/assets/images/anatomy/front-dealts.png")
          case "calves.png":
            return require("@/assets/images/anatomy/calves.png")
          case "hamstrings.png":
            return require("@/assets/images/anatomy/hamstrings.png")
          case "abs.png":
            return require("@/assets/images/anatomy/abs.png")
          case "obliques.png":
            return require("@/assets/images/anatomy/obliques.png")
          case "traps.png":
            return require("@/assets/images/anatomy/traps.png")
          case "forearms.png":
            return require("@/assets/images/anatomy/forearms.png")
          case "hip.png":
            return require("@/assets/images/anatomy/hips.png")
          case "hip-adductor.png":
            return require("@/assets/images/anatomy/hip-adductors.png")
          case "up-back.png":
            return require("@/assets/images/anatomy/up-back.png")
          default:
            return require("@/assets/images/anatomy/chest.png")
        }
      }
    }

    // If it's already a require() result, use it directly
    return exercise.image
  }