"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Target, LayoutGrid } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const focusTypes = [
  {
    value: "balanced",
    title: "Balanced Program",
    description: "Include selected muscle groups as part of a well-rounded workout plan",
    icon: <LayoutGrid className="h-10 w-10 text-blue-500" />,
    details: "Recommended for overall fitness and balanced development",
  },
  {
    value: "targeted",
    title: "Targeted Focus",
    description: "Prioritize only the muscle groups you've selected",
    icon: <Target className="h-10 w-10 text-red-500" />,
    details: "Best for specific goals or addressing muscle imbalances",
  },
]

export default function FocusTypePage() {
  const router = useRouter()
  const [focusType, setFocusType] = useState("balanced")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("worky-focus-type", JSON.stringify({ value: focusType }))
    router.push("/workout-plan")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Workout Focus</CardTitle>
          <CardDescription>How would you like to focus on your selected muscle groups?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup defaultValue={focusType} onValueChange={setFocusType} className="space-y-4">
              {focusTypes.map((type) => (
                <div key={type.value} className="relative">
                  <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                  <Label
                    htmlFor={type.value}
                    className="flex items-start p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                      bg-background hover:bg-accent
                      peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                  >
                    <div className="mr-4 mt-1">{type.icon}</div>
                    <div className="flex-1">
                      <div className="text-lg font-medium">{type.title}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                      <div className="text-xs text-primary mt-1">{type.details}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button type="submit" className="w-full group mt-8 transition-all duration-300">
              Generate Workout Plan
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

