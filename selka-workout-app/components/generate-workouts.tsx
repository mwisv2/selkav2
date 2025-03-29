"use client"

// Define types
type Exercise = {
  name: string
  equipment: string[]
  bodyPart: string
  compound: boolean
}

type Workout = {
  title: string
  description: string
  day: string
  duration: string
  exercises: string[]
}

// Exercise database
const exerciseDatabase: Exercise[] = [
  // Bodyweight exercises
  { name: "Push-ups", equipment: ["No Equipment (Bodyweight only)"], bodyPart: "chest", compound: true },
  { name: "Pull-ups", equipment: ["Pull-up Bar", "No Equipment (Bodyweight only)"], bodyPart: "back", compound: true },
  { name: "Squats", equipment: ["No Equipment (Bodyweight only)"], bodyPart: "legs", compound: true },
  { name: "Lunges", equipment: ["No Equipment (Bodyweight only)"], bodyPart: "legs", compound: true },
  { name: "Dips", equipment: ["No Equipment (Bodyweight only)"], bodyPart: "chest", compound: true },
  { name: "Plank", equipment: ["No Equipment (Bodyweight only)"], bodyPart: "core", compound: false },
  { name: "Mountain Climbers", equipment: ["No Equipment (Bodyweight only)"], bodyPart: "core", compound: false },
  { name: "Burpees", equipment: ["No Equipment (Bodyweight only)"], bodyPart: "full", compound: true },

  // Dumbbell exercises
  { name: "Dumbbell Bench Press", equipment: ["Dumbbells"], bodyPart: "chest", compound: true },
  { name: "Dumbbell Rows", equipment: ["Dumbbells"], bodyPart: "back", compound: true },
  { name: "Dumbbell Shoulder Press", equipment: ["Dumbbells"], bodyPart: "shoulders", compound: true },
  { name: "Dumbbell Lunges", equipment: ["Dumbbells"], bodyPart: "legs", compound: true },
  { name: "Dumbbell Bicep Curls", equipment: ["Dumbbells"], bodyPart: "arms", compound: false },
  { name: "Dumbbell Tricep Extensions", equipment: ["Dumbbells"], bodyPart: "arms", compound: false },
  { name: "Dumbbell Lateral Raises", equipment: ["Dumbbells"], bodyPart: "shoulders", compound: false },
  { name: "Dumbbell Romanian Deadlift", equipment: ["Dumbbells"], bodyPart: "legs", compound: true },

  // Barbell exercises
  { name: "Barbell Bench Press", equipment: ["Barbell", "Bench Press"], bodyPart: "chest", compound: true },
  { name: "Barbell Squat", equipment: ["Barbell", "Squat Rack"], bodyPart: "legs", compound: true },
  { name: "Barbell Deadlift", equipment: ["Barbell"], bodyPart: "full", compound: true },
  { name: "Barbell Rows", equipment: ["Barbell"], bodyPart: "back", compound: true },
  { name: "Barbell Overhead Press", equipment: ["Barbell"], bodyPart: "shoulders", compound: true },
  { name: "Barbell Bicep Curls", equipment: ["Barbell"], bodyPart: "arms", compound: false },

  // Resistance band exercises
  { name: "Resistance Band Chest Press", equipment: ["Resistance Bands"], bodyPart: "chest", compound: false },
  { name: "Resistance Band Rows", equipment: ["Resistance Bands"], bodyPart: "back", compound: false },
  { name: "Resistance Band Squats", equipment: ["Resistance Bands"], bodyPart: "legs", compound: true },
  { name: "Resistance Band Shoulder Press", equipment: ["Resistance Bands"], bodyPart: "shoulders", compound: false },
  { name: "Resistance Band Bicep Curls", equipment: ["Resistance Bands"], bodyPart: "arms", compound: false },

  // Kettlebell exercises
  { name: "Kettlebell Swings", equipment: ["Kettlebells"], bodyPart: "full", compound: true },
  { name: "Kettlebell Goblet Squats", equipment: ["Kettlebells"], bodyPart: "legs", compound: true },
  { name: "Kettlebell Turkish Get-Up", equipment: ["Kettlebells"], bodyPart: "full", compound: true },
]

export function generateWorkouts(userProfile: any): Workout[] {
  // Generate workouts based on user equipment and preferences
  const daysPerWeek = Number.parseInt(userProfile.daysPerWeek || "3")
  const userEquipment = userProfile.equipment || ["No Equipment (Bodyweight only)"]
  const timePerDay = Number.parseInt(userProfile.timePerDay || "45")

  // Filter exercises based on available equipment
  const availableExercises = exerciseDatabase.filter((exercise) =>
    exercise.equipment.some((eq) => userEquipment.includes(eq)),
  )

  // Determine number of exercises per workout based on time
  const exercisesPerWorkout = timePerDay <= 30 ? 3 : timePerDay <= 45 ? 4 : timePerDay <= 60 ? 5 : 6

  // Create workout split based on days per week
  let workoutSplit: string[][] = []

  if (daysPerWeek === 1) {
    workoutSplit = [["full"]] // Full body
  } else if (daysPerWeek === 2) {
    workoutSplit = [["upper"], ["lower"]] // Upper/Lower
  } else if (daysPerWeek === 3) {
    workoutSplit = [["push"], ["pull"], ["legs"]] // Push/Pull/Legs
  } else if (daysPerWeek === 4) {
    workoutSplit = [["chest", "triceps"], ["back", "biceps"], ["shoulders", "core"], ["legs"]] // 4-day split
  } else if (daysPerWeek === 5) {
    workoutSplit = [["chest"], ["back"], ["shoulders"], ["arms"], ["legs"]] // 5-day split
  } else if (daysPerWeek >= 6) {
    workoutSplit = [["chest"], ["back"], ["shoulders"], ["arms"], ["legs"], ["core"]] // 6-day split
  }

  // Ensure we only have as many days as user requested
  workoutSplit = workoutSplit.slice(0, daysPerWeek)

  // Generate workouts for each day
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const workouts: Workout[] = []

  workoutSplit.forEach((bodyParts, index) => {
    const workoutTitle = getWorkoutTitle(bodyParts)
    const description = getWorkoutDescription(bodyParts)
    const day = weekdays[index]
    const duration = `${timePerDay} min`

    // Select exercises for this workout
    const workoutExercises = selectExercisesForBodyParts(bodyParts, availableExercises, exercisesPerWorkout)

    workouts.push({
      title: workoutTitle,
      description,
      day,
      duration,
      exercises: workoutExercises,
    })
  })

  return workouts
}

function getWorkoutTitle(bodyParts: string[]): string {
  if (bodyParts.includes("full")) return "Full Body"
  if (bodyParts.includes("upper")) return "Upper Body"
  if (bodyParts.includes("lower")) return "Lower Body"
  if (bodyParts.includes("push")) return "Push Day"
  if (bodyParts.includes("pull")) return "Pull Day"
  if (bodyParts.includes("legs")) return "Leg Day"

  // For other combinations
  return bodyParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" & ")
}

function getWorkoutDescription(bodyParts: string[]): string {
  if (bodyParts.includes("full")) return "Complete full body workout"
  if (bodyParts.includes("upper")) return "Upper body strength and muscle building"
  if (bodyParts.includes("lower")) return "Lower body strength and development"
  if (bodyParts.includes("push")) return "Chest, shoulders, and triceps"
  if (bodyParts.includes("pull")) return "Back and biceps"
  if (bodyParts.includes("legs")) return "Quads, hamstrings, and calves"

  // For specific body parts
  const bodyPartDescriptions: { [key: string]: string } = {
    chest: "Chest development and strength",
    back: "Back thickness and width",
    shoulders: "Shoulder development and stability",
    arms: "Biceps and triceps",
    legs: "Leg strength and muscle building",
    core: "Core strength and stability",
    triceps: "Triceps isolation and development",
    biceps: "Biceps isolation and development",
  }

  const descriptions = bodyParts.map((part) => bodyPartDescriptions[part] || part)
  return descriptions.join(", ")
}

function selectExercisesForBodyParts(bodyParts: string[], availableExercises: Exercise[], count: number): string[] {
  const exercises: string[] = []
  const flatBodyParts = flattenBodyParts(bodyParts)

  // First select compound exercises
  const compoundExercises = availableExercises.filter(
    (ex) => ex.compound && flatBodyParts.some((part) => ex.bodyPart === part || ex.bodyPart === "full"),
  )

  // Then isolation exercises
  const isolationExercises = availableExercises.filter(
    (ex) => !ex.compound && flatBodyParts.some((part) => ex.bodyPart === part),
  )

  // Randomly select, prioritizing compounds
  const compoundCount = Math.min(Math.ceil(count * 0.7), compoundExercises.length)
  const isolationCount = Math.min(count - compoundCount, isolationExercises.length)

  // Shuffle and select
  const selectedCompounds = shuffle(compoundExercises).slice(0, compoundCount)
  const selectedIsolations = shuffle(isolationExercises).slice(0, isolationCount)

  // Combine and return exercise names
  return [...selectedCompounds, ...selectedIsolations].map((ex) => ex.name)
}

function flattenBodyParts(bodyParts: string[]): string[] {
  const mapping: { [key: string]: string[] } = {
    full: ["chest", "back", "shoulders", "arms", "legs", "core"],
    upper: ["chest", "back", "shoulders", "arms"],
    lower: ["legs"],
    push: ["chest", "shoulders", "triceps"],
    pull: ["back", "biceps"],
    legs: ["legs"],
    arms: ["biceps", "triceps"],
  }

  let flattened: string[] = []

  bodyParts.forEach((part) => {
    if (mapping[part]) {
      flattened = [...flattened, ...mapping[part]]
    } else {
      flattened.push(part)
    }
  })

  return [...new Set(flattened)] // Remove duplicates
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Update the getWorkoutsWithSets function to account for 1RM
export function getWorkoutsWithSets(workouts: Workout[], userProfile: any): any[] {
  return workouts.map((workout) => {
    const exercises = workout.exercises.map((exerciseName) => {
      // Determine number of sets based on exercise and workout type
      const setCount = 4 // Default to 4 sets

      // Get exercise details
      const exerciseDetails = exerciseDatabase.find((ex) => ex.name === exerciseName)
      const isCompound = exerciseDetails?.compound || false

      // Get user's 1RM if available
      const userMaxes = userProfile.maxes || {}
      let baseWeight = 0

      // Try to match exercise with user's 1RM
      if (exerciseName.includes("Bench Press") && userMaxes.bench) {
        baseWeight = Number.parseInt(userMaxes.bench)
      } else if (exerciseName.includes("Squat") && userMaxes.squat) {
        baseWeight = Number.parseInt(userMaxes.squat)
      } else if (exerciseName.includes("Deadlift") && userMaxes.deadlift) {
        baseWeight = Number.parseInt(userMaxes.deadlift)
      } else if (
        (exerciseName.includes("Overhead Press") || exerciseName.includes("Shoulder Press")) &&
        userMaxes.overhead
      ) {
        baseWeight = Number.parseInt(userMaxes.overhead)
      } else {
        // Estimate based on equipment type
        if (exerciseDetails?.equipment.includes("Barbell")) {
          baseWeight = isCompound ? 60 : 30
        } else if (exerciseDetails?.equipment.includes("Dumbbells")) {
          baseWeight = isCompound ? 20 : 10
        } else if (exerciseDetails?.equipment.includes("Kettlebells")) {
          baseWeight = 16
        } else {
          baseWeight = 0 // Bodyweight or bands
        }
      }

      // Create sets with appropriate weight and reps
      const sets = Array(setCount)
        .fill(0)
        .map((_, index) => {
          let weight = 0
          let reps = 0

          if (isCompound) {
            // Compound exercises: 70-85% of 1RM
            const percentages = [0.7, 0.75, 0.8, 0.75] // Percentage of 1RM for each set
            weight = Math.round(baseWeight * percentages[index])
            reps = [12, 10, 8, 10][index] // Rep scheme for compound exercises
          } else {
            // Isolation exercises: lighter weight, higher reps
            const percentages = [0.6, 0.65, 0.65, 0.6] // Percentage of 1RM for each set
            weight = Math.round(baseWeight * percentages[index])
            reps = [15, 12, 12, 15][index] // Rep scheme for isolation exercises
          }

          // Ensure minimum weight for equipment-based exercises
          if (
            exerciseDetails?.equipment.some((eq) => ["Barbell", "Dumbbells", "Kettlebells"].includes(eq)) &&
            weight < 5
          ) {
            weight = 5
          }

          return {
            weight,
            reps,
            completed: false,
          }
        })

      return {
        name: exerciseName,
        sets,
        restTime: isCompound ? 90 : 60, // Default rest time in seconds
      }
    })

    return {
      ...workout,
      exercises,
      completed: false,
    }
  })
}

