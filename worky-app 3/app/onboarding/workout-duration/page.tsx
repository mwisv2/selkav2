"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Clock } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function WorkoutDurationPage() {
  const router = useRouter()
  const [duration, setDuration] = useState(60)
  const [workoutFrequency, setWorkoutFrequency] = useState({ daysPerWeek: 4, cycleLength: 1 })

  useEffect(() => {
    // Load workout frequency data
    const frequencyData = localStorage.getItem("worky-workout-frequency")
    if (frequencyData) {
      try {
        setWorkoutFrequency(JSON.parse(frequencyData))
      } catch (e) {
        console.error("Error parsing workout frequency data:", e)
      }
    }
  }, [])

  const handleDurationChange = (value: number[]) => {
    setDuration(value[0])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("worky-workout-duration", JSON.stringify({ value: duration }))
    router.push("/onboarding/equipment")
  }

  // Calculate estimated exercises based on duration
  const estimatedExercises = Math.max(4, Math.floor(duration / 12))

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Workout Duration</CardTitle>
          <CardDescription>How long do you want to spend on each workout day?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-full max-w-xs h-32 mb-8">
                <Clock className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-5xl font-bold text-primary">{duration}</span>
                  <span className="text-sm text-muted-foreground">minutes per workout</span>
                </div>
              </div>

              <div className="w-full max-w-md px-4">
                <Slider
                  defaultValue={[60]}
                  min={30}
                  max={120}
                  step={5}
                  onValueChange={handleDurationChange}
                  className="my-6"
                />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>30 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>

                <div className="text-center mt-6 space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Estimated exercises per workout: </span>
                    <span className="font-medium">{estimatedExercises}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Weekly workout time: </span>
                    <span className="font-medium">{duration * workoutFrequency.daysPerWeek} minutes</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We'll create a {workoutFrequency.cycleLength}-week workout plan with {workoutFrequency.daysPerWeek}{" "}
                    workout days per week.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full group">
              Continue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

