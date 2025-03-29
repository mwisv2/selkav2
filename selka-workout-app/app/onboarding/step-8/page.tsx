"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Step8() {
  const router = useRouter()
  const [cycle, setCycle] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        cycle,
      }),
    )
    router.push("/onboarding/step-9")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Cycle Length</CardTitle>
        <Progress value={50} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>How long should each training cycle be?</Label>
          <RadioGroup value={cycle} onValueChange={setCycle} className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1-week" id="1-week" />
              <Label htmlFor="1-week" className="cursor-pointer">
                1-week cycle
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2-week" id="2-week" />
              <Label htmlFor="2-week" className="cursor-pointer">
                2-week cycle
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-7")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!cycle}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

