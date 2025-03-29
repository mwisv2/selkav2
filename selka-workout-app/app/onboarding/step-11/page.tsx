"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function Step11() {
  const router = useRouter()
  const [maxes, setMaxes] = useState({
    squat: "",
    bench: "",
    deadlift: "",
    overhead: "",
  })

  const handleChange = (exercise: keyof typeof maxes, value: string) => {
    setMaxes((prev) => ({
      ...prev,
      [exercise]: value,
    }))
  }

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        maxes,
      }),
    )
    router.push("/onboarding/complete")
  }

  const isComplete = Object.values(maxes).some((value) => value !== "")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">1-Rep Max (Optional)</CardTitle>
        <Progress value={75} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter your 1-rep max for compound lifts (in kg). Leave blank if unknown.
        </p>
        <div className="space-y-2">
          <Label htmlFor="squat">Squat</Label>
          <Input
            id="squat"
            type="number"
            placeholder="100"
            value={maxes.squat}
            onChange={(e) => handleChange("squat", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bench">Bench Press</Label>
          <Input
            id="bench"
            type="number"
            placeholder="80"
            value={maxes.bench}
            onChange={(e) => handleChange("bench", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadlift">Deadlift</Label>
          <Input
            id="deadlift"
            type="number"
            placeholder="120"
            value={maxes.deadlift}
            onChange={(e) => handleChange("deadlift", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overhead">Overhead Press</Label>
          <Input
            id="overhead"
            type="number"
            placeholder="60"
            value={maxes.overhead}
            onChange={(e) => handleChange("overhead", e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-10")}>
          Back
        </Button>
        <Button onClick={handleNext}>{isComplete ? "Next" : "Skip"}</Button>
      </CardFooter>
    </Card>
  )
}

