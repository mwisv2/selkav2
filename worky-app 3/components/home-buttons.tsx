"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Dumbbell, Salad, Plus } from "lucide-react"

export function HomeButtons() {
  const [hasWorkoutPlan, setHasWorkoutPlan] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if the user has a workout plan
    const hasPlan = localStorage.getItem("worky-has-plan") === "true"
    setHasWorkoutPlan(hasPlan)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col space-y-3">
        <div className="h-12 bg-primary/20 rounded-lg"></div>
        <div className="h-12 bg-primary/10 rounded-lg"></div>
      </div>
    )
  }

  return (
    <>
      {hasWorkoutPlan ? (
        // Show workout and nutrition buttons as main options if user has a plan
        <>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/workout-plan" className="flex-1">
              <Button size="lg" className="w-full group">
                <Dumbbell className="mr-2 h-4 w-4" />
                My Workout
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/nutrition" className="flex-1">
              <Button size="lg" className="w-full">
                <Salad className="mr-2 h-4 w-4" />
                Nutrition
              </Button>
            </Link>
          </div>
          <Link href="/onboarding/height">
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create New Workout Plan
            </Button>
          </Link>
        </>
      ) : (
        // Show create workout plan as main option if user doesn't have a plan
        <Link href="/onboarding/height">
          <Button size="lg" className="group w-full">
            <Dumbbell className="mr-2 h-4 w-4" />
            Create Workout Plan
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      )}
    </>
  )
}

