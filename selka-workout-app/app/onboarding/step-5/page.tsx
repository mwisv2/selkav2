"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Step5() {
  const router = useRouter()
  const [goal, setGoal] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        goal,
      }),
    )
    router.push("/onboarding/step-6")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your Goal</CardTitle>
        <Progress value={31.25} className="h-2" />
      </CardHeader>
      <CardContent>
        <RadioGroup value={goal} onValueChange={setGoal} className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lose_weight" id="lose_weight" />
            <Label htmlFor="lose_weight" className="cursor-pointer">
              Lose Weight
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gain_weight" id="gain_weight" />
            <Label htmlFor="gain_weight" className="cursor-pointer">
              Gain Weight
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="maintain_weight" id="maintain_weight" />
            <Label htmlFor="maintain_weight" className="cursor-pointer">
              Maintain Weight
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lose_fat" id="lose_fat" />
            <Label htmlFor="lose_fat" className="cursor-pointer">
              Lose Fat
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gain_muscle" id="gain_muscle" />
            <Label htmlFor="gain_muscle" className="cursor-pointer">
              Gain Muscle
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-4")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!goal}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

