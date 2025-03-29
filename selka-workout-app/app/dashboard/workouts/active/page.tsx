"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ChevronLeft, ChevronRight, Pause, Play, SkipForward, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Add these imports at the top
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Update to use the workout generator
import { generateWorkouts, getWorkoutsWithSets } from "@/components/generate-workouts"

// Inside the component, replace the mockWorkout definition with:
const mockWorkout = {
  title: "Upper Body",
  description: "Chest, shoulders, and triceps",
  exercises: [
    {
      name: "Bench Press",
      sets: [
        { weight: 60, reps: 12, completed: false },
        { weight: 70, reps: 10, completed: false },
        { weight: 80, reps: 8, completed: false },
        { weight: 70, reps: 10, completed: false },
      ],
      restTime: 90, // seconds
    },
    {
      name: "Overhead Press",
      sets: [
        { weight: 40, reps: 12, completed: false },
        { weight: 45, reps: 10, completed: false },
        { weight: 50, reps: 8, completed: false },
        { weight: 45, reps: 10, completed: false },
      ],
      restTime: 90, // seconds
    },
    {
      name: "Tricep Extensions",
      sets: [
        { weight: 20, reps: 15, completed: false },
        { weight: 25, reps: 12, completed: false },
        { weight: 25, reps: 12, completed: false },
      ],
      restTime: 60, // seconds
    },
    {
      name: "Lateral Raises",
      sets: [
        { weight: 10, reps: 15, completed: false },
        { weight: 10, reps: 15, completed: false },
        { weight: 10, reps: 15, completed: false },
      ],
      restTime: 60, // seconds
    },
    {
      name: "Chest Flyes",
      sets: [
        { weight: 15, reps: 15, completed: false },
        { weight: 15, reps: 15, completed: false },
        { weight: 15, reps: 15, completed: false },
      ],
      restTime: 60, // seconds
    },
  ],
}

export default function ActiveWorkoutPage() {
  const router = useRouter()
  const [workout, setWorkout] = useState<any>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [workoutComplete, setWorkoutComplete] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Add these state variables inside the component
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState<string>("weight")
  const [weightFeedback, setWeightFeedback] = useState<number>(0)
  const [repsFeedback, setRepsFeedback] = useState<number>(0)
  const [restFeedback, setRestFeedback] = useState<number>(0)

  // Update the useEffect that loads the workout
  useEffect(() => {
    // Load user profile and generate workout
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      const userProfile = JSON.parse(profile)

      // Generate workouts based on user profile
      const workouts = generateWorkouts(userProfile)
      const workoutsWithSets = getWorkoutsWithSets(workouts, userProfile)

      // Use the first workout for now
      setWorkout(workoutsWithSets[0])
    }
  }, [])

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/beep.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isResting && !isPaused && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            // Play sound when timer ends
            if (audioRef.current) {
              audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
            }
            clearInterval(interval)
            setIsResting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isResting, isPaused, restTimer])

  // Calculate overall progress
  const calculateProgress = () => {
    const totalSets = workout.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0)
    const completedSets = workout.exercises.reduce(
      (acc, exercise) => acc + exercise.sets.filter((set) => set.completed).length,
      0,
    )

    return (completedSets / totalSets) * 100
  }

  // Replace the handleCompleteSet function with this updated version
  const handleCompleteSet = () => {
    const updatedWorkout = { ...workout }
    const currentExercise = updatedWorkout.exercises[currentExerciseIndex]

    // Mark current set as completed
    currentExercise.sets[currentSetIndex].completed = true

    setWorkout(updatedWorkout)

    // Show feedback dialog
    setWeightFeedback(currentExercise.sets[currentSetIndex].weight)
    setRepsFeedback(currentExercise.sets[currentSetIndex].reps)
    setRestFeedback(currentExercise.restTime)
    setShowFeedback(true)
  }

  // Add this function to handle feedback submission
  const handleFeedbackSubmit = () => {
    setShowFeedback(false)

    // Apply feedback to current exercise
    const updatedWorkout = { ...workout }
    const currentExercise = updatedWorkout.exercises[currentExerciseIndex]

    // Adjust future sets based on feedback
    if (feedbackType === "weight") {
      // Adjust remaining sets' weight
      for (let i = currentSetIndex + 1; i < currentExercise.sets.length; i++) {
        currentExercise.sets[i].weight = weightFeedback
      }
    } else if (feedbackType === "reps") {
      // Adjust remaining sets' reps
      for (let i = currentSetIndex + 1; i < currentExercise.sets.length; i++) {
        currentExercise.sets[i].reps = repsFeedback
      }
    } else if (feedbackType === "rest") {
      // Adjust rest time for this exercise
      currentExercise.restTime = restFeedback
    }

    setWorkout(updatedWorkout)

    // Continue with workout flow
    continueWorkout()
  }

  // Add this function to continue the workout after feedback
  const continueWorkout = () => {
    // Check if there are more sets in the current exercise
    if (currentSetIndex < workout.exercises[currentExerciseIndex].sets.length - 1) {
      // Move to next set and start rest timer
      setCurrentSetIndex(currentSetIndex + 1)
      setRestTimer(workout.exercises[currentExerciseIndex].restTime)
      setIsResting(true)
    } else {
      // Check if there are more exercises
      if (currentExerciseIndex < workout.exercises.length - 1) {
        // Move to next exercise, reset set index, and start rest timer
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setCurrentSetIndex(0)
        setRestTimer(workout.exercises[currentExerciseIndex + 1].restTime)
        setIsResting(true)
      } else {
        // Workout complete
        completeWorkout()
      }
    }
  }

  // Add this function to handle workout completion
  const completeWorkout = () => {
    // Mark workout as completed
    const completedWorkout = { ...workout, completed: true }

    // Save completed workout to localStorage
    const completedWorkouts = JSON.parse(localStorage.getItem("completedWorkouts") || "[]")
    completedWorkouts.push({
      ...completedWorkout,
      completedDate: new Date().toISOString(),
    })
    localStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts))

    // Update workout stats
    const stats = JSON.parse(localStorage.getItem("workoutStats") || "{}")
    stats.totalCompleted = (stats.totalCompleted || 0) + 1
    stats.lastWorkoutDate = new Date().toISOString()

    // Calculate total workout time (rough estimate)
    const exerciseCount = completedWorkout.exercises.length
    const setCount = completedWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
    const avgTimePerSet = 45 // seconds
    const totalTime = (setCount * avgTimePerSet) / 60 // in minutes

    stats.totalTime = (stats.totalTime || 0) + totalTime
    localStorage.setItem("workoutStats", JSON.stringify(stats))

    setWorkoutComplete(true)
  }

  const handleSkipRest = () => {
    setRestTimer(0)
    setIsResting(false)
  }

  const handleTogglePause = () => {
    setIsPaused(!isPaused)
  }

  const handleFinishWorkout = () => {
    router.push("/dashboard")
  }

  // Add a loading state while workout is being generated
  if (!workout) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Workout</CardTitle>
            <CardDescription>Generating your personalized workout...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentExercise = workout.exercises[currentExerciseIndex]
  const currentSet = currentExercise?.sets[currentSetIndex]
  const progress = calculateProgress()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard/workouts")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Workouts
        </Button>
        <h1 className="text-xl font-bold">{workout.title}</h1>
        <div className="w-[100px]"></div> {/* Spacer for alignment */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{workoutComplete ? "Workout Complete!" : workout.title}</CardTitle>
              <CardDescription>{workout.description}</CardDescription>
            </div>
            <div className="text-2xl font-bold">
              {currentExerciseIndex + 1}/{workout.exercises.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          {workoutComplete ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Great job!</h2>
              <p className="text-center text-muted-foreground">
                You've completed your workout. Your progress has been saved.
              </p>
              <Button onClick={handleFinishWorkout} className="mt-4">
                Return to Dashboard
              </Button>
            </div>
          ) : isResting ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <h2 className="text-2xl font-bold">Rest Time</h2>
              <div className="text-4xl font-bold">
                {Math.floor(restTimer / 60)}:{restTimer % 60 < 10 ? `0${restTimer % 60}` : restTimer % 60}
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" onClick={handleTogglePause}>
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleSkipRest}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Next: {currentExercise.name} - Set {currentSetIndex + 1}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <h2 className="text-2xl font-bold">{currentExercise.name}</h2>
                <p className="text-muted-foreground">
                  Set {currentSetIndex + 1} of {currentExercise.sets.length}
                </p>
              </div>

              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-2xl font-bold">{currentSet.weight} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Reps</p>
                  <p className="text-2xl font-bold">{currentSet.reps}</p>
                </div>
              </div>

              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">Current Exercise</TabsTrigger>
                  <TabsTrigger value="all">All Exercises</TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="space-y-4">
                  <div className="space-y-2 mt-4">
                    {currentExercise.sets.map((set, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex justify-between items-center p-3 rounded-md",
                          index === currentSetIndex
                            ? "bg-primary/10 border border-primary/20"
                            : set.completed
                              ? "bg-green-100 dark:bg-green-900/20"
                              : "bg-muted",
                        )}
                      >
                        <div>
                          <span className="font-medium">Set {index + 1}:</span> {set.weight} kg × {set.reps} reps
                        </div>
                        {set.completed && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="all">
                  <div className="space-y-4 mt-4">
                    {workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{exercise.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            {exercise.sets.filter((s) => s.completed).length}/{exercise.sets.length} sets
                          </span>
                        </div>
                        <Progress
                          value={(exercise.sets.filter((s) => s.completed).length / exercise.sets.length) * 100}
                          className="h-1"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        {!workoutComplete && !isResting && (
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentSetIndex > 0) {
                    setCurrentSetIndex(currentSetIndex - 1)
                  } else if (currentExerciseIndex > 0) {
                    setCurrentExerciseIndex(currentExerciseIndex - 1)
                    setCurrentSetIndex(workout.exercises[currentExerciseIndex - 1].sets.length - 1)
                  }
                }}
                disabled={currentExerciseIndex === 0 && currentSetIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (currentSetIndex < currentExercise.sets.length - 1) {
                    setCurrentSetIndex(currentSetIndex + 1)
                  } else if (currentExerciseIndex < workout.exercises.length - 1) {
                    setCurrentExerciseIndex(currentExerciseIndex + 1)
                    setCurrentSetIndex(0)
                  }
                }}
                disabled={
                  currentExerciseIndex === workout.exercises.length - 1 &&
                  currentSetIndex === currentExercise.sets.length - 1
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <Button onClick={handleCompleteSet}>Complete Set</Button>
          </CardFooter>
        )}
      </Card>
      {showFeedback && (
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>How was that set?</DialogTitle>
              <DialogDescription>Provide feedback to adjust your workout</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weight" id="weight" />
                  <Label htmlFor="weight">Weight</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reps" id="reps" />
                  <Label htmlFor="reps">Reps</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rest" id="rest" />
                  <Label htmlFor="rest">Rest Time</Label>
                </div>
              </RadioGroup>

              {feedbackType === "weight" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Weight: {weightFeedback} kg</Label>
                    <span className="text-sm text-muted-foreground">
                      {weightFeedback > currentSet.weight
                        ? "Too light"
                        : weightFeedback < currentSet.weight
                          ? "Too heavy"
                          : "Just right"}
                    </span>
                  </div>
                  <Slider
                    value={[weightFeedback]}
                    min={Math.max(5, currentSet.weight - 20)}
                    max={currentSet.weight + 20}
                    step={2.5}
                    onValueChange={(value) => setWeightFeedback(value[0])}
                  />
                </div>
              )}

              {feedbackType === "reps" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Reps: {repsFeedback}</Label>
                    <span className="text-sm text-muted-foreground">
                      {repsFeedback > currentSet.reps
                        ? "Too few"
                        : repsFeedback < currentSet.reps
                          ? "Too many"
                          : "Just right"}
                    </span>
                  </div>
                  <Slider
                    value={[repsFeedback]}
                    min={Math.max(1, currentSet.reps - 6)}
                    max={currentSet.reps + 6}
                    step={1}
                    onValueChange={(value) => setRepsFeedback(value[0])}
                  />
                </div>
              )}

              {feedbackType === "rest" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Rest Time: {restFeedback} seconds</Label>
                    <span className="text-sm text-muted-foreground">
                      {restFeedback > currentExercise.restTime
                        ? "Too short"
                        : restFeedback < currentExercise.restTime
                          ? "Too long"
                          : "Just right"}
                    </span>
                  </div>
                  <Slider
                    value={[restFeedback]}
                    min={30}
                    max={180}
                    step={15}
                    onValueChange={(value) => setRestFeedback(value[0])}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowFeedback(false)
                  continueWorkout()
                }}
              >
                Skip
              </Button>
              <Button onClick={handleFeedbackSubmit}>Apply & Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

