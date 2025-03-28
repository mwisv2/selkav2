"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function WorkoutFrequencyPage() {
  const router = useRouter()
  const [daysPerWeek, setDaysPerWeek] = useState(4)
  const [cycleLength, setCycleLength] = useState(1) // In weeks

  const handleDaysChange = (value: number[]) => {
    setDaysPerWeek(value[0])
  }

  const handleCycleLengthChange = (value: number) => {
    setCycleLength(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(
      "worky-workout-frequency",
      JSON.stringify({
        daysPerWeek: daysPerWeek,
        cycleLength: cycleLength,
      }),
    )
    router.push("/onboarding/workout-duration")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Workout Frequency</CardTitle>
          <CardDescription>How many days per week do you want to work out?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-full max-w-xs h-32 mb-8">
                <Calendar className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-5xl font-bold text-primary">{daysPerWeek}</span>
                  <span className="text-sm text-muted-foreground">days per week</span>
                </div>
              </div>

              <div className="w-full max-w-md px-4">
                <Slider defaultValue={[4]} min={2} max={6} step={1} onValueChange={handleDaysChange} className="my-6" />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>2 days</span>
                  <span>4 days</span>
                  <span>6 days</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Workout Cycle Length</h3>
              <p className="text-sm text-muted-foreground mb-4">
                How long should your workout cycle be before it repeats?
              </p>

              <RadioGroup
                defaultValue="1"
                onValueChange={(value) => handleCycleLengthChange(Number.parseInt(value))}
                className="grid grid-cols-2 gap-4"
              >
                <div className="relative">
                  <RadioGroupItem value="1" id="cycle-1" className="peer sr-only" />
                  <Label
                    htmlFor="cycle-1"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-xl font-bold mb-1">1 Week</span>
                    <span className="text-xs text-muted-foreground text-center">Same workout each week</span>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="2" id="cycle-2" className="peer sr-only" />
                  <Label
                    htmlFor="cycle-2"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-xl font-bold mb-1">2 Weeks</span>
                    <span className="text-xs text-muted-foreground text-center">Different workouts each week</span>
                  </Label>
                </div>
              </RadioGroup>
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

