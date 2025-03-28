"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from "lucide-react"

const muscleGroups = [
  { id: "chest", label: "Chest", icon: "💪" },
  { id: "back", label: "Back", icon: "🔙" },
  { id: "shoulders", label: "Shoulders", icon: "🏋️" },
  { id: "arms", label: "Arms", icon: "💪" },
  { id: "legs", label: "Legs", icon: "🦵" },
  { id: "core", label: "Core", icon: "🧠" },
  { id: "glutes", label: "Glutes", icon: "🍑" },
  { id: "calves", label: "Calves", icon: "👟" },
]

export default function MuscleGroupsPage() {
  const router = useRouter()
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const toggleMuscleGroup = (id: string) => {
    setSelectedGroups((prev) => (prev.includes(id) ? prev.filter((group) => group !== id) : [...prev, id]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedGroups.length === 0) return

    localStorage.setItem("worky-muscle-groups", JSON.stringify(selectedGroups))

    // Set flag that inputs have changed
    localStorage.setItem("worky-inputs-changed", "true")

    router.push("/onboarding/focus-type")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Target Muscle Groups</CardTitle>
          <CardDescription>Select the muscle groups you want to focus on</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {muscleGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => toggleMuscleGroup(group.id)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                    ${
                      selectedGroups.includes(group.id)
                        ? "border-primary bg-primary/10"
                        : "border-muted bg-background hover:bg-accent"
                    }
                  `}
                >
                  <span className="text-3xl mb-2">{group.icon}</span>
                  <span className="text-sm font-medium">{group.label}</span>
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Selected: {selectedGroups.length} of 8 muscle groups
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/onboarding/time-frame")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1 group mt-4" disabled={selectedGroups.length === 0}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

