type HeightData = {
  value: number
  display: string
}

type WeightData = {
  value: number
  display: string
}

type AgeData = {
  value: number
}

type FitnessLevelData = {
  value: string
}

type WorkoutSplitData = {
  value: string
}

type LiftData = {
  value: number
  display: string
}

type WeightGoalData = {
  value: number
  display: string
  type: string
}

type TimeFrameData = {
  value: number
}

type FocusTypeData = {
  value: string
}

type Exercise = {
  name: string
  sets: number
  reps: string
  rest: string
  weight?: string // Added weight field
}

type WorkoutDay = {
  day: string
  exercises: Exercise[]
}

// Update the exercise database to better categorize exercises by equipment
const exerciseDatabase = {
  chest: [
    {
      name: "Bench Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.8,
      equipment: ["barbell", "bench"],
    },
    {
      name: "Incline Dumbbell Press",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.6,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Chest Flyes",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Push-Ups",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Cable Crossovers",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["cable-machine"],
    },
    {
      name: "Decline Bench Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.85,
      equipment: ["barbell", "bench"],
    },
    {
      name: "Dumbbell Pullovers",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.4,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Dumbbell Bench Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.7,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Resistance Band Chest Press",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
    {
      name: "Smith Machine Bench Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.8,
      equipment: ["smith-machine", "bench"],
    },
    {
      name: "Incline Push-Ups",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight", "bench"],
    },
    {
      name: "Decline Push-Ups",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight", "bench"],
    },
  ],
  back: [
    {
      name: "Deadlift",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.8,
      equipment: ["barbell"],
    },
    {
      name: "Pull-Ups",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Bent Over Rows",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.5,
      equipment: ["barbell"],
    },
    {
      name: "Dumbbell Rows",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.4,
      equipment: ["dumbbells"],
    },
    {
      name: "Lat Pulldowns",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.5,
      equipment: ["cable-machine"],
    },
    {
      name: "Seated Cable Rows",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.4,
      equipment: ["cable-machine"],
    },
    {
      name: "T-Bar Rows",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.5,
      equipment: ["barbell"],
    },
    {
      name: "Single-Arm Dumbbell Rows",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.3,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Inverted Rows",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Resistance Band Rows",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
    {
      name: "Smith Machine Rows",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.5,
      equipment: ["smith-machine"],
    },
  ],
  shoulders: [
    {
      name: "Overhead Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.6,
      equipment: ["barbell"],
    },
    {
      name: "Lateral Raises",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.15,
      equipment: ["dumbbells"],
    },
    {
      name: "Face Pulls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["cable-machine"],
    },
    {
      name: "Resistance Band Face Pulls",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
    {
      name: "Upright Rows",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["barbell"],
    },
    {
      name: "Dumbbell Upright Rows",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells"],
    },
    {
      name: "Kettlebell Upright Rows",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["kettlebells"],
    },
    {
      name: "Shrugs",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.4,
      equipment: ["barbell"],
    },
    {
      name: "Dumbbell Shrugs",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.35,
      equipment: ["dumbbells"],
    },
    {
      name: "Kettlebell Shrugs",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.35,
      equipment: ["kettlebells"],
    },
    {
      name: "Arnold Press",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.4,
      equipment: ["dumbbells"],
    },
    {
      name: "Front Raises",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.2,
      equipment: ["dumbbells"],
    },
    {
      name: "Kettlebell Front Raises",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.2,
      equipment: ["kettlebells"],
    },
    {
      name: "Resistance Band Front Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
    {
      name: "Pike Push-Ups",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Dumbbell Shoulder Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.5,
      equipment: ["dumbbells"],
    },
    {
      name: "Smith Machine Shoulder Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.6,
      equipment: ["smith-machine"],
    },
    {
      name: "Resistance Band Lateral Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
  ],
  arms: [
    {
      name: "Bicep Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["barbell"],
    },
    {
      name: "Dumbbell Bicep Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells"],
    },
    {
      name: "Cable Bicep Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["cable-machine"],
    },
    {
      name: "Tricep Pushdowns",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["cable-machine"],
    },
    {
      name: "Resistance Band Tricep Pushdowns",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
    {
      name: "Hammer Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells"],
    },
    {
      name: "Skull Crushers",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.4,
      equipment: ["barbell", "bench"],
    },
    {
      name: "Dumbbell Skull Crushers",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.35,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Chin-Ups",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Dips",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight", "bench"],
    },
    {
      name: "Preacher Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["barbell", "bench"],
    },
    {
      name: "Dumbbell Preacher Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Overhead Tricep Extensions",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells"],
    },
    {
      name: "Cable Overhead Tricep Extensions",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["cable-machine"],
    },
    {
      name: "Diamond Push-Ups",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Resistance Band Curls",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
    {
      name: "Resistance Band Tricep Extensions",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
  ],
  legs: [
    {
      name: "Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.8,
      equipment: ["barbell"],
    },
    {
      name: "Smith Machine Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.8,
      equipment: ["smith-machine"],
    },
    {
      name: "Leg Press",
      compound: true,
      primaryLift: "squat",
      percentage: 1.2,
      equipment: ["full-gym"],
    },
    {
      name: "Lunges",
      compound: true,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["bodyweight"],
    },
    {
      name: "Dumbbell Lunges",
      compound: true,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["dumbbells"],
    },
    {
      name: "Barbell Lunges",
      compound: true,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["barbell"],
    },
    {
      name: "Leg Extensions",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["full-gym"],
    },
    {
      name: "Leg Curls",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["full-gym"],
    },
    {
      name: "Hack Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.7,
      equipment: ["full-gym"],
    },
    {
      name: "Front Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.7,
      equipment: ["barbell"],
    },
    {
      name: "Smith Machine Front Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.7,
      equipment: ["smith-machine"],
    },
    {
      name: "Goblet Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["dumbbells"],
    },
    {
      name: "Kettlebell Goblet Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["kettlebells"],
    },
    {
      name: "Bodyweight Squats",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Split Squats",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Dumbbell Split Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["dumbbells"],
    },
    {
      name: "Resistance Band Squats",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
  ],
  core: [
    {
      name: "Planks",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Russian Twists",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Weighted Russian Twists",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["dumbbells"],
    },
    {
      name: "Kettlebell Russian Twists",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["kettlebells"],
    },
    {
      name: "Hanging Leg Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Ab Rollouts",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Cable Crunches",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["cable-machine"],
    },
    {
      name: "Mountain Climbers",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Bicycle Crunches",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Leg Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Bench Leg Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight", "bench"],
    },
    {
      name: "Resistance Band Woodchoppers",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
  ],
  glutes: [
    {
      name: "Hip Thrusts",
      compound: false,
      primaryLift: "squat",
      percentage: 0.7,
      equipment: ["barbell", "bench"],
    },
    {
      name: "Glute Bridges",
      compound: false,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["bodyweight"],
    },
    {
      name: "Barbell Glute Bridges",
      compound: false,
      primaryLift: "squat",
      percentage: 0.6,
      equipment: ["barbell"],
    },
    {
      name: "Romanian Deadlifts",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.7,
      equipment: ["barbell"],
    },
    {
      name: "Dumbbell Romanian Deadlifts",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.6,
      equipment: ["dumbbells"],
    },
    {
      name: "Bulgarian Split Squats",
      compound: false,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["bodyweight"],
    },
    {
      name: "Dumbbell Bulgarian Split Squats",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Cable Kickbacks",
      compound: false,
      primaryLift: "squat",
      percentage: 0.2,
      equipment: ["cable-machine"],
    },
    {
      name: "Sumo Deadlifts",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.8,
      equipment: ["barbell"],
    },
    {
      name: "Step-Ups",
      compound: false,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["bodyweight"],
    },
    {
      name: "Dumbbell Step-Ups",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["dumbbells", "bench"],
    },
    {
      name: "Donkey Kicks",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Resistance Band Donkey Kicks",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
    {
      name: "Fire Hydrants",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Resistance Band Fire Hydrants",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
    },
  ],
  calves: [
    {
      name: "Standing Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["bodyweight"],
    },
    {
      name: "Dumbbell Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["dumbbells"],
    },
    {
      name: "Smith Machine Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["smith-machine"],
    },
    {
      name: "Seated Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["dumbbells"],
    },
    {
      name: "Calf Press on Leg Press",
      compound: false,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["full-gym"],
    },
    {
      name: "Jump Rope",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Box Jumps",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Donkey Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["bodyweight"],
    },
    {
      name: "Single-Leg Calf Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
    },
    {
      name: "Single-Leg Dumbbell Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["dumbbells"],
    },
  ],
}

// Improved helper function to filter exercises by available equipment
function filterExercisesByEquipment(exercises: any[], availableEquipment: string[]): any[] {
  return exercises.filter((exercise) => {
    // For "full-gym" selection, all exercises are available
    if (availableEquipment.includes("full-gym")) {
      return true
    }

    // For bodyweight exercises, they should always be available
    if (exercise.equipment.includes("bodyweight")) {
      return true
    }

    // Check if ANY of the required equipment is available (not ALL)
    // This ensures we only include exercises that can be performed with the available equipment
    return exercise.equipment.some((eq) => availableEquipment.includes(eq))
  })
}

// Improved specialized workout generator that strictly respects equipment constraints and push/pull/legs categorization
function createSpecializedWorkout(
  muscleGroups: string[],
  fitnessLevel: string,
  benchPress: LiftData,
  squat: LiftData,
  deadlift: LiftData,
  availableEquipment: string[],
  workoutDuration: number,
  weightGoal: WeightGoalData,
  isPushDay = false,
  isPullDay = false,
  isLegsDay = false,
): Exercise[] {
  // Calculate max exercises based on workout duration
  // More accurate calculation: 10-12 minutes per exercise on average
  const maxExercisesPerDay = Math.max(5, Math.floor(workoutDuration / 10))

  // Determine exercise intensity based on fitness level and weight goal
  let intensity = fitnessLevel === "beginner" ? "moderate" : fitnessLevel === "intermediate" ? "high" : "very high"

  // Adjust intensity based on weight goal
  if (weightGoal.type === "lose") {
    // For weight loss, increase volume and decrease rest
    intensity = intensity === "moderate" ? "high" : "very high"
  } else if (weightGoal.type === "gain") {
    // For muscle gain, focus on heavier weights and compound movements
    intensity = intensity === "moderate" ? "moderate" : "high"
  }

  // Get available exercises for each muscle group
  let availableExercises: any[] = []

  // First add compound exercises for selected muscle groups
  for (const group of muscleGroups) {
    const groupExercises = exerciseDatabase[group as keyof typeof exerciseDatabase] || []
    const compoundExercises = groupExercises.filter((ex) => ex.compound)

    // Strictly filter by available equipment
    const filteredCompoundExercises = filterExercisesByEquipment(compoundExercises, availableEquipment)

    // Filter by push/pull/legs if specified
    const categoryFilteredExercises = filterExercisesByCategory(
      filteredCompoundExercises,
      isPushDay,
      isPullDay,
      isLegsDay,
      group,
    )

    availableExercises = [...availableExercises, ...categoryFilteredExercises]
  }

  // Then add isolation exercises for selected muscle groups
  for (const group of muscleGroups) {
    const groupExercises = exerciseDatabase[group as keyof typeof exerciseDatabase] || []
    const isolationExercises = groupExercises.filter((ex) => !ex.compound)

    // Strictly filter by available equipment
    const filteredIsolationExercises = filterExercisesByEquipment(isolationExercises, availableEquipment)

    // Filter by push/pull/legs if specified
    const categoryFilteredExercises = filterExercisesByCategory(
      filteredIsolationExercises,
      isPushDay,
      isPullDay,
      isLegsDay,
      group,
    )

    availableExercises = [...availableExercises, ...categoryFilteredExercises]
  }

  // If we don't have enough exercises after filtering, add bodyweight alternatives
  if (availableExercises.length < maxExercisesPerDay) {
    for (const group of muscleGroups) {
      const groupExercises = exerciseDatabase[group as keyof typeof exerciseDatabase] || []
      const bodyweightExercises = groupExercises.filter(
        (ex) => ex.equipment.includes("bodyweight") && !availableExercises.some((ae) => ae.name === ex.name),
      )

      // Filter by push/pull/legs if specified
      const categoryFilteredExercises = filterExercisesByCategory(
        bodyweightExercises,
        isPushDay,
        isPullDay,
        isLegsDay,
        group,
      )

      availableExercises = [...availableExercises, ...categoryFilteredExercises]
    }
  }

  // Shuffle exercises to create variety
  const shuffledExercises = shuffleArray(availableExercises)

  // Select exercises based on workout duration
  // Ensure we have enough exercises to fill the workout duration
  const selectedExercises = shuffledExercises.slice(0, maxExercisesPerDay)

  // Create the workout with appropriate sets, reps, and rest times
  const workout: Exercise[] = []

  for (const exercise of selectedExercises) {
    let sets = 0
    let reps = ""
    let rest = ""

    if (exercise.compound) {
      // Compound exercises
      if (intensity === "moderate") {
        sets = 3
        reps = "8-12"
        rest = "90 sec"
      } else if (intensity === "high") {
        sets = 4
        reps = "6-10"
        rest = "2 min"
      } else {
        // very high
        sets = 5
        reps = "4-8"
        rest = "2-3 min"
      }
    } else {
      // Isolation exercises
      if (intensity === "moderate") {
        sets = 3
        reps = "10-15"
        rest = "60 sec"
      } else if (intensity === "high") {
        sets = 3
        reps = "8-12"
        rest = "90 sec"
      } else {
        // very high
        sets = 4
        reps = "8-12"
        rest = "90 sec"
      }
    }

    // Calculate weight if applicable
    let weight: string | undefined = undefined

    if (exercise.primaryLift && exercise.percentage) {
      let baseWeight = 0

      // Get the appropriate 1RM
      if (exercise.primaryLift === "benchPress" && benchPress.value > 0) {
        baseWeight = benchPress.value
      } else if (exercise.primaryLift === "squat" && squat.value > 0) {
        baseWeight = squat.value
      } else if (exercise.primaryLift === "deadlift" && deadlift.value > 0) {
        baseWeight = deadlift.value
      }

      // Calculate weight based on percentage of 1RM and rep range
      if (baseWeight > 0) {
        // Parse rep range
        let maxReps = 0
        if (reps.includes("-")) {
          const parts = reps.split("-")
          maxReps = Number.parseInt(parts[1])
        } else {
          maxReps = Number.parseInt(reps)
        }

        // Apply Brzycki formula with adjustment for fitness level
        const levelAdjustment = fitnessLevel === "beginner" ? 0.9 : fitnessLevel === "intermediate" ? 0.95 : 1.0
        const repAdjustment = (1.0278 - 0.0278 * maxReps) * levelAdjustment

        // Calculate weight and round to nearest 2.5kg
        const calculatedWeight = Math.round((baseWeight * exercise.percentage * repAdjustment) / 2.5) * 2.5
        weight = `${calculatedWeight} kg`
      }
    }

    workout.push({
      name: exercise.name,
      sets,
      reps,
      rest,
      weight,
    })
  }

  // Calculate total workout time to ensure it matches the requested duration
  let totalWorkoutTime = 0
  for (const exercise of workout) {
    // Estimate time for this exercise
    const setTime = estimateExerciseTime(exercise.sets, exercise.reps, exercise.rest)
    totalWorkoutTime += setTime
  }

  // Add warm-up and cool-down time
  totalWorkoutTime += 10 // 5 min warm-up + 5 min cool-down

  // If workout is too short, increase sets or add more exercises
  if (totalWorkoutTime < workoutDuration * 0.8 && shuffledExercises.length > selectedExercises.length) {
    // Add more exercises if available
    const additionalExercises = shuffledExercises.slice(
      selectedExercises.length,
      selectedExercises.length + Math.ceil((workoutDuration - totalWorkoutTime) / 10),
    )

    for (const exercise of additionalExercises) {
      let sets = 0
      let reps = ""
      let rest = ""

      if (exercise.compound) {
        sets = fitnessLevel === "beginner" ? 3 : fitnessLevel === "intermediate" ? 4 : 5
        reps = fitnessLevel === "beginner" ? "8-12" : fitnessLevel === "intermediate" ? "6-10" : "5-8"
        rest = fitnessLevel === "beginner" ? "90 sec" : fitnessLevel === "intermediate" ? "2 min" : "2-3 min"
      } else {
        sets = fitnessLevel === "beginner" ? 3 : fitnessLevel === "intermediate" ? 3 : 4
        reps = fitnessLevel === "beginner" ? "10-15" : fitnessLevel === "intermediate" ? "10-12" : "8-12"
        rest = fitnessLevel === "beginner" ? "60 sec" : fitnessLevel === "intermediate" ? "90 sec" : "90 sec"
      }

      // Calculate weight if applicable
      let weight: string | undefined = undefined

      if (exercise.primaryLift && exercise.percentage) {
        let baseWeight = 0

        if (exercise.primaryLift === "benchPress" && benchPress.value > 0) {
          baseWeight = benchPress.value
        } else if (exercise.primaryLift === "squat" && squat.value > 0) {
          baseWeight = squat.value
        } else if (exercise.primaryLift === "deadlift" && deadlift.value > 0) {
          baseWeight = deadlift.value
        }

        if (baseWeight > 0) {
          let maxReps = 0
          if (reps.includes("-")) {
            const parts = reps.split("-")
            maxReps = Number.parseInt(parts[1])
          } else {
            maxReps = Number.parseInt(reps)
          }

          const levelAdjustment = fitnessLevel === "beginner" ? 0.9 : fitnessLevel === "intermediate" ? 0.95 : 1.0
          const repAdjustment = (1.0278 - 0.0278 * maxReps) * levelAdjustment

          const calculatedWeight = Math.round((baseWeight * exercise.percentage * repAdjustment) / 2.5) * 2.5
          weight = `${calculatedWeight} kg`
        }
      }

      workout.push({
        name: exercise.name,
        sets,
        reps,
        rest,
        weight,
      })
    }
  }

  // If still too short, increase sets for existing exercises
  if (totalWorkoutTime < workoutDuration * 0.8) {
    for (let i = 0; i < workout.length; i++) {
      // Add 1-2 more sets to each exercise until we reach the target duration
      const exercise = workout[i]
      const oldSets = exercise.sets
      const additionalSets = Math.min(2, Math.ceil((workoutDuration - totalWorkoutTime) / (workout.length * 3)))

      if (additionalSets > 0) {
        exercise.sets += additionalSets
        // Update total time calculation
        const oldTime = estimateExerciseTime(oldSets, exercise.reps, exercise.rest)
        const newTime = estimateExerciseTime(exercise.sets, exercise.reps, exercise.rest)
        totalWorkoutTime += newTime - oldTime
      }

      // If we've reached the target duration, stop adding sets
      if (totalWorkoutTime >= workoutDuration * 0.8) break
    }
  }

  return workout
}

// Add a new helper function to filter exercises by push/pull/legs category
function filterExercisesByCategory(
  exercises: any[],
  isPushDay: boolean,
  isPullDay: boolean,
  isLegsDay: boolean,
  muscleGroup: string,
): any[] {
  // If not filtering by category, return all exercises
  if (!isPushDay && !isPullDay && !isLegsDay) {
    return exercises
  }

  return exercises.filter((exercise) => {
    const exerciseName = exercise.name.toLowerCase()

    // Special handling for arms exercises
    if (muscleGroup === "arms") {
      // Push exercises (triceps focused)
      const isPushExercise =
        exerciseName.includes("tricep") ||
        exerciseName.includes("pushdown") ||
        exerciseName.includes("skull crusher") ||
        exerciseName.includes("overhead") ||
        exerciseName.includes("extension") ||
        exerciseName.includes("dips") ||
        exerciseName.includes("close grip") ||
        exerciseName.includes("diamond")

      // Pull exercises (biceps focused)
      const isPullExercise =
        exerciseName.includes("bicep") ||
        exerciseName.includes("curl") ||
        exerciseName.includes("chin-up") ||
        exerciseName.includes("hammer") ||
        exerciseName.includes("preacher")

      if (isPushDay && isPushExercise) return true
      if (isPullDay && isPullExercise) return true

      // If it's not clearly a push or pull exercise, default to the day type
      if (isPushDay && !isPullExercise) return true
      if (isPullDay && !isPushExercise) return true

      return false
    }

    // For other muscle groups, follow the standard categorization
    if (isPushDay && (muscleGroup === "chest" || muscleGroup === "shoulders")) {
      return true
    }

    if (isPullDay && muscleGroup === "back") {
      return true
    }

    if (
      isLegsDay &&
      (muscleGroup === "legs" || muscleGroup === "glutes" || muscleGroup === "calves" || muscleGroup === "core")
    ) {
      return true
    }

    return false
  })
}

// Update the generateWorkoutPlan function to include workout frequency
export function generateWorkoutPlan(
  height: HeightData = { value: 170, display: "170 cm" },
  weight: WeightData = { value: 70, display: "70 kg" },
  age: AgeData = { value: 30 },
  fitnessLevel: FitnessLevelData = { value: "intermediate" },
  workoutSplit: WorkoutSplitData = { value: "push-pull-legs" },
  benchPress: LiftData = { value: 0, display: "0 kg" },
  squat: LiftData = { value: 0, display: "0 kg" },
  deadlift: LiftData = { value: 0, display: "0 kg" },
  weightGoal: WeightGoalData = { value: 0, display: "0 kg", type: "maintain" },
  timeFrame: TimeFrameData = { value: 12 },
  selectedMuscleGroups: string[] = [],
  focusType: FocusTypeData = { value: "balanced" },
  availableEquipment: string[] = ["bodyweight"],
  workoutDuration: { value: number } = { value: 60 }, // Default to 60 minutes
  workoutFrequency: { daysPerWeek: number; cycleLength: number } = { daysPerWeek: 4, cycleLength: 1 }, // Default to 4 days per week, 1 week cycle
): WorkoutDay[] {
  // Create workout split based on selected type and muscle groups
  const workoutPlan: WorkoutDay[] = []

  // Ensure we have valid values for all parameters
  const safeSelectedMuscleGroups = selectedMuscleGroups || []
  const safeFitnessLevel = fitnessLevel?.value || "intermediate"
  const safeFocusType = focusType?.value || "balanced"
  const safeEquipment = availableEquipment || ["bodyweight"]
  const safeDuration = workoutDuration?.value || 60
  const safeDaysPerWeek = workoutFrequency?.daysPerWeek || 4
  const safeCycleLength = workoutFrequency?.cycleLength || 1

  // Calculate total days in the cycle
  const totalDays = safeCycleLength * 7

  // Determine workout structure based on split type
  const splitType = workoutSplit?.value || "push-pull-legs"

  // Create the workout plan based on the selected split
  switch (splitType) {
    case "full-body":
      createFullBodySplit(
        workoutPlan,
        safeSelectedMuscleGroups,
        safeFitnessLevel,
        safeFocusType,
        benchPress,
        squat,
        deadlift,
        safeEquipment,
        safeDuration,
        safeDaysPerWeek,
        totalDays,
        weightGoal,
      )
      break
    case "upper-lower":
      createUpperLowerSplit(
        workoutPlan,
        safeSelectedMuscleGroups,
        safeFitnessLevel,
        safeFocusType,
        benchPress,
        squat,
        deadlift,
        safeEquipment,
        safeDuration,
        safeDaysPerWeek,
        totalDays,
        weightGoal,
      )
      break
    case "push-pull-legs":
      createPushPullLegsSplit(
        workoutPlan,
        safeSelectedMuscleGroups,
        safeFitnessLevel,
        safeFocusType,
        benchPress,
        squat,
        deadlift,
        safeEquipment,
        safeDuration,
        safeDaysPerWeek,
        totalDays,
        weightGoal,
      )
      break
    case "body-part":
      createBodyPartSplit(
        workoutPlan,
        safeSelectedMuscleGroups,
        safeFitnessLevel,
        safeFocusType,
        benchPress,
        squat,
        deadlift,
        safeEquipment,
        safeDuration,
        safeDaysPerWeek,
        totalDays,
        weightGoal,
      )
      break
    default:
      // Default to push-pull-legs if no valid split is selected
      createPushPullLegsSplit(
        workoutPlan,
        safeSelectedMuscleGroups,
        safeFitnessLevel,
        safeFocusType,
        benchPress,
        squat,
        deadlift,
        safeEquipment,
        safeDuration,
        safeDaysPerWeek,
        totalDays,
        weightGoal,
      )
  }

  return workoutPlan
}

// Add a more accurate function to estimate exercise time
function estimateExerciseTime(sets: number, reps: string, rest: string): number {
  // Estimate time per set (in seconds)
  const timePerRep = 4 // Average seconds per rep (increased from 3 to 4 for more accuracy)

  // Parse reps (handle ranges like "8-12")
  let avgReps = 0
  if (reps.includes("-")) {
    const [min, max] = reps.split("-").map(Number)
    avgReps = (min + max) / 2
  } else if (reps !== "-") {
    avgReps = Number.parseInt(reps, 10)
  }

  // Parse rest time (convert "90 sec", "2 min", etc. to seconds)
  let restSeconds = 0
  if (rest.includes("min")) {
    if (rest.includes("-")) {
      // Handle ranges like "2-3 min"
      const parts = rest.replace(" min", "").split("-")
      const min = Number.parseFloat(parts[0])
      const max = Number.parseFloat(parts[1])
      restSeconds = ((min + max) / 2) * 60
    } else {
      const minutes = Number.parseFloat(rest.replace(" min", ""))
      restSeconds = minutes * 60
    }
  } else {
    restSeconds = Number.parseInt(rest.replace(" sec", ""), 10)
  }

  // Add setup time between exercises (30 seconds per set)
  const setupTimePerSet = 30

  // Calculate total time: (time per set + rest + setup) * sets - rest after last set
  const timePerSet = avgReps * timePerRep + setupTimePerSet
  const totalTime = (timePerSet + restSeconds) * sets - restSeconds

  // Return time in minutes
  return Math.ceil(totalTime / 60)
}

// Update the createFullBodySplit function to use the specialized workout generator
function createFullBodySplit(
  workoutPlan: WorkoutDay[],
  selectedMuscleGroups: string[],
  fitnessLevel: string,
  focusType: string,
  benchPress: LiftData,
  squat: LiftData,
  deadlift: LiftData,
  availableEquipment: string[],
  workoutDuration: number,
  daysPerWeek: number,
  totalDays: number,
  weightGoal: WeightGoalData,
): void {
  // Create a full cycle of days (1 or 2 weeks)
  for (let i = 0; i < totalDays; i++) {
    const dayNumber = i + 1
    const isWorkoutDay = i % 7 < daysPerWeek // Distribute workout days at the beginning of each week

    if (isWorkoutDay) {
      workoutPlan.push({ day: `Day ${dayNumber}`, exercises: [] })
    } else {
      workoutPlan.push({ day: `Day ${dayNumber}`, exercises: [{ name: "Rest Day", sets: 0, reps: "-", rest: "-" }] })
    }
  }

  // For each workout day, create a specialized workout
  const workoutDays = workoutPlan.filter((day) => !day.exercises.length)

  for (let i = 0; i < workoutDays.length; i++) {
    const currentDay = workoutDays[i]
    const dayIndex = workoutPlan.findIndex((day) => day === currentDay)

    // Create a unique workout for each day by varying the muscle group focus
    // This ensures different workouts across the cycle
    const weekNumber = Math.floor(dayIndex / 7)
    const dayOfWeek = dayIndex % 7

    // Rotate muscle group focus based on day of week and week number
    // This creates variety across the workout cycle
    const rotatedMuscleGroups = [...selectedMuscleGroups]

    // Rotate the array based on day and week to create different workouts
    if (weekNumber > 0 || dayOfWeek > 0) {
      const rotationAmount = (weekNumber * 7 + dayOfWeek) % rotatedMuscleGroups.length
      for (let j = 0; j < rotationAmount; j++) {
        if (rotatedMuscleGroups.length > 0) {
          const first = rotatedMuscleGroups.shift()
          if (first) rotatedMuscleGroups.push(first)
        }
      }
    }

    // If targeted focus, only use selected muscle groups
    const muscleGroupsToUse =
      focusType === "targeted"
        ? rotatedMuscleGroups
        : ["chest", "back", "shoulders", "arms", "legs", "core", "glutes", "calves"]

    // Create a specialized workout for this day
    const workout = createSpecializedWorkout(
      muscleGroupsToUse,
      fitnessLevel,
      benchPress,
      squat,
      deadlift,
      availableEquipment,
      workoutDuration,
      weightGoal,
      false,
      false,
      false,
    )

    // Add the workout to the plan
    workoutPlan[dayIndex].exercises = workout
  }
}

// Update the createUpperLowerSplit function
function createUpperLowerSplit(
  workoutPlan: WorkoutDay[],
  selectedMuscleGroups: string[],
  fitnessLevel: string,
  focusType: string,
  benchPress: LiftData,
  squat: LiftData,
  deadlift: LiftData,
  availableEquipment: string[],
  workoutDuration: number,
  daysPerWeek: number,
  totalDays: number,
  weightGoal: WeightGoalData,
): void {
  // Create a full cycle of days (1 or 2 weeks)
  for (let i = 0; i < totalDays; i++) {
    const dayNumber = i + 1
    workoutPlan.push({ day: `Day ${dayNumber}`, exercises: [] })
  }

  // Determine which days are workout days vs rest days
  const workoutDaysPerWeek = Math.min(daysPerWeek, 6) // Cap at 6 days per week

  // Distribute workout days throughout the cycle
  for (let week = 0; week < totalDays / 7; week++) {
    const weekStartIndex = week * 7

    // Mark workout days
    for (let i = 0; i < workoutDaysPerWeek; i++) {
      // Keep these as workout days (already empty exercise array)
      const dayIndex = weekStartIndex + i

      // Update day name based on whether it's upper or lower
      if (i % 2 === 0) {
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Upper)`
      } else {
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Lower)`
      }
    }

    // Mark rest days
    for (let i = workoutDaysPerWeek; i < 7; i++) {
      const dayIndex = weekStartIndex + i
      if (dayIndex < totalDays) {
        workoutPlan[dayIndex].exercises = [{ name: "Rest Day", sets: 0, reps: "-", rest: "-" }]
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Rest)`
      }
    }
  }

  // Upper body muscle groups
  const upperGroups = ["chest", "back", "shoulders", "arms"]
  // Lower body muscle groups
  const lowerGroups = ["legs", "glutes", "calves", "core"]

  // Fill in the workout days
  for (let i = 0; i < workoutPlan.length; i++) {
    // Skip rest days
    if (workoutPlan[i].exercises.length > 0) continue

    // Determine if this is an upper or lower day
    const isUpperDay = workoutPlan[i].day.includes("Upper")

    // Create a unique workout for each day by varying the muscle group focus
    const weekNumber = Math.floor(i / 7)
    const dayOfWeek = i % 7

    // Get the appropriate muscle groups for this day
    const baseGroups = isUpperDay ? upperGroups : lowerGroups

    // Filter selected muscle groups to only include those relevant to this day type
    const relevantSelectedGroups = selectedMuscleGroups.filter((group) =>
      isUpperDay ? upperGroups.includes(group) : lowerGroups.includes(group),
    )

    // Rotate muscle group focus based on day of week and week number
    const rotatedMuscleGroups = [...relevantSelectedGroups]

    // Rotate the array based on day and week to create different workouts
    if (weekNumber > 0 || dayOfWeek > 0) {
      const rotationAmount = (weekNumber * 7 + dayOfWeek) % Math.max(1, rotatedMuscleGroups.length)
      for (let j = 0; j < rotationAmount; j++) {
        if (rotatedMuscleGroups.length > 0) {
          const first = rotatedMuscleGroups.shift()
          if (first) rotatedMuscleGroups.push(first)
        }
      }
    }

    // If targeted focus, only use selected muscle groups
    const muscleGroupsToUse = focusType === "targeted" ? rotatedMuscleGroups : baseGroups

    // Create a specialized workout for this day
    const workout = createSpecializedWorkout(
      muscleGroupsToUse,
      fitnessLevel,
      benchPress,
      squat,
      deadlift,
      availableEquipment,
      workoutDuration,
      weightGoal,
      false,
      false,
      false,
    )

    // Add the workout to the plan
    workoutPlan[i].exercises = workout
  }
}

// Update the createPushPullLegsSplit function
function createPushPullLegsSplit(
  workoutPlan: WorkoutDay[],
  selectedMuscleGroups: string[],
  fitnessLevel: string,
  focusType: string,
  benchPress: LiftData,
  squat: LiftData,
  deadlift: LiftData,
  availableEquipment: string[],
  workoutDuration: number,
  daysPerWeek: number,
  totalDays: number,
  weightGoal: WeightGoalData,
): void {
  // Create a full cycle of days (1 or 2 weeks)
  for (let i = 0; i < totalDays; i++) {
    const dayNumber = i + 1
    workoutPlan.push({ day: `Day ${dayNumber}`, exercises: [] })
  }

  // Determine which days are workout days vs rest days
  const workoutDaysPerWeek = Math.min(daysPerWeek, 6) // Cap at 6 days per week

  // Distribute workout days throughout the cycle
  for (let week = 0; week < totalDays / 7; week++) {
    const weekStartIndex = week * 7

    // Mark workout days
    for (let i = 0; i < workoutDaysPerWeek; i++) {
      // Keep these as workout days (already empty exercise array)
      const dayIndex = weekStartIndex + i

      // Update day name based on whether it's upper or lower
      if (i % 3 === 0) {
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Push)`
      } else if (i % 3 === 1) {
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Pull)`
      } else {
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Legs)`
      }
    }

    // Mark rest days
    for (let i = workoutDaysPerWeek; i < 7; i++) {
      const dayIndex = weekStartIndex + i
      if (dayIndex < totalDays) {
        workoutPlan[dayIndex].exercises = [{ name: "Rest Day", sets: 0, reps: "-", rest: "-" }]
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Rest)`
      }
    }
  }

  // Push muscle groups (chest, shoulders, triceps)
  const pushGroups = ["chest", "shoulders"]
  // Pull muscle groups (back, biceps)
  const pullGroups = ["back"]
  // Legs muscle groups
  const legsGroups = ["legs", "glutes", "calves", "core"]

  // Fill in the workout days
  for (let i = 0; i < workoutPlan.length; i++) {
    // Skip rest days
    if (workoutPlan[i].exercises.length > 0) continue

    // Determine if this is a push, pull, or legs day
    const isPushDay = workoutPlan[i].day.includes("Push")
    const isPullDay = workoutPlan[i].day.includes("Pull")
    const isLegsDay = workoutPlan[i].day.includes("Legs")

    // Create a unique workout for each day by varying the muscle group focus
    const weekNumber = Math.floor(i / 7)
    const dayOfWeek = i % 7

    // Get the appropriate muscle groups for this day
    let baseGroups: string[] = []
    if (isPushDay) {
      baseGroups = pushGroups
      // Add triceps exercises from arms
      baseGroups.push("arms")
    } else if (isPullDay) {
      baseGroups = pullGroups
      // Add biceps exercises from arms
      baseGroups.push("arms")
    } else if (isLegsDay) {
      baseGroups = legsGroups
    }

    // Filter selected muscle groups to only include those relevant to this day type
    const relevantSelectedGroups = selectedMuscleGroups.filter((group) => {
      if (isPushDay) {
        return pushGroups.includes(group) || group === "arms" // Include arms for triceps on push days
      } else if (isPullDay) {
        return pullGroups.includes(group) || group === "arms" // Include arms for biceps on pull days
      } else {
        return legsGroups.includes(group)
      }
    })

    // Rotate muscle group focus based on day of week and week number
    const rotatedMuscleGroups = [...relevantSelectedGroups]

    // Rotate the array based on day and week to create different workouts
    if (weekNumber > 0 || dayOfWeek > 0) {
      const rotationAmount = (weekNumber * 7 + dayOfWeek) % Math.max(1, rotatedMuscleGroups.length)
      for (let j = 0; j < rotationAmount; j++) {
        if (rotatedMuscleGroups.length > 0) {
          const first = rotatedMuscleGroups.shift()
          if (first) rotatedMuscleGroups.push(first)
        }
      }
    }

    // If targeted focus, only use selected muscle groups
    const muscleGroupsToUse = focusType === "targeted" ? rotatedMuscleGroups : baseGroups

    // Create a specialized workout for this day
    const workout = createSpecializedWorkout(
      muscleGroupsToUse,
      fitnessLevel,
      benchPress,
      squat,
      deadlift,
      availableEquipment,
      workoutDuration,
      weightGoal,
      isPushDay, // Pass whether it's a push day
      isPullDay, // Pass whether it's a pull day
      isLegsDay, // Pass whether it's a legs day
    )

    // Add the workout to the plan
    workoutPlan[i].exercises = workout
  }
}

// Update the createBodyPartSplit function
function createBodyPartSplit(
  workoutPlan: WorkoutDay[],
  selectedMuscleGroups: string[],
  fitnessLevel: string,
  focusType: string,
  benchPress: LiftData,
  squat: LiftData,
  deadlift: LiftData,
  availableEquipment: string[],
  workoutDuration: number,
  daysPerWeek: number,
  totalDays: number,
  weightGoal: WeightGoalData,
): void {
  // Create a full cycle of days (1 or 2 weeks)
  for (let i = 0; i < totalDays; i++) {
    const dayNumber = i + 1
    workoutPlan.push({ day: `Day ${dayNumber}`, exercises: [] })
  }

  // Determine which days are workout days vs rest days
  const workoutDaysPerWeek = Math.min(daysPerWeek, 6) // Cap at 6 days per week

  // Distribute workout days throughout the cycle
  for (let week = 0; week < totalDays / 7; week++) {
    const weekStartIndex = week * 7

    // Mark rest days
    for (let i = workoutDaysPerWeek; i < 7; i++) {
      const dayIndex = weekStartIndex + i
      if (dayIndex < totalDays) {
        workoutPlan[dayIndex].exercises = [{ name: "Rest Day", sets: 0, reps: "-", rest: "-" }]
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Rest)`
      }
    }
  }

  // All available muscle groups
  const allMuscleGroups = ["chest", "back", "shoulders", "arms", "legs", "glutes", "calves", "core"]

  // If targeted focus, only use selected muscle groups
  const muscleGroupsToUse = focusType === "targeted" ? selectedMuscleGroups : allMuscleGroups

  // Get all workout days (days without rest)
  const workoutDays = workoutPlan.filter((day) => day.exercises.length === 0)

  // Distribute muscle groups across workout days
  const muscleGroupsPerDay = Math.ceil(muscleGroupsToUse.length / workoutDays.length)

  for (let i = 0; i < workoutDays.length; i++) {
    const dayIndex = workoutPlan.findIndex((day) => day === workoutDays[i])
    const startGroupIndex = (i * muscleGroupsPerDay) % muscleGroupsToUse.length

    // Create a unique set of muscle groups for each day
    // This creates variety across the workout cycle
    let dayGroups: string[] = []

    // For week 1, use sequential groups
    if (dayIndex < 7) {
      const endGroupIndex = Math.min(startGroupIndex + muscleGroupsPerDay, muscleGroupsToUse.length)
      dayGroups = muscleGroupsToUse.slice(startGroupIndex, endGroupIndex)

      // If we need more groups, wrap around to the beginning
      if (dayGroups.length < muscleGroupsPerDay && muscleGroupsToUse.length > 0) {
        const remaining = muscleGroupsPerDay - dayGroups.length
        dayGroups = [...dayGroups, ...muscleGroupsToUse.slice(0, remaining)]
      }
    }
    // For week 2+, rotate the groups to create different combinations
    else {
      const weekNumber = Math.floor(dayIndex / 7)
      const rotationAmount = weekNumber % muscleGroupsToUse.length

      // Rotate the array based on week number
      const rotatedGroups = [...muscleGroupsToUse]
      for (let j = 0; j < rotationAmount; j++) {
        if (rotatedGroups.length > 0) {
          const first = rotatedGroups.shift()
          if (first) rotatedGroups.push(first)
        }
      }

      // Get groups for this day
      const endGroupIndex = Math.min(startGroupIndex + muscleGroupsPerDay, rotatedGroups.length)
      dayGroups = rotatedGroups.slice(startGroupIndex, endGroupIndex)

      // If we need more groups, wrap around to the beginning
      if (dayGroups.length < muscleGroupsPerDay && rotatedGroups.length > 0) {
        const remaining = muscleGroupsPerDay - dayGroups.length
        dayGroups = [...dayGroups, ...rotatedGroups.slice(0, remaining)]
      }
    }

    if (dayGroups.length === 0) continue

    // Update day name to reflect muscle groups
    workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (${dayGroups.map(capitalizeFirstLetter).join("/")})`

    // Create a specialized workout for this day
    const workout = createSpecializedWorkout(
      dayGroups,
      fitnessLevel,
      benchPress,
      squat,
      deadlift,
      availableEquipment,
      workoutDuration,
      weightGoal,
      false,
      false,
      false,
    )

    // Add the workout to the plan
    workoutPlan[dayIndex].exercises = workout
  }
}

// Update the addExerciseToDay function to better calculate weights based on 1RM
function addExerciseToDay(
  day: WorkoutDay,
  exercise: {
    name: string
    compound: boolean
    primaryLift: string | null
    percentage: number | null
    equipment: string[]
  },
  fitnessLevel: string,
  benchPress: LiftData,
  squat: LiftData,
  deadlift: LiftData,
): void {
  // Determine sets, reps, and rest based on exercise type and fitness level
  let sets = 3
  let reps = "8-12"
  let rest = "60 sec"
  let weight: string | undefined = undefined

  if (exercise.compound) {
    sets = fitnessLevel === "beginner" ? 3 : fitnessLevel === "intermediate" ? 4 : 5
    reps = fitnessLevel === "beginner" ? "8-10" : fitnessLevel === "intermediate" ? "6-10" : "5-8"
    rest = fitnessLevel === "beginner" ? "90 sec" : fitnessLevel === "intermediate" ? "2 min" : "2-3 min"
  } else {
    sets = fitnessLevel === "beginner" ? 2 : fitnessLevel === "intermediate" ? 3 : 4
    reps = fitnessLevel === "beginner" ? "10-15" : fitnessLevel === "intermediate" ? "10-12" : "8-12"
    rest = fitnessLevel === "beginner" ? "60 sec" : fitnessLevel === "intermediate" ? "90 sec" : "90 sec"
  }

  // Calculate weight based on 1RM if available
  if (exercise.primaryLift && exercise.percentage) {
    let baseWeight = 0

    // Get the appropriate 1RM
    if (exercise.primaryLift === "benchPress" && benchPress.value > 0) {
      baseWeight = benchPress.value
    } else if (exercise.primaryLift === "squat" && squat.value > 0) {
      baseWeight = squat.value
    } else if (exercise.primaryLift === "deadlift" && deadlift.value > 0) {
      baseWeight = deadlift.value
    }

    // Calculate weight based on percentage of 1RM and rep range
    if (baseWeight > 0) {
      // Adjust percentage based on rep range (higher reps = lower percentage)
      let repAdjustment = 1.0

      // Use the Brzycki formula to estimate appropriate weight for rep range
      // Formula: Weight = 1RM * (1.0278 - 0.0278 * reps)
      let maxReps = 0

      if (reps.includes("-")) {
        // Extract the higher number from ranges like "8-12"
        const parts = reps.split("-")
        maxReps = Number.parseInt(parts[1])
      } else {
        maxReps = Number.parseInt(reps)
      }

      // Apply the formula with a slight adjustment for fitness level
      const levelAdjustment = fitnessLevel === "beginner" ? 0.9 : fitnessLevel === "intermediate" ? 0.95 : 1.0
      repAdjustment = (1.0278 - 0.0278 * maxReps) * levelAdjustment

      // Calculate the weight and round to nearest 2.5kg
      const calculatedWeight = Math.round((baseWeight * exercise.percentage * repAdjustment) / 2.5) * 2.5
      weight = `${calculatedWeight} kg`
    }
  }

  day.exercises.push({
    name: exercise.name,
    sets,
    reps,
    rest,
    weight,
  })
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

