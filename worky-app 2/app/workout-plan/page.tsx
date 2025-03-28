"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Dumbbell, PlayCircle, FileText, RotateCcw, Clock, Calendar } from "lucide-react"
import { WorkoutTimer } from "@/components/workout-timer"
import {
  adjustRestTime,
  formatRestTime,
  parseRestTime,
  adjustWeight,
  parseWeight,
  formatWeight,
} from "@/lib/workout-adjuster"
import { generateAIWorkoutPlan } from "@/lib/ai-workout-generator" // Updated import

type WorkoutDay = {
  day: string
  exercises: {
    name: string
    sets: number
    reps: string
    rest: string
    weight?: string
  }[]
}

type ExerciseFeedback = {
  exerciseName: string
  difficulty: "too-easy" | "just-right" | "too-hard"
  restTime: number
  date: string
}

type SetFeedback = {
  type: "weight" | "rest" | "difficulty"
  value: "too-light" | "too-heavy" | "just-right" | "too-short" | "too-long" | "too-easy" | "too-hard"
  exerciseName: string
  date: string
}

// Add this helper function at the top of the component (before the useState declarations)
function safelyParseJSON(jsonString: string | null, defaultValue: any) {
  if (!jsonString) return defaultValue
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    return defaultValue
  }
}

// Add this function to estimate the total workout time for a day
const estimateTotalWorkoutTime = (exercises: any[]): number => {
  if (!exercises || exercises.length === 0 || exercises[0].name === "Rest Day") {
    return 0
  }

  let totalMinutes = 0

  // Add 5 minutes for warm-up
  totalMinutes += 5

  // Calculate time for each exercise
  exercises.forEach((exercise) => {
    // Skip rest days
    if (exercise.name === "Rest Day") return

    // Estimate time per set (in minutes)
    const timePerRep = 4 / 60 // 4 seconds per rep

    // Parse reps (handle ranges like "8-12")
    let avgReps = 0
    if (exercise.reps.includes("-")) {
      const [min, max] = exercise.reps.split("-").map(Number)
      avgReps = (min + max) / 2
    } else if (exercise.reps !== "-") {
      avgReps = Number.parseInt(exercise.reps, 10)
    }

    // Parse rest time (convert "90 sec", "2 min", etc. to minutes)
    let restMinutes = 0
    if (exercise.rest.includes("min")) {
      if (exercise.rest.includes("-")) {
        // Handle ranges like "2-3 min"
        const parts = exercise.rest.replace(" min", "").split("-")
        const min = Number.parseFloat(parts[0])
        const max = Number.parseFloat(parts[1])
        restMinutes = (min + max) / 2
      } else {
        restMinutes = Number.parseFloat(exercise.rest.replace(" min", ""))
      }
    } else if (exercise.rest !== "-") {
      restMinutes = Number.parseInt(exercise.rest.replace(" sec", ""), 10) / 60
    }

    // Add setup time between exercises (30 seconds per set)
    const setupTimePerSet = 30 / 60 // 30 seconds in minutes

    // Calculate time for this exercise: (time per set + rest + setup) * sets - rest after last set
    const timePerSet = avgReps * timePerRep + setupTimePerSet
    const exerciseTime = (timePerSet + restMinutes) * exercise.sets - restMinutes

    totalMinutes += exerciseTime
  })

  // Add 5 minutes for cool-down
  totalMinutes += 5

  return Math.ceil(totalMinutes)
}

export default function WorkoutPlanPage() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeDay, setActiveDay] = useState("day1")
  const [mode, setMode] = useState<"view" | "workout">("view")
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseFeedback, setExerciseFeedback] = useState<ExerciseFeedback[]>([])
  const [setFeedback, setSetFeedback] = useState<SetFeedback[]>([])
  const [currentWeek, setCurrentWeek] = useState(0)
  const [totalWeeks, setTotalWeeks] = useState(1)
  const [hasWorkoutPlan, setHasWorkoutPlan] = useState(false)

  const [userData, setUserData] = useState({
    height: { value: 0, display: "" },
    weight: { value: 0, display: "" },
    age: { value: 0 },
    fitnessLevel: { value: "" },
    workoutSplit: { value: "" },
    benchPress: { value: 0, display: "" },
    squat: { value: 0, display: "" },
    deadlift: { value: 0, display: "" },
    weightGoal: { value: 0, display: "", type: "" },
    timeFrame: { value: 0 },
    muscleGroups: [] as string[],
    focusType: { value: "balanced" },
    workoutFrequency: { daysPerWeek: 4, cycleLength: 1 },
  })

  // Add this function to the WorkoutPlanPage component
  const resetWorkoutPlan = () => {
    // Remove the saved workout plan from localStorage
    localStorage.removeItem("worky-workout-plan")

    // Reload the page to regenerate the workout plan
    window.location.reload()
  }

  // Update the useEffect hook to use the AI workout generator
  useEffect(() => {
    // Load all user data from localStorage
    try {
      // Set default values for all required data
      const defaultHeight = { value: 170, display: "170 cm" }
      const defaultWeight = { value: 70, display: "70 kg" }
      const defaultAge = { value: 30 }
      const defaultFitnessLevel = { value: "intermediate" }
      const defaultWorkoutSplit = { value: "push-pull-legs" }
      const defaultBenchPress = { value: 0, display: "0 kg" }
      const defaultSquat = { value: 0, display: "0 kg" }
      const defaultDeadlift = { value: 0, display: "0 kg" }
      const defaultWeightGoal = { value: 0, display: "0 kg", type: "maintain" }
      const defaultTimeFrame = { value: 12 }
      const defaultFocusType = { value: "balanced" }
      const defaultEquipment = ["bodyweight"]
      const defaultWorkoutDuration = { value: 60 }
      const defaultWorkoutFrequency = { daysPerWeek: 4, cycleLength: 1 }

      // Safely parse localStorage items with fallbacks to defaults
      const height = safelyParseJSON(localStorage.getItem("worky-height"), defaultHeight)
      const weight = safelyParseJSON(localStorage.getItem("worky-weight"), defaultWeight)
      const age = safelyParseJSON(localStorage.getItem("worky-age"), defaultAge)
      const fitnessLevel = safelyParseJSON(localStorage.getItem("worky-fitness-level"), defaultFitnessLevel)
      const workoutSplit = safelyParseJSON(localStorage.getItem("worky-workout-split"), defaultWorkoutSplit)
      const benchPress = safelyParseJSON(localStorage.getItem("worky-bench-press"), defaultBenchPress)
      const squat = safelyParseJSON(localStorage.getItem("worky-squat"), defaultSquat)
      const deadlift = safelyParseJSON(localStorage.getItem("worky-deadlift"), defaultDeadlift)
      const weightGoal = safelyParseJSON(localStorage.getItem("worky-weight-goal"), defaultWeightGoal)
      const timeFrame = safelyParseJSON(localStorage.getItem("worky-time-frame"), defaultTimeFrame)
      const muscleGroups = safelyParseJSON(localStorage.getItem("worky-muscle-groups"), [])
      const focusType = safelyParseJSON(localStorage.getItem("worky-focus-type"), defaultFocusType)
      const equipment = safelyParseJSON(localStorage.getItem("worky-equipment"), defaultEquipment)
      const workoutDuration = safelyParseJSON(localStorage.getItem("worky-workout-duration"), defaultWorkoutDuration)
      const workoutFrequency = safelyParseJSON(localStorage.getItem("worky-workout-frequency"), defaultWorkoutFrequency)

      // Load any saved exercise feedback from localStorage
      const savedFeedback = safelyParseJSON(localStorage.getItem("worky-exercise-feedback"), [])
      const savedSetFeedback = safelyParseJSON(localStorage.getItem("worky-set-feedback"), [])

      setExerciseFeedback(savedFeedback)
      setSetFeedback(savedSetFeedback)
      setTotalWeeks(workoutFrequency.cycleLength)

      setUserData({
        height,
        weight,
        age,
        fitnessLevel,
        workoutSplit,
        benchPress,
        squat,
        deadlift,
        weightGoal,
        timeFrame,
        muscleGroups,
        focusType,
        workoutFrequency,
      })

      // Load any saved workout plan with adjusted weights/rest times
      const savedPlan = safelyParseJSON(localStorage.getItem("worky-workout-plan"), null)

      // Only generate a new plan if one doesn't exist in localStorage
      // Check if we need to regenerate the plan due to changed inputs
      const needsRegeneration = savedPlan && localStorage.getItem("worky-inputs-changed") === "true"

      if (savedPlan && !needsRegeneration) {
        setWorkoutPlan(savedPlan)
        setHasWorkoutPlan(true)
        // Store that user has a workout plan
        localStorage.setItem("worky-has-plan", "true")
      } else {
        // Generate workout plan based on user data using the AI generator
        const plan = generateAIWorkoutPlan(
          height,
          weight,
          age,
          fitnessLevel,
          workoutSplit,
          benchPress,
          squat,
          deadlift,
          weightGoal,
          timeFrame,
          muscleGroups,
          focusType,
          equipment,
          workoutDuration,
          workoutFrequency,
        )
        setWorkoutPlan(plan)
        setHasWorkoutPlan(true)
        // Save the newly generated plan to localStorage
        localStorage.setItem("worky-workout-plan", JSON.stringify(plan))
        // Store that user has a workout plan
        localStorage.setItem("worky-has-plan", "true")
        // Reset the inputs changed flag
        localStorage.removeItem("worky-inputs-changed")
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle exercise feedback and adjust rest times
  const handleExerciseFeedback = (feedback: string) => {
    const currentDayIndex = Number.parseInt(activeDay.replace("day", "")) - 1
    const currentExercise = workoutPlan[currentDayIndex].exercises[currentExerciseIndex]

    // Record feedback
    const newFeedback: ExerciseFeedback = {
      exerciseName: currentExercise.name,
      difficulty: feedback as "too-easy" | "just-right" | "too-hard",
      restTime: parseRestTime(currentExercise.rest),
      date: new Date().toISOString(),
    }

    // Get past feedback for this exercise
    const exerciseHistory = exerciseFeedback.filter((item) => item.exerciseName === currentExercise.name)

    // Adjust rest time based on feedback
    const currentRestTime = parseRestTime(currentExercise.rest)
    const newRestTime = adjustRestTime(currentRestTime, newFeedback.difficulty, [...exerciseHistory, ...setFeedback])

    // Update the workout plan with the new rest time
    const updatedPlan = [...workoutPlan]
    updatedPlan[currentDayIndex].exercises[currentExerciseIndex].rest = formatRestTime(newRestTime)
    setWorkoutPlan(updatedPlan)
    localStorage.setItem("worky-workout-plan", JSON.stringify(updatedPlan))

    // Save feedback
    const updatedFeedback = [...exerciseFeedback, newFeedback]
    setExerciseFeedback(updatedFeedback)
    localStorage.setItem("worky-exercise-feedback", JSON.stringify(updatedFeedback))
  }

  // Handle per-set feedback
  const handleSetFeedback = (feedback: { type: string; value: string }) => {
    const currentDayIndex = Number.parseInt(activeDay.replace("day", "")) - 1
    const currentExercise = workoutPlan[currentDayIndex].exercises[currentExerciseIndex]

    // Record feedback
    const newFeedback: SetFeedback = {
      exerciseName: currentExercise.name,
      type: feedback.type as "weight" | "rest" | "difficulty",
      value: feedback.value as any,
      date: new Date().toISOString(),
    }

    // Get past feedback for this exercise
    const exerciseSetHistory = setFeedback.filter(
      (item) => item.exerciseName === currentExercise.name && item.type === feedback.type,
    )

    // Update the workout plan based on feedback type
    const updatedPlan = [...workoutPlan]

    if (feedback.type === "weight" && currentExercise.weight) {
      // Adjust weight based on feedback
      const currentWeight = parseWeight(currentExercise.weight)
      const newWeight = adjustWeight(
        currentWeight,
        feedback.value as "too-light" | "too-heavy" | "just-right",
        exerciseSetHistory,
      )

      // Update weight for this exercise in all workout days
      workoutPlan.forEach((day, dayIndex) => {
        day.exercises.forEach((ex, exIndex) => {
          if (ex.name === currentExercise.name && ex.weight) {
            updatedPlan[dayIndex].exercises[exIndex].weight = formatWeight(newWeight)
          }
        })
      })
    } else if (feedback.type === "rest" || feedback.type === "difficulty") {
      // Adjust rest time based on feedback
      const currentRestTime = parseRestTime(currentExercise.rest)
      const newRestTime = adjustRestTime(currentRestTime, feedback.value as any, [
        ...exerciseSetHistory,
        ...exerciseFeedback,
      ])

      // Update rest time for this exercise in all workout days
      workoutPlan.forEach((day, dayIndex) => {
        day.exercises.forEach((ex, exIndex) => {
          if (ex.name === currentExercise.name) {
            updatedPlan[dayIndex].exercises[exIndex].rest = formatRestTime(newRestTime)
          }
        })
      })
    }

    setWorkoutPlan(updatedPlan)
    localStorage.setItem("worky-workout-plan", JSON.stringify(updatedPlan))

    // Save feedback
    const updatedFeedback = [...setFeedback, newFeedback]
    setSetFeedback(updatedFeedback)
    localStorage.setItem("worky-set-feedback", JSON.stringify(updatedFeedback))
  }

  // Handle moving to the next exercise
  const handleNextExercise = () => {
    const currentDayIndex = Number.parseInt(activeDay.replace("day", "")) - 1

    if (currentExerciseIndex < workoutPlan[currentDayIndex].exercises.length - 1) {
      // Move to the next exercise
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    } else {
      // End of workout
      setMode("view")
      setCurrentExerciseIndex(0)

      // Show completion message
      alert("Congratulations! You've completed today's workout.")
    }
  }

  // Start a workout
  const startWorkout = () => {
    setMode("workout")
    setCurrentExerciseIndex(0)
  }

  // Change week
  const changeWeek = (weekIndex: number) => {
    setCurrentWeek(weekIndex)
    // Set active day to the first day of the selected week
    setActiveDay(`day${weekIndex * 7 + 1}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Dumbbell className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-lg">Generating your personalized workout plan...</p>
        </div>
      </div>
    )
  }

  // Get the current day's exercises
  const currentDayIndex = Number.parseInt(activeDay.replace("day", "")) - 1
  const currentDayExercises = workoutPlan[currentDayIndex]?.exercises || []
  const currentExercise = currentDayExercises[currentExerciseIndex] || null

  // Get days for the current week
  const daysInWeek = 7
  const startDayIndex = currentWeek * daysInWeek
  const endDayIndex = Math.min(startDayIndex + daysInWeek, workoutPlan.length)
  const currentWeekDays = workoutPlan.slice(startDayIndex, endDayIndex)

  return (
    <div className="container max-w-4xl py-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href="/nutrition">
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="h-4 w-4" />
              Nutrition Plan
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-1" onClick={resetWorkoutPlan}>
            <RotateCcw className="h-4 w-4" />
            Reset Plan
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Download Plan
          </Button>
        </div>
      </div>

      {mode === "view" ? (
        <Card className="border-none shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Your Personalized Workout Plan</CardTitle>
            <CardDescription>
              {totalWeeks > 1 ? `${totalWeeks}-week cycle` : "Weekly"} plan with {userData.workoutFrequency.daysPerWeek}{" "}
              workout days per week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium mb-2">Your Details</h3>
                <p className="text-sm text-muted-foreground">
                  Height: {userData.height.display} | Weight: {userData.weight.display} | Age: {userData.age.value}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Your Goals</h3>
                <p className="text-sm text-muted-foreground">
                  {userData.weightGoal.type === "maintain"
                    ? "Maintain current weight"
                    : userData.weightGoal.type === "lose"
                      ? `Lose weight to ${userData.weightGoal.display}`
                      : `Gain weight to ${userData.weightGoal.display}`}{" "}
                  | Time Frame: {userData.timeFrame.value} weeks
                </p>
              </div>
            </div>

            {totalWeeks > 1 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Workout Cycle</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {Array.from({ length: totalWeeks }).map((_, index) => (
                    <Button
                      key={index}
                      variant={currentWeek === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => changeWeek(index)}
                      className="transition-all duration-300"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Week {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue={`day${startDayIndex + 1}`} onValueChange={setActiveDay}>
              <TabsList className="grid grid-cols-7 mb-6">
                {currentWeekDays.map((day, index) => (
                  <TabsTrigger key={index} value={`day${startDayIndex + index + 1}`}>
                    {day.day.includes("Day") ? `Day ${index + 1}` : day.day}
                  </TabsTrigger>
                ))}
              </TabsList>

              {currentWeekDays.map((day, index) => (
                <TabsContent key={index} value={`day${startDayIndex + index + 1}`} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{day.day}</h3>
                    <div className="flex items-center gap-4">
                      {!day.exercises[0]?.name.includes("Rest") && (
                        <>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>~{estimateTotalWorkoutTime(day.exercises)} min</span>
                          </div>
                          <Button
                            onClick={startWorkout}
                            className="bg-green-600 hover:bg-green-700 transition-colors duration-300"
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Start Workout
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {day.exercises[0]?.name.includes("Rest") ? (
                    <div className="p-8 text-center">
                      <p className="text-lg font-medium text-muted-foreground">Rest Day</p>
                      <p className="text-sm">Take time to recover and prepare for your next workout</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 bg-muted p-3 font-medium">
                        <div className="col-span-4">Exercise</div>
                        <div className="col-span-2 text-center">Sets</div>
                        <div className="col-span-2 text-center">Reps</div>
                        <div className="col-span-2 text-center">Weight</div>
                        <div className="col-span-2 text-center">Rest</div>
                      </div>

                      {day.exercises.map((exercise, i) => (
                        <div key={i} className="grid grid-cols-12 p-3 border-t items-center">
                          <div className="col-span-4">{exercise.name}</div>
                          <div className="col-span-2 text-center">{exercise.sets}</div>
                          <div className="col-span-2 text-center">{exercise.reps}</div>
                          <div className="col-span-2 text-center">{exercise.weight || "—"}</div>
                          <div className="col-span-2 text-center">{exercise.rest}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{workoutPlan[currentDayIndex].day} Workout</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode("view")}
              className="transition-colors duration-300"
            >
              Exit Workout
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>
                {currentExerciseIndex + 1} of {currentDayExercises.length} exercises
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((currentExerciseIndex + 1) / currentDayExercises.length) * 100}%` }}
              />
            </div>
          </div>

          {currentExercise && (
            <WorkoutTimer
              exercise={currentExercise}
              onComplete={handleNextExercise}
              onFeedback={handleExerciseFeedback}
              onSetFeedback={handleSetFeedback}
            />
          )}

          <div className="mt-4">
            <h3 className="font-medium mb-2">Coming Up Next</h3>
            {currentExerciseIndex < currentDayExercises.length - 1 ? (
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">{currentDayExercises[currentExerciseIndex + 1].name}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {currentDayExercises[currentExerciseIndex + 1].sets} sets ×{" "}
                    {currentDayExercises[currentExerciseIndex + 1].reps} reps
                  </span>
                  {currentDayExercises[currentExerciseIndex + 1].weight && (
                    <span>{currentDayExercises[currentExerciseIndex + 1].weight}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">Workout Complete!</p>
                <p className="text-sm text-muted-foreground">You've finished all exercises for today</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

