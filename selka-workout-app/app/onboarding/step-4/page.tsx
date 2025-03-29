"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Step4() {
  const router = useRouter()
  const [age, setAge] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        age,
      }),
    )
    router.push("/onboarding/step-5")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your Age</CardTitle>
        <Progress value={25} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-3")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!age}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

