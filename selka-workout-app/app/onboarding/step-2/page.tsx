"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Step2() {
  const router = useRouter()
  const [height, setHeight] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        height,
      }),
    )
    router.push("/onboarding/step-3")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your Height</CardTitle>
        <Progress value={12.5} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-1")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!height}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

