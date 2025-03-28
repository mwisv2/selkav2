"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const equipmentOptions = [
  {
    id: "bodyweight",
    label: "Bodyweight Only",
    description: "Exercises that use your own body weight for resistance",
    icon: "🧍",
  },
  {
    id: "dumbbells",
    label: "Dumbbells",
    description: "Free weights that can be held in each hand",
    icon: "🏋️",
  },
  {
    id: "barbell",
    label: "Barbell & Weights",
    description: "Long bar with weight plates",
    icon: "🏋️‍♂️",
  },
  {
    id: "kettlebells",
    label: "Kettlebells",
    description: "Cast iron weights with handles",
    icon: "💪",
  },
  {
    id: "resistance-bands",
    label: "Resistance Bands",
    description: "Elastic bands that provide resistance",
    icon: "🔄",
  },
  {
    id: "bench",
    label: "Workout Bench",
    description: "Adjustable bench for various exercises",
    icon: "🛋️",
  },
  {
    id: "cable-machine",
    label: "Cable Machine",
    description: "Pulley system with adjustable weights",
    icon: "🔌",
  },
  {
    id: "smith-machine",
    label: "Smith Machine",
    description: "Barbell fixed within steel rails",
    icon: "🏗️",
  },
  {
    id: "full-gym",
    label: "Full Gym Access",
    description: "Access to all standard gym equipment",
    icon: "🏢",
  },
]

export default function EquipmentPage() {
  const router = useRouter()
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(["bodyweight"])

  const toggleEquipment = (id: string) => {
    setSelectedEquipment((prev) => {
      // If selecting "Full Gym", select all equipment
      if (id === "full-gym" && !prev.includes("full-gym")) {
        return equipmentOptions.map((option) => option.id)
      }

      // If deselecting "Full Gym", keep other selections
      if (id === "full-gym" && prev.includes("full-gym")) {
        return prev.filter((item) => item !== "full-gym")
      }

      // If selecting any other equipment while "Full Gym" is selected,
      // do nothing (full gym already includes everything)
      if (prev.includes("full-gym") && id !== "full-gym") {
        return prev
      }

      // Normal toggle behavior
      if (prev.includes(id)) {
        // Don't allow deselecting the last item - always have at least bodyweight
        if (prev.length === 1 && id === "bodyweight") {
          return prev
        }
        return prev.filter((item) => item !== id)
      } else {
        // When adding a new equipment, check if we now have all equipment
        const newSelection = [...prev, id]
        const allEquipmentExceptFullGym = equipmentOptions
          .filter((option) => option.id !== "full-gym")
          .map((option) => option.id)

        // If all individual equipment is selected, also select "Full Gym"
        if (allEquipmentExceptFullGym.every((item) => newSelection.includes(item))) {
          return [...newSelection, "full-gym"]
        }

        return newSelection
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEquipment.length > 0) {
      localStorage.setItem("worky-equipment", JSON.stringify(selectedEquipment))
      router.push("/onboarding/workout-split")
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Available Equipment</CardTitle>
          <CardDescription>Select the equipment you have access to for your workouts</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipmentOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={selectedEquipment.includes(option.id)}
                    onCheckedChange={() => toggleEquipment(option.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="flex items-center text-base font-medium cursor-pointer">
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full group mt-8 transition-all duration-300">
              Continue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

