// AI-driven workout generator
// This uses a scoring system to intelligently select exercises based on multiple factors

type HeightData = { value: number; display: string }
type WeightData = { value: number; display: string }
type AgeData = { value: number }
type FitnessLevelData = { value: string }
type WorkoutSplitData = { value: string }
type LiftData = { value: number; display: string }
type WeightGoalData = { value: number; display: string; type: string }
type TimeFrameData = { value: number }
type FocusTypeData = { value: string }
type Exercise = { name: string; sets: number; reps: string; rest: string; weight?: string }
type WorkoutDay = { day: string; exercises: Exercise[] }

// Exercise database with metadata for AI scoring
const exerciseDatabase = {
  chest: [
    {
      name: "Bench Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.8,
      equipment: ["barbell", "bench"],
      category: "push",
      difficulty: 0.8,
      effectiveness: 0.9,
      muscleActivation: 0.9,
      beginner: 0.7,
      intermediate: 0.9,
      advanced: 0.95,
    },
    {
      name: "Incline Dumbbell Press",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.6,
      equipment: ["dumbbells", "bench"],
      category: "push",
      difficulty: 0.7,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Chest Flyes",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["dumbbells", "bench"],
      category: "push",
      difficulty: 0.5,
      effectiveness: 0.7,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Push-Ups",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "push",
      difficulty: 0.4,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.95,
      intermediate: 0.7,
      advanced: 0.5,
    },
    {
      name: "Cable Crossovers",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["cable-machine"],
      category: "push",
      difficulty: 0.6,
      effectiveness: 0.75,
      muscleActivation: 0.85,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.9,
    },
    {
      name: "Decline Bench Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.85,
      equipment: ["barbell", "bench"],
      category: "push",
      difficulty: 0.75,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.6,
      intermediate: 0.8,
      advanced: 0.9,
    },
    {
      name: "Dumbbell Pullovers",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.4,
      equipment: ["dumbbells", "bench"],
      category: "push",
      difficulty: 0.65,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.6,
      intermediate: 0.75,
      advanced: 0.8,
    },
    {
      name: "Dumbbell Bench Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.7,
      equipment: ["dumbbells", "bench"],
      category: "push",
      difficulty: 0.7,
      effectiveness: 0.85,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.9,
      advanced: 0.85,
    },
    {
      name: "Resistance Band Chest Press",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "push",
      difficulty: 0.4,
      effectiveness: 0.6,
      muscleActivation: 0.7,
      beginner: 0.9,
      intermediate: 0.7,
      advanced: 0.5,
    },
    {
      name: "Smith Machine Bench Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.8,
      equipment: ["smith-machine", "bench"],
      category: "push",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Incline Push-Ups",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight", "bench"],
      category: "push",
      difficulty: 0.3,
      effectiveness: 0.6,
      muscleActivation: 0.7,
      beginner: 0.95,
      intermediate: 0.6,
      advanced: 0.4,
    },
    {
      name: "Decline Push-Ups",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight", "bench"],
      category: "push",
      difficulty: 0.5,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.85,
      intermediate: 0.75,
      advanced: 0.6,
    },
  ],
  back: [
    {
      name: "Deadlift",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.8,
      equipment: ["barbell"],
      category: "pull",
      difficulty: 0.9,
      effectiveness: 0.95,
      muscleActivation: 0.9,
      beginner: 0.6,
      intermediate: 0.85,
      advanced: 0.95,
    },
    {
      name: "Pull-Ups",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "pull",
      difficulty: 0.8,
      effectiveness: 0.9,
      muscleActivation: 0.85,
      beginner: 0.5,
      intermediate: 0.8,
      advanced: 0.95,
    },
    {
      name: "Bent Over Rows",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.5,
      equipment: ["barbell"],
      category: "pull",
      difficulty: 0.75,
      effectiveness: 0.85,
      muscleActivation: 0.85,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.9,
    },
    {
      name: "Dumbbell Rows",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.4,
      equipment: ["dumbbells"],
      category: "pull",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Lat Pulldowns",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.5,
      equipment: ["cable-machine"],
      category: "pull",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.75,
    },
    {
      name: "Seated Cable Rows",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.4,
      equipment: ["cable-machine"],
      category: "pull",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.75,
    },
    {
      name: "T-Bar Rows",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.5,
      equipment: ["barbell"],
      category: "pull",
      difficulty: 0.7,
      effectiveness: 0.85,
      muscleActivation: 0.85,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.9,
    },
    {
      name: "Single-Arm Dumbbell Rows",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.3,
      equipment: ["dumbbells", "bench"],
      category: "pull",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.75,
    },
    {
      name: "Inverted Rows",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "pull",
      difficulty: 0.6,
      effectiveness: 0.75,
      muscleActivation: 0.75,
      beginner: 0.8,
      intermediate: 0.75,
      advanced: 0.6,
    },
    {
      name: "Resistance Band Rows",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "pull",
      difficulty: 0.4,
      effectiveness: 0.65,
      muscleActivation: 0.7,
      beginner: 0.9,
      intermediate: 0.7,
      advanced: 0.5,
    },
    {
      name: "Smith Machine Rows",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.5,
      equipment: ["smith-machine"],
      category: "pull",
      difficulty: 0.6,
      effectiveness: 0.75,
      muscleActivation: 0.75,
      beginner: 0.8,
      intermediate: 0.75,
      advanced: 0.65,
    },
  ],
  shoulders: [
    {
      name: "Overhead Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.6,
      equipment: ["barbell"],
      category: "push",
      difficulty: 0.8,
      effectiveness: 0.9,
      muscleActivation: 0.9,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.95,
    },
    {
      name: "Lateral Raises",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.15,
      equipment: ["dumbbells"],
      category: "push",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.85,
      intermediate: 0.9,
      advanced: 0.85,
    },
    {
      name: "Face Pulls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["cable-machine"],
      category: "pull",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Resistance Band Face Pulls",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "pull",
      difficulty: 0.4,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.9,
      intermediate: 0.8,
      advanced: 0.6,
    },
    {
      name: "Upright Rows",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["barbell"],
      category: "pull",
      difficulty: 0.6,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.75,
      intermediate: 0.8,
      advanced: 0.75,
    },
    {
      name: "Dumbbell Upright Rows",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells"],
      category: "pull",
      difficulty: 0.5,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.8,
      intermediate: 0.75,
      advanced: 0.7,
    },
    {
      name: "Kettlebell Upright Rows",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["kettlebells"],
      category: "pull",
      difficulty: 0.5,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.8,
      intermediate: 0.75,
      advanced: 0.7,
    },
    {
      name: "Shrugs",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.4,
      equipment: ["barbell"],
      category: "pull",
      difficulty: 0.4,
      effectiveness: 0.7,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.75,
    },
    {
      name: "Dumbbell Shrugs",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.35,
      equipment: ["dumbbells"],
      category: "pull",
      difficulty: 0.3,
      effectiveness: 0.65,
      muscleActivation: 0.75,
      beginner: 0.9,
      intermediate: 0.75,
      advanced: 0.7,
    },
    {
      name: "Kettlebell Shrugs",
      compound: false,
      primaryLift: "deadlift",
      percentage: 0.35,
      equipment: ["kettlebells"],
      category: "pull",
      difficulty: 0.3,
      effectiveness: 0.65,
      muscleActivation: 0.75,
      beginner: 0.9,
      intermediate: 0.75,
      advanced: 0.7,
    },
    {
      name: "Arnold Press",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.4,
      equipment: ["dumbbells"],
      category: "push",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.9,
    },
    {
      name: "Front Raises",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.2,
      equipment: ["dumbbells"],
      category: "push",
      difficulty: 0.4,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Kettlebell Front Raises",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.2,
      equipment: ["kettlebells"],
      category: "push",
      difficulty: 0.4,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Resistance Band Front Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "push",
      difficulty: 0.3,
      effectiveness: 0.6,
      muscleActivation: 0.7,
      beginner: 0.9,
      intermediate: 0.7,
      advanced: 0.5,
    },
    {
      name: "Pike Push-Ups",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "push",
      difficulty: 0.7,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.7,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Dumbbell Shoulder Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.5,
      equipment: ["dumbbells"],
      category: "push",
      difficulty: 0.6,
      effectiveness: 0.85,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Smith Machine Shoulder Press",
      compound: true,
      primaryLift: "benchPress",
      percentage: 0.6,
      equipment: ["smith-machine"],
      category: "push",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Resistance Band Lateral Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "push",
      difficulty: 0.3,
      effectiveness: 0.65,
      muscleActivation: 0.7,
      beginner: 0.9,
      intermediate: 0.75,
      advanced: 0.6,
    },
  ],
  arms: [
    {
      name: "Bicep Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["barbell"],
      category: "pull",
      difficulty: 0.4,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Dumbbell Bicep Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells"],
      category: "pull",
      difficulty: 0.3,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.95,
      intermediate: 0.85,
      advanced: 0.75,
    },
    {
      name: "Cable Bicep Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["cable-machine"],
      category: "pull",
      difficulty: 0.3,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Tricep Pushdowns",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["cable-machine"],
      category: "push",
      difficulty: 0.3,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Resistance Band Tricep Pushdowns",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "push",
      difficulty: 0.3,
      effectiveness: 0.65,
      muscleActivation: 0.7,
      beginner: 0.9,
      intermediate: 0.75,
      advanced: 0.6,
    },
    {
      name: "Hammer Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells"],
      category: "pull",
      difficulty: 0.3,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Skull Crushers",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.4,
      equipment: ["barbell", "bench"],
      category: "push",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.9,
    },
    {
      name: "Dumbbell Skull Crushers",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.35,
      equipment: ["dumbbells", "bench"],
      category: "push",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.8,
      intermediate: 0.8,
      advanced: 0.75,
    },
    {
      name: "Chin-Ups",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "pull",
      difficulty: 0.7,
      effectiveness: 0.85,
      muscleActivation: 0.85,
      beginner: 0.6,
      intermediate: 0.8,
      advanced: 0.9,
    },
    {
      name: "Dips",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight", "bench"],
      category: "push",
      difficulty: 0.7,
      effectiveness: 0.85,
      muscleActivation: 0.85,
      beginner: 0.6,
      intermediate: 0.8,
      advanced: 0.9,
    },
    {
      name: "Preacher Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["barbell", "bench"],
      category: "pull",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Dumbbell Preacher Curls",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells", "bench"],
      category: "pull",
      difficulty: 0.4,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.75,
    },
    {
      name: "Overhead Tricep Extensions",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["dumbbells"],
      category: "push",
      difficulty: 0.4,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.75,
    },
    {
      name: "Cable Overhead Tricep Extensions",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.25,
      equipment: ["cable-machine"],
      category: "push",
      difficulty: 0.4,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.75,
    },
    {
      name: "Diamond Push-Ups",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "push",
      difficulty: 0.6,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.7,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Resistance Band Curls",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "pull",
      difficulty: 0.3,
      effectiveness: 0.65,
      muscleActivation: 0.7,
      beginner: 0.9,
      intermediate: 0.7,
      advanced: 0.5,
    },
    {
      name: "Resistance Band Tricep Extensions",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "push",
      difficulty: 0.3,
      effectiveness: 0.65,
      muscleActivation: 0.7,
      beginner: 0.9,
      intermediate: 0.7,
      advanced: 0.5,
    },
  ],
  legs: [
    {
      name: "Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.8,
      equipment: ["barbell"],
      category: "legs",
      difficulty: 0.9,
      effectiveness: 0.95,
      muscleActivation: 0.95,
      beginner: 0.7,
      intermediate: 0.9,
      advanced: 0.95,
    },
    {
      name: "Smith Machine Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.8,
      equipment: ["smith-machine"],
      category: "legs",
      difficulty: 0.7,
      effectiveness: 0.85,
      muscleActivation: 0.85,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Leg Press",
      compound: true,
      primaryLift: "squat",
      percentage: 1.2,
      equipment: ["full-gym"],
      category: "legs",
      difficulty: 0.6,
      effectiveness: 0.85,
      muscleActivation: 0.9,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Lunges",
      compound: true,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Dumbbell Lunges",
      compound: true,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["dumbbells"],
      category: "legs",
      difficulty: 0.7,
      effectiveness: 0.85,
      muscleActivation: 0.9,
      beginner: 0.75,
      intermediate: 0.85,
      advanced: 0.85,
    },
    {
      name: "Barbell Lunges",
      compound: true,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["barbell"],
      category: "legs",
      difficulty: 0.8,
      effectiveness: 0.9,
      muscleActivation: 0.9,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.9,
    },
    {
      name: "Leg Extensions",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["full-gym"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.7,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Leg Curls",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["full-gym"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.7,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Hack Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.7,
      equipment: ["full-gym"],
      category: "legs",
      difficulty: 0.8,
      effectiveness: 0.9,
      muscleActivation: 0.9,
      beginner: 0.8,
      intermediate: 0.9,
      advanced: 0.9,
    },
    {
      name: "Front Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.7,
      equipment: ["barbell"],
      category: "legs",
      difficulty: 0.8,
      effectiveness: 0.85,
      muscleActivation: 0.9,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.9,
    },
    {
      name: "Smith Machine Front Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.7,
      equipment: ["smith-machine"],
      category: "legs",
      difficulty: 0.7,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.8,
      advanced: 0.75,
    },
    {
      name: "Goblet Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["dumbbells"],
      category: "legs",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.9,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Kettlebell Goblet Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["kettlebells"],
      category: "legs",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.9,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Bodyweight Squats",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.3,
      effectiveness: 0.6,
      muscleActivation: 0.7,
      beginner: 0.95,
      intermediate: 0.6,
      advanced: 0.4,
    },
    {
      name: "Split Squats",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Dumbbell Split Squats",
      compound: true,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["dumbbells"],
      category: "legs",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Resistance Band Squats",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.65,
      muscleActivation: 0.7,
      beginner: 0.9,
      intermediate: 0.7,
      advanced: 0.5,
    },
  ],
  core: [
    {
      name: "Planks",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "core",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.7,
    },
    {
      name: "Russian Twists",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "core",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Weighted Russian Twists",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["dumbbells"],
      category: "core",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.75,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Kettlebell Russian Twists",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["kettlebells"],
      category: "core",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.75,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Hanging Leg Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "core",
      difficulty: 0.7,
      effectiveness: 0.85,
      muscleActivation: 0.9,
      beginner: 0.6,
      intermediate: 0.8,
      advanced: 0.9,
    },
    {
      name: "Ab Rollouts",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "core",
      difficulty: 0.8,
      effectiveness: 0.9,
      muscleActivation: 0.9,
      beginner: 0.6,
      intermediate: 0.8,
      advanced: 0.95,
    },
    {
      name: "Cable Crunches",
      compound: false,
      primaryLift: "benchPress",
      percentage: 0.3,
      equipment: ["cable-machine"],
      category: "core",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Mountain Climbers",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "core",
      difficulty: 0.5,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Bicycle Crunches",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "core",
      difficulty: 0.4,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Leg Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "core",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Bench Leg Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight", "bench"],
      category: "core",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Resistance Band Woodchoppers",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "core",
      difficulty: 0.5,
      effectiveness: 0.7,
      muscleActivation: 0.75,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
  ],
  glutes: [
    {
      name: "Hip Thrusts",
      compound: false,
      primaryLift: "squat",
      percentage: 0.7,
      equipment: ["barbell", "bench"],
      category: "legs",
      difficulty: 0.6,
      effectiveness: 0.9,
      muscleActivation: 0.95,
      beginner: 0.8,
      intermediate: 0.9,
      advanced: 0.95,
    },
    {
      name: "Glute Bridges",
      compound: false,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.3,
      effectiveness: 0.7,
      muscleActivation: 0.8,
      beginner: 0.95,
      intermediate: 0.8,
      advanced: 0.6,
    },
    {
      name: "Barbell Glute Bridges",
      compound: false,
      primaryLift: "squat",
      percentage: 0.6,
      equipment: ["barbell"],
      category: "legs",
      difficulty: 0.5,
      effectiveness: 0.85,
      muscleActivation: 0.9,
      beginner: 0.85,
      intermediate: 0.9,
      advanced: 0.85,
    },
    {
      name: "Romanian Deadlifts",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.7,
      equipment: ["barbell"],
      category: "legs",
      difficulty: 0.7,
      effectiveness: 0.9,
      muscleActivation: 0.9,
      beginner: 0.75,
      intermediate: 0.9,
      advanced: 0.95,
    },
    {
      name: "Dumbbell Romanian Deadlifts",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.6,
      equipment: ["dumbbells"],
      category: "legs",
      difficulty: 0.6,
      effectiveness: 0.85,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Bulgarian Split Squats",
      compound: false,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.7,
      effectiveness: 0.85,
      muscleActivation: 0.9,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.9,
    },
    {
      name: "Dumbbell Bulgarian Split Squats",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["dumbbells", "bench"],
      category: "legs",
      difficulty: 0.8,
      effectiveness: 0.9,
      muscleActivation: 0.95,
      beginner: 0.65,
      intermediate: 0.85,
      advanced: 0.95,
    },
    {
      name: "Cable Kickbacks",
      compound: false,
      primaryLift: "squat",
      percentage: 0.2,
      equipment: ["cable-machine"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.75,
      muscleActivation: 0.85,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Sumo Deadlifts",
      compound: true,
      primaryLift: "deadlift",
      percentage: 0.8,
      equipment: ["barbell"],
      category: "legs",
      difficulty: 0.8,
      effectiveness: 0.9,
      muscleActivation: 0.9,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.95,
    },
    {
      name: "Step-Ups",
      compound: false,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.8,
      beginner: 0.85,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Dumbbell Step-Ups",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["dumbbells", "bench"],
      category: "legs",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Donkey Kicks",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.3,
      effectiveness: 0.7,
      muscleActivation: 0.8,
      beginner: 0.95,
      intermediate: 0.8,
      advanced: 0.6,
    },
    {
      name: "Resistance Band Donkey Kicks",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.75,
      muscleActivation: 0.85,
      beginner: 0.9,
      intermediate: 0.8,
      advanced: 0.65,
    },
    {
      name: "Fire Hydrants",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.3,
      effectiveness: 0.65,
      muscleActivation: 0.75,
      beginner: 0.95,
      intermediate: 0.75,
      advanced: 0.55,
    },
    {
      name: "Resistance Band Fire Hydrants",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["resistance-bands"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.7,
      muscleActivation: 0.8,
      beginner: 0.9,
      intermediate: 0.75,
      advanced: 0.6,
    },
  ],
  calves: [
    {
      name: "Standing Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.3,
      effectiveness: 0.7,
      muscleActivation: 0.8,
      beginner: 0.95,
      intermediate: 0.8,
      advanced: 0.7,
    },
    {
      name: "Dumbbell Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["dumbbells"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.75,
      muscleActivation: 0.85,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.75,
    },
    {
      name: "Smith Machine Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["smith-machine"],
      category: "legs",
      difficulty: 0.5,
      effectiveness: 0.8,
      muscleActivation: 0.9,
      beginner: 0.85,
      intermediate: 0.9,
      advanced: 0.85,
    },
    {
      name: "Seated Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["dumbbells"],
      category: "legs",
      difficulty: 0.3,
      effectiveness: 0.75,
      muscleActivation: 0.85,
      beginner: 0.9,
      intermediate: 0.85,
      advanced: 0.75,
    },
    {
      name: "Calf Press on Leg Press",
      compound: false,
      primaryLift: "squat",
      percentage: 0.5,
      equipment: ["full-gym"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.8,
      muscleActivation: 0.9,
      beginner: 0.85,
      intermediate: 0.9,
      advanced: 0.85,
    },
    {
      name: "Jump Rope",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.4,
      effectiveness: 0.65,
      muscleActivation: 0.7,
      beginner: 0.85,
      intermediate: 0.75,
      advanced: 0.6,
    },
    {
      name: "Box Jumps",
      compound: true,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.7,
      effectiveness: 0.8,
      muscleActivation: 0.85,
      beginner: 0.7,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Donkey Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.4,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Single-Leg Calf Raises",
      compound: false,
      primaryLift: null,
      percentage: null,
      equipment: ["bodyweight"],
      category: "legs",
      difficulty: 0.5,
      effectiveness: 0.75,
      muscleActivation: 0.85,
      beginner: 0.8,
      intermediate: 0.85,
      advanced: 0.8,
    },
    {
      name: "Single-Leg Dumbbell Calf Raises",
      compound: false,
      primaryLift: "squat",
      percentage: 0.3,
      equipment: ["dumbbells"],
      category: "legs",
      difficulty: 0.6,
      effectiveness: 0.8,
      muscleActivation: 0.9,
      beginner: 0.75,
      intermediate: 0.85,
      advanced: 0.85,
    },
  ],
}

// AI-driven exercise selection algorithm
function selectExercisesWithAI(
  muscleGroups: string[],
  fitnessLevel: string,
  availableEquipment: string[],
  workoutDuration: number,
  workoutCategory = "", // "push", "pull", "legs", or "" for any
  userPreferences: any = {},
): any[] {
  // Get all exercises for the selected muscle groups
  let availableExercises: any[] = []

  // First, gather all exercises from the selected muscle groups
  for (const group of muscleGroups) {
    const groupExercises = exerciseDatabase[group as keyof typeof exerciseDatabase] || []
    availableExercises = [...availableExercises, ...groupExercises]
  }

  // Filter by available equipment
  availableExercises = availableExercises.filter((exercise) => {
    // For "full-gym" selection, all exercises are available
    if (availableEquipment.includes("full-gym")) {
      return true
    }

    // For bodyweight exercises, they should always be available
    if (exercise.equipment.includes("bodyweight")) {
      return true
    }

    // Check if ANY of the required equipment is available
    return exercise.equipment.some((eq) => availableEquipment.includes(eq))
  })

  // Filter by workout category if specified (push/pull/legs)
  if (workoutCategory) {
    availableExercises = availableExercises.filter((exercise) => {
      if (workoutCategory === "push" && exercise.category === "push") return true
      if (workoutCategory === "pull" && exercise.category === "pull") return true
      if (workoutCategory === "legs" && exercise.category === "legs") return true
      if (workoutCategory === "core" && exercise.category === "core") return true
      return false
    })
  }

  // Calculate AI scores for each exercise
  const scoredExercises = availableExercises.map((exercise) => {
    // Base score components
    let effectivenessScore = exercise.effectiveness * 2.0 // Weight effectiveness highly
    let difficultyScore = 0

    // Adjust difficulty score based on fitness level
    if (fitnessLevel === "beginner") {
      difficultyScore = (1 - exercise.difficulty) * 1.5 // Beginners prefer easier exercises
      effectivenessScore *= exercise.beginner // Effectiveness for beginners
    } else if (fitnessLevel === "intermediate") {
      difficultyScore = (1 - Math.abs(exercise.difficulty - 0.6)) * 1.2 // Intermediates prefer moderate difficulty
      effectivenessScore *= exercise.intermediate // Effectiveness for intermediates
    } else {
      // advanced
      difficultyScore = exercise.difficulty * 1.0 // Advanced users prefer challenging exercises
      effectivenessScore *= exercise.advanced // Effectiveness for advanced
    }

    // Equipment preference score - prefer exercises that use available equipment optimally
    const equipmentScore = exercise.equipment.some((eq) => availableEquipment.includes(eq)) ? 1.0 : 0.1

    // Compound movement bonus - compound exercises are generally more effective
    const compoundBonus = exercise.compound ? 0.5 : 0

    // Muscle activation score
    const activationScore = exercise.muscleActivation * 1.5

    // User preference adjustments
    let preferenceScore = 1.0
    if (userPreferences.favorCompound && exercise.compound) {
      preferenceScore += 0.5
    }
    if (userPreferences.favorIsolation && !exercise.compound) {
      preferenceScore += 0.5
    }

    // Calculate final score
    const totalScore =
      (effectivenessScore + difficultyScore + equipmentScore + compoundBonus + activationScore) * preferenceScore

    // Return exercise with its score
    return {
      ...exercise,
      aiScore: totalScore,
    }
  })

  // Sort exercises by score (highest first)
  scoredExercises.sort((a, b) => b.aiScore - a.aiScore)

  // Ensure variety by selecting a mix of compound and isolation exercises
  const selectedExercises = []
  const compoundExercises = scoredExercises.filter((ex) => ex.compound)
  const isolationExercises = scoredExercises.filter((ex) => !ex.compound)

  // Calculate how many exercises we need based on workout duration
  // Approximately 10-12 minutes per exercise
  const totalExercises = Math.max(4, Math.floor(workoutDuration / 10))

  // Aim for about 60% compound exercises and 40% isolation
  const targetCompoundCount = Math.ceil(totalExercises * 0.6)
  const targetIsolationCount = totalExercises - targetCompoundCount

  // Select compound exercises
  const selectedCompound = compoundExercises.slice(0, targetCompoundCount)

  // Select isolation exercises
  const selectedIsolation = isolationExercises.slice(0, targetIsolationCount)

  // Combine and return
  return [...selectedCompound, ...selectedIsolation]
}

// Function to create exercise parameters based on fitness level and exercise type
function createExerciseParameters(
  exercise: any,
  fitnessLevel: string,
  benchPress: LiftData,
  squat: LiftData,
  deadlift: LiftData,
  weightGoal: WeightGoalData,
): Exercise {
  // Determine sets, reps, and rest based on exercise type and fitness level
  let sets = 0
  let reps = ""
  let rest = ""

  // Adjust parameters based on weight goal
  const intensityModifier =
    weightGoal.type === "lose"
      ? 0.2
      : // Higher volume for weight loss
        weightGoal.type === "gain"
        ? -0.1
        : // Lower volume, higher weight for muscle gain
          0 // Neutral for maintenance

  if (exercise.compound) {
    // Compound exercises
    if (fitnessLevel === "beginner") {
      sets = 3
      reps = "8-12"
      rest = "90 sec"
    } else if (fitnessLevel === "intermediate") {
      sets = 4
      reps = "6-10"
      rest = "2 min"
    } else {
      // advanced
      sets = 5
      reps = "4-8"
      rest = "2-3 min"
    }

    // Adjust for weight goal
    if (weightGoal.type === "lose") {
      // For weight loss, increase reps slightly
      if (reps === "8-12") reps = "10-15"
      if (reps === "6-10") reps = "8-12"
      if (reps === "4-8") reps = "6-10"

      // Decrease rest slightly
      if (rest === "90 sec") rest = "75 sec"
      if (rest === "2 min") rest = "100 sec"
      if (rest === "2-3 min") rest = "2 min"
    } else if (weightGoal.type === "gain") {
      // For muscle gain, decrease reps slightly
      if (reps === "8-12") reps = "6-10"
      if (reps === "6-10") reps = "5-8"
      if (reps === "4-8") reps = "3-6"

      // Increase rest slightly
      if (rest === "90 sec") rest = "2 min"
      if (rest === "2 min") rest = "2-3 min"
      if (rest === "2-3 min") rest = "3 min"
    }
  } else {
    // Isolation exercises
    if (fitnessLevel === "beginner") {
      sets = 3
      reps = "10-15"
      rest = "60 sec"
    } else if (fitnessLevel === "intermediate") {
      sets = 3
      reps = "8-12"
      rest = "90 sec"
    } else {
      // advanced
      sets = 4
      reps = "8-12"
      rest = "90 sec"
    }

    // Adjust for weight goal
    if (weightGoal.type === "lose") {
      // For weight loss, increase reps
      if (reps === "10-15") reps = "12-20"
      if (reps === "8-12") reps = "12-15"

      // Decrease rest
      if (rest === "60 sec") rest = "45 sec"
      if (rest === "90 sec") rest = "60 sec"
    } else if (weightGoal.type === "gain") {
      // For muscle gain, adjust reps for hypertrophy
      if (reps === "10-15") reps = "8-12"
      if (reps === "8-12") reps = "8-10"

      // Increase rest slightly
      if (rest === "60 sec") rest = "75 sec"
      if (rest === "90 sec") rest = "2 min"
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

  return {
    name: exercise.name,
    sets,
    reps,
    rest,
    weight,
  }
}

// Main function to generate AI-driven workout plan
export function generateAIWorkoutPlan(
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
  workoutDuration: { value: number } = { value: 60 },
  workoutFrequency: { daysPerWeek: number; cycleLength: number } = { daysPerWeek: 4, cycleLength: 1 },
): WorkoutDay[] {
  // Create workout split based on selected type and muscle groups
  const workoutPlan: WorkoutDay[] = []

  // Ensure we have valid values for all parameters
  const safeSelectedMuscleGroups =
    selectedMuscleGroups.length > 0
      ? selectedMuscleGroups
      : ["chest", "back", "shoulders", "arms", "legs", "core", "glutes", "calves"]
  const safeFitnessLevel = fitnessLevel?.value || "intermediate"
  const safeFocusType = focusType?.value || "balanced"
  const safeEquipment = availableEquipment.length > 0 ? availableEquipment : ["bodyweight"]
  const safeDuration = workoutDuration?.value || 60
  const safeDaysPerWeek = workoutFrequency?.daysPerWeek || 4
  const safeCycleLength = workoutFrequency?.cycleLength || 1

  // Calculate total days in the cycle
  const totalDays = safeCycleLength * 7

  // Determine workout structure based on split type
  const splitType = workoutSplit?.value || "push-pull-legs"

  // Check if we need to adjust the split type
  const effectiveSplitType = splitType

  // If user selected push-pull-legs but has no leg muscle groups, switch to upper-lower
  if (splitType === "push-pull-legs" && !hasLegMuscleGroups(safeSelectedMuscleGroups)) {
    console.log("No leg muscle groups selected, adjusting split type")
    // We'll still use the push-pull-legs split function, but it will handle the absence of legs
  }

  // Create the workout plan based on the selected split
  switch (effectiveSplitType) {
    case "full-body":
      createAIFullBodySplit(
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
      createAIUpperLowerSplit(
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
      createAIPushPullLegsSplit(
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
      createAIBodyPartSplit(
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
      createAIPushPullLegsSplit(
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

// AI-driven full body split
function createAIFullBodySplit(
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
    const weekNumber = Math.floor(dayIndex / 7)
    const dayOfWeek = dayIndex % 7

    // Rotate muscle group focus based on day of week and week number
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

    // Create user preferences based on day of week to add variety
    const userPreferences = {
      favorCompound: dayOfWeek % 2 === 0, // Favor compound exercises on even days
      favorIsolation: dayOfWeek % 2 === 1, // Favor isolation exercises on odd days
    }

    // Use AI to select exercises
    const selectedExercises = selectExercisesWithAI(
      muscleGroupsToUse,
      fitnessLevel,
      availableEquipment,
      workoutDuration,
      "", // No specific category for full body
      userPreferences,
    )

    // Create workout with appropriate parameters
    const workout: Exercise[] = selectedExercises.map((exercise) =>
      createExerciseParameters(exercise, fitnessLevel, benchPress, squat, deadlift, weightGoal),
    )

    // Add the workout to the plan
    workoutPlan[dayIndex].exercises = workout
  }
}

// AI-driven upper/lower split
function createAIUpperLowerSplit(
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

    // If targeted focus, only use selected muscle groups
    const muscleGroupsToUse = focusType === "targeted" ? relevantSelectedGroups : baseGroups

    // Create user preferences based on week number to add variety
    const userPreferences = {
      favorCompound: weekNumber % 2 === 0, // Favor compound exercises on even weeks
      favorIsolation: weekNumber % 2 === 1, // Favor isolation exercises on odd weeks
    }

    // Use AI to select exercises
    const selectedExercises = selectExercisesWithAI(
      muscleGroupsToUse,
      fitnessLevel,
      availableEquipment,
      workoutDuration,
      isUpperDay ? "upper" : "lower", // Category for upper/lower
      userPreferences,
    )

    // Create workout with appropriate parameters
    const workout: Exercise[] = selectedExercises.map((exercise) =>
      createExerciseParameters(exercise, fitnessLevel, benchPress, squat, deadlift, weightGoal),
    )

    // Add the workout to the plan
    workoutPlan[i].exercises = workout
  }
}

// Add this function to check if any leg-related muscle groups are selected
function hasLegMuscleGroups(selectedMuscleGroups: string[]): boolean {
  const legMuscleGroups = ["legs", "glutes", "calves"]
  return selectedMuscleGroups.some((group) => legMuscleGroups.includes(group))
}

// Modify the createAIPushPullLegsSplit function to handle the case where no leg muscle groups are selected
function createAIPushPullLegsSplit(
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
  // Check if any leg muscle groups are selected
  const includeLegs = hasLegMuscleGroups(selectedMuscleGroups)

  // Determine the cycle pattern based on whether legs are included
  const cycleLength = includeLegs ? 3 : 2 // Push/Pull/Legs or just Push/Pull

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

      // Determine the day type based on the cycle pattern
      const cyclePosition = i % cycleLength

      if (cyclePosition === 0) {
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Push)`
      } else if (cyclePosition === 1) {
        workoutPlan[dayIndex].day = `Day ${dayIndex + 1} (Pull)`
      } else if (includeLegs) {
        // Only add leg days if leg muscle groups are selected
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

    // Get the appropriate muscle groups for this day
    let baseGroups: string[] = []
    let workoutCategory = ""

    if (isPushDay) {
      baseGroups = [...pushGroups, "arms"] // Include arms for triceps
      workoutCategory = "push"
    } else if (isPullDay) {
      baseGroups = [...pullGroups, "arms"] // Include arms for biceps
      workoutCategory = "pull"
    } else if (isLegsDay) {
      baseGroups = legsGroups
      workoutCategory = "legs"
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

    // If targeted focus, only use selected muscle groups
    const muscleGroupsToUse = focusType === "targeted" ? relevantSelectedGroups : baseGroups

    // Create user preferences based on week number to add variety
    const userPreferences = {
      favorCompound: i % 2 === 0, // Alternate between compound and isolation focus
      favorIsolation: i % 2 === 1,
    }

    // Use AI to select exercises
    const selectedExercises = selectExercisesWithAI(
      muscleGroupsToUse,
      fitnessLevel,
      availableEquipment,
      workoutDuration,
      workoutCategory,
      userPreferences,
    )

    // Create workout with appropriate parameters
    const workout: Exercise[] = selectedExercises.map((exercise) =>
      createExerciseParameters(exercise, fitnessLevel, benchPress, squat, deadlift, weightGoal),
    )

    // Add the workout to the plan
    workoutPlan[i].exercises = workout
  }
}

// AI-driven body part split
function createAIBodyPartSplit(
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

    // Create user preferences based on muscle groups
    const userPreferences = {
      favorCompound: dayGroups.includes("chest") || dayGroups.includes("back") || dayGroups.includes("legs"),
      favorIsolation: dayGroups.includes("arms") || dayGroups.includes("shoulders") || dayGroups.includes("calves"),
    }

    // Use AI to select exercises
    const selectedExercises = selectExercisesWithAI(
      dayGroups,
      fitnessLevel,
      availableEquipment,
      workoutDuration,
      "", // No specific category for body part split
      userPreferences,
    )

    // Create workout with appropriate parameters
    const workout: Exercise[] = selectedExercises.map((exercise) =>
      createExerciseParameters(exercise, fitnessLevel, benchPress, squat, deadlift, weightGoal),
    )

    // Add the workout to the plan
    workoutPlan[dayIndex].exercises = workout
  }
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
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

