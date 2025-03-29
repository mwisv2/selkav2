"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Step9() {
  const router = useRouter()
  const [totalWeeks, setTotalWeeks] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        totalWeeks,
      }),
    )
    router.push("/onboarding/step-10")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Total Weeks</CardTitle>
        <Progress value={56.25} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="totalWeeks">How many weeks do you plan to train?</Label>
          <Input
            id="totalWeeks"
            type="number"
            placeholder="12"
            value={totalWeeks}
            onChange={(e) => setTotalWeeks(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-8")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!totalWeeks}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

