"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const fitnessLevels = [
  {
    value: "beginner",
    title: "Beginner",
    description: "New to working out or returning after a long break",
    color: "bg-green-100 dark:bg-green-900/20",
    border: "border-green-300 dark:border-green-700",
  },
  {
    value: "intermediate",
    title: "Intermediate",
    description: "Consistent training for 6+ months with good form",
    color: "bg-blue-100 dark:bg-blue-900/20",
    border: "border-blue-300 dark:border-blue-700",
  },
  {
    value: "advanced",
    title: "Advanced",
    description: "Training consistently for 2+ years with good results",
    color: "bg-purple-100 dark:bg-purple-900/20",
    border: "border-purple-300 dark:border-purple-700",
  },
]

export default function FitnessLevelPage() {
  const router = useRouter()
  const [fitnessLevel, setFitnessLevel] = useState("intermediate")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("worky-fitness-level", JSON.stringify({ value: fitnessLevel }))
    router.push("/onboarding/workout-frequency") // Changed to workout frequency
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">What's your fitness level?</CardTitle>
          <CardDescription>This helps us determine the right exercise intensity and progression</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup defaultValue={fitnessLevel} onValueChange={setFitnessLevel} className="space-y-4">
              {fitnessLevels.map((level) => (
                <div key={level.value} className="relative">
                  <RadioGroupItem value={level.value} id={level.value} className="peer sr-only" />
                  <Label
                    htmlFor={level.value}
                    className={`flex flex-col p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                      ${level.color} ${level.border}
                      peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary`}
                  >
                    <span className="text-lg font-medium">{level.title}</span>
                    <span className="text-sm text-muted-foreground">{level.description}</span>

                    <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{
                          width: level.value === "beginner" ? "33%" : level.value === "intermediate" ? "66%" : "100%",
                        }}
                      ></div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/onboarding/age")} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1 group mt-8 transition-all duration-300">
                Continue
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

