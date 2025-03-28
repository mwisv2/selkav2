"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Clock,
  Weight,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

type WorkoutTimerProps = {
  exercise: {
    name: string
    sets: number
    reps: string
    rest: string
    weight?: string
  }
  onComplete: () => void
  onFeedback: (feedback: string) => void
  onSetFeedback: (feedback: SetFeedback) => void
}

type SetFeedback = {
  type: "weight" | "rest" | "difficulty"
  value: "too-light" | "too-heavy" | "just-right" | "too-short" | "too-long" | "too-easy" | "too-hard"
}

export function WorkoutTimer({ exercise, onComplete, onFeedback, onSetFeedback }: WorkoutTimerProps) {
  const [currentSet, setCurrentSet] = useState(1)
  const [timerState, setTimerState] = useState<"inactive" | "active" | "resting" | "complete">("inactive")
  const [timeLeft, setTimeLeft] = useState(0)
  const [sound, setSound] = useState(true)
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // Parse rest time from string (e.g. "90 sec" or "2 min") to seconds
  const parseRestTime = (restTime: string): number => {
    if (restTime.includes("min")) {
      if (restTime.includes("sec")) {
        // Format like "2 min 30 sec"
        const parts = restTime.split(" ")
        const minutes = Number.parseInt(parts[0])
        const seconds = Number.parseInt(parts[2])
        return minutes * 60 + seconds
      } else {
        // Format like "2 min"
        const minutes = Number.parseInt(restTime)
        return minutes * 60
      }
    } else {
      // Format like "90 sec"
      return Number.parseInt(restTime)
    }
  }

  // Start a set
  const startSet = () => {
    setTimerState("active")
    setSeconds(0)
    setIsTimerRunning(true)
  }

  // Complete the current set
  const completeSet = () => {
    setIsTimerRunning(false)

    if (currentSet < exercise.sets) {
      // More sets to go for this exercise
      // Start rest period immediately with feedback options
      const restSeconds = parseRestTime(exercise.rest)
      setTimeLeft(restSeconds)
      setTimerState("resting")
      setShowFeedbackOptions(true)

      // Start the countdown timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Rest period completed
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }

            // Play sound notification
            if (sound && audioRef.current) {
              audioRef.current.play()
            }

            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      // Last set completed - show exercise complete state
      setTimerState("complete")
      setShowFeedbackOptions(true)
      setFeedbackSubmitted(false)
    }
  }

  // Start next set after rest
  const startNextSet = () => {
    setCurrentSet((prev) => prev + 1)
    setTimerState("inactive")
    setShowFeedbackOptions(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  // Reset timer
  const resetTimer = () => {
    setCurrentSet(1)
    setTimerState("inactive")
    setTimeLeft(0)
    setIsTimerRunning(false)
    setShowFeedbackOptions(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  // Handle set feedback
  const handleSetFeedback = (type: "weight" | "rest" | "difficulty", value: string) => {
    onSetFeedback({
      type,
      value: value as any,
    })

    // Hide feedback options after submitting
    setShowFeedbackOptions(false)
  }

  // Handle exercise feedback
  const handleExerciseFeedback = (feedback: string) => {
    onFeedback(feedback)
    setFeedbackSubmitted(true)

    // After feedback is submitted, move to next exercise
    setTimeout(() => {
      onComplete()
    }, 500)
  }

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Toggle sound
  const toggleSound = () => {
    setSound((prev) => !prev)
  }

  // Effect for the set timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Effect to handle rest timer completion
  useEffect(() => {
    if (timerState === "resting" && timeLeft === 0) {
      // Rest is complete, but user needs to manually start next set
    }
  }, [timerState, timeLeft])

  // Add this effect to reset timer state when exercise changes
  useEffect(() => {
    // Reset timer state when exercise changes
    setCurrentSet(1)
    setTimerState("inactive")
    setTimeLeft(0)
    setIsTimerRunning(false)
    setShowFeedbackOptions(false)
    setSeconds(0)
    setFeedbackSubmitted(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [exercise.name]) // Dependency on exercise.name ensures reset when exercise changes

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold">{exercise.name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {exercise.sets} sets × {exercise.reps} reps
            </p>
            {exercise.weight && (
              <p className="text-sm font-medium flex items-center">
                <Weight className="h-3 w-3 mr-1" />
                {exercise.weight}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Current Set</span>
            <span className="text-3xl font-bold text-primary">{currentSet}</span>
            <span className="text-xs text-muted-foreground">of {exercise.sets}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg col-span-2">
            <span className="text-sm font-medium text-muted-foreground">
              {timerState === "resting" ? "Rest Time" : timerState === "active" ? "Set Timer" : "Target Reps"}
            </span>
            <span className="text-3xl font-bold text-primary">
              {timerState === "resting"
                ? formatTime(timeLeft)
                : timerState === "active"
                  ? formatTime(seconds)
                  : exercise.reps}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {timerState === "inactive" && (
            <Button
              onClick={startSet}
              className="w-full gap-2 bg-green-600 hover:bg-green-700 transition-all duration-300"
            >
              <Play className="h-4 w-4" />
              Start Set {currentSet}
            </Button>
          )}

          {timerState === "active" && (
            <Button
              onClick={completeSet}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              <CheckCircle className="h-4 w-4" />
              Complete Set
            </Button>
          )}

          {timerState === "resting" && (
            <>
              <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className="absolute h-full bg-primary transition-all duration-1000"
                  style={{
                    width: `${(timeLeft / parseRestTime(exercise.rest)) * 100}%`,
                  }}
                />
              </div>

              <div className="text-center mb-2 text-sm">
                {timeLeft === 0 ? (
                  <span className="font-bold text-green-500 animate-pulse">Rest time complete!</span>
                ) : (
                  <span>Rest before next set</span>
                )}
              </div>

              {showFeedbackOptions && (
                <div className="space-y-4 mb-4 animate-in fade-in duration-300">
                  <h4 className="font-medium text-center">How was that set?</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center">
                        <Weight className="h-4 w-4 mr-1" /> Weight
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("weight", "too-light")}
                        >
                          <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                          Too Light
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("weight", "just-right")}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1 text-blue-500" />
                          Good
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("weight", "too-heavy")}
                        >
                          <ArrowDown className="h-3 w-3 mr-1 text-red-500" />
                          Too Heavy
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Rest Time
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("rest", "too-short")}
                        >
                          <ArrowUp className="h-3 w-3 mr-1 text-yellow-500" />
                          Too Short
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("rest", "just-right")}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1 text-blue-500" />
                          Good
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("rest", "too-long")}
                        >
                          <ArrowDown className="h-3 w-3 mr-1 text-purple-500" />
                          Too Long
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center">
                        <Zap className="h-4 w-4 mr-1" /> Difficulty
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("difficulty", "too-easy")}
                        >
                          <ThumbsDown className="h-3 w-3 mr-1 text-yellow-500" />
                          Too Easy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("difficulty", "just-right")}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1 text-blue-500" />
                          Good
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetFeedback("difficulty", "too-hard")}
                        >
                          <ThumbsDown className="h-3 w-3 mr-1 text-red-500" />
                          Too Hard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={startNextSet}
                className={cn(
                  "w-full gap-2 transition-all duration-300",
                  timeLeft === 0 ? "animate-bounce bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700",
                )}
              >
                <Play className="h-4 w-4" />
                {timeLeft === 0 ? "Start Next Set" : "Skip Rest"}
              </Button>
            </>
          )}

          {timerState === "complete" && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <span className="font-bold text-green-500 text-lg animate-pulse">Exercise Complete!</span>
              </div>

              {!feedbackSubmitted && (
                <div className="space-y-4 mb-4 animate-in fade-in duration-300">
                  <h4 className="font-medium text-center">How was this exercise overall?</h4>

                  <div className="flex justify-center gap-3 mt-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleExerciseFeedback("too-easy")}>
                      <ThumbsDown className="h-4 w-4 mr-2 text-yellow-500" />
                      Too Easy
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleExerciseFeedback("just-right")}>
                      <ThumbsUp className="h-4 w-4 mr-2 text-blue-500" />
                      Just Right
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleExerciseFeedback("too-hard")}>
                      <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                      Too Hard
                    </Button>
                  </div>
                </div>
              )}

              {feedbackSubmitted && (
                <Button
                  onClick={onComplete}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 transition-all duration-300"
                >
                  <Play className="h-4 w-4" />
                  Next Exercise
                </Button>
              )}
            </div>
          )}

          {(timerState === "active" || timerState === "inactive") && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 transition-colors duration-300"
              onClick={resetTimer}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSound}
            className="h-8 w-8 p-0 transition-opacity duration-300 hover:opacity-70"
          >
            {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* Hidden audio element for notifications */}
        <audio
          ref={audioRef}
          src="https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
          preload="auto"
        />
      </CardContent>
    </Card>
  )
}

