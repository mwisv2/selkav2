"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Step6() {
  const router = useRouter()
  const [timePerDay, setTimePerDay] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        timePerDay,
      }),
    )
    router.push("/onboarding/step-7")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Time Available</CardTitle>
        <Progress value={37.5} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timePerDay">Minutes available per day</Label>
          <Input
            id="timePerDay"
            type="number"
            placeholder="60"
            value={timePerDay}
            onChange={(e) => setTimePerDay(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-5")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!timePerDay}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

