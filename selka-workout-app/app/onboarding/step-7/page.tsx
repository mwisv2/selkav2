"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function Step7() {
  const router = useRouter()
  const [daysPerWeek, setDaysPerWeek] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        daysPerWeek,
      }),
    )
    router.push("/onboarding/step-8")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Days Per Week</CardTitle>
        <Progress value={43.75} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="daysPerWeek">How many days per week can you train?</Label>
          <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
            <SelectTrigger id="daysPerWeek">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day} {day === 1 ? "day" : "days"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-6")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!daysPerWeek}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

