"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const workoutSplits = [
  {
    value: "full-body",
    title: "Full Body",
    description: "Train your entire body in each workout session",
    icon: "💪",
    details: "3-4 days per week",
  },
  {
    value: "upper-lower",
    title: "Upper/Lower",
    description: "Alternate between upper and lower body workouts",
    icon: "⬆️⬇️",
    details: "4 days per week",
  },
  {
    value: "push-pull-legs",
    title: "Push/Pull/Legs",
    description: "Separate pushing, pulling, and leg exercises",
    icon: "🏋️",
    details: "3-6 days per week",
  },
  {
    value: "body-part",
    title: "Body Part Split",
    description: "Focus on specific muscle groups each day",
    icon: "🔄",
    details: "4-6 days per week",
  },
]

export default function WorkoutSplitPage() {
  const router = useRouter()
  const [workoutSplit, setWorkoutSplit] = useState("push-pull-legs")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("worky-workout-split", JSON.stringify({ value: workoutSplit }))
    router.push("/onboarding/bench-press")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Choose Your Workout Split</CardTitle>
          <CardDescription>Select the training split that best fits your schedule and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup defaultValue={workoutSplit} onValueChange={setWorkoutSplit} className="space-y-4">
              {workoutSplits.map((split) => (
                <div key={split.value} className="relative">
                  <RadioGroupItem value={split.value} id={split.value} className="peer sr-only" />
                  <Label
                    htmlFor={split.value}
                    className="flex items-center p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                      bg-background hover:bg-accent
                      peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                  >
                    <div className="text-3xl mr-4">{split.icon}</div>
                    <div className="flex-1">
                      <div className="text-lg font-medium">{split.title}</div>
                      <div className="text-sm text-muted-foreground">{split.description}</div>
                      <div className="text-xs text-primary mt-1">{split.details}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button type="submit" className="w-full group mt-8 transition-all duration-300">
              Continue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

