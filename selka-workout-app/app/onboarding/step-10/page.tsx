"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Step10() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<string[]>([])

  const toggleEquipment = (value: string) => {
    setEquipment((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        equipment,
      }),
    )
    router.push("/onboarding/step-11")
  }

  const equipmentOptions = [
    "Dumbbells",
    "Barbell",
    "Squat Rack",
    "Bench Press",
    "Pull-up Bar",
    "Resistance Bands",
    "Kettlebells",
    "Cable Machine",
    "Leg Press",
    "Smith Machine",
    "Treadmill",
    "Exercise Bike",
    "Elliptical",
    "No Equipment (Bodyweight only)",
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Available Equipment</CardTitle>
        <Progress value={62.5} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {equipmentOptions.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox id={item} checked={equipment.includes(item)} onCheckedChange={() => toggleEquipment(item)} />
              <Label htmlFor={item} className="cursor-pointer">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-9")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={equipment.length === 0}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

