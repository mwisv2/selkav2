"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Dumbbell, ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export default function SquatPage() {
  const router = useRouter()
  const [unit, setUnit] = useState<"kg" | "lb">("kg")
  const [weight, setWeight] = useState("")
  const [strengthLevel, setStrengthLevel] = useState(0.3)

  useEffect(() => {
    // Animate strength level on load
    setTimeout(() => setStrengthLevel(0.3), 300)
  }, [])

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWeight(value)

    if (value) {
      const numValue = Number.parseInt(value, 10)
      // Normalize the strength level between 0 and 1
      const normalized = Math.min(Math.max(numValue / (unit === "kg" ? 250 : 550), 0.3), 1)
      setStrengthLevel(normalized)
    } else {
      setStrengthLevel(0.3)
    }
  }

  const handleSliderChange = (value: number[]) => {
    setWeight(value[0].toString())

    const numValue = value[0]
    // Normalize the strength level between 0 and 1
    const normalized = Math.min(Math.max(numValue / (unit === "kg" ? 250 : 550), 0.3), 1)
    setStrengthLevel(normalized)
  }

  const handleUnitChange = (value: string) => {
    const newUnit = value as "kg" | "lb"
    setUnit(newUnit)

    // Convert current weight to the new unit
    if (newUnit === "kg" && weight) {
      // Convert from pounds to kg
      const pounds = Number.parseInt(weight, 10) || 0
      const kg = Math.round(pounds / 2.20462)
      setWeight(kg.toString())
    } else if (newUnit === "lb" && weight) {
      // Convert from kg to pounds
      const kg = Number.parseInt(weight, 10) || 0
      const pounds = Math.round(kg * 2.20462)
      setWeight(pounds.toString())
    } else {
      setWeight("")
      setStrengthLevel(0.3)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert to kg for storage
    let weightInKg
    if (unit === "kg") {
      weightInKg = Number.parseInt(weight, 10) || 0
    } else {
      // Convert pounds to kg
      weightInKg = Math.round((Number.parseInt(weight, 10) || 0) / 2.20462)
    }

    localStorage.setItem(
      "worky-squat",
      JSON.stringify({
        value: weightInKg,
        unit: unit,
        display: unit === "kg" ? `${weight} kg` : `${weight} lb`,
      }),
    )

    // Set flag that inputs have changed
    localStorage.setItem("worky-inputs-changed", "true")

    router.push("/onboarding/deadlift")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Squat Max</CardTitle>
          <CardDescription>What's your one-rep maximum for squat?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="kg" onValueChange={handleUnitChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kg">Kilograms</TabsTrigger>
                <TabsTrigger value="lb">Pounds</TabsTrigger>
              </TabsList>

              <div className="mt-8 mb-10 flex flex-col items-center justify-center">
                <div className="relative h-40 w-full flex items-center justify-center">
                  {/* Simplified strength visualization */}
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full border-8 border-primary/10"
                      style={{ opacity: 0.5 }}
                    ></div>
                    <Dumbbell
                      className="w-24 h-24 text-primary transition-all duration-700 ease-out"
                      style={{
                        transform: `scale(${0.8 + strengthLevel * 0.4})`,
                        opacity: 0.2 + strengthLevel * 0.8,
                      }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-8 border-primary transition-all duration-700"
                      style={{
                        transform: `scale(${strengthLevel})`,
                        opacity: strengthLevel,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-2xl font-bold text-primary mt-4 transition-all duration-300 tabular-nums">
                  {weight ? weight : "0"} {unit}
                </div>
              </div>

              <div className="w-full px-2 py-4">
                <Slider
                  value={weight ? [Number.parseInt(weight)] : [0]}
                  min={0}
                  max={unit === "kg" ? 250 : 550}
                  step={5}
                  onValueChange={handleSliderChange}
                  className="my-6"
                />

                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>0 {unit}</span>
                  <span>{unit === "kg" ? "125 kg" : "275 lb"}</span>
                  <span>{unit === "kg" ? "250 kg" : "550 lb"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="squat">Squat Max ({unit})</Label>
                <Input
                  id="squat"
                  type="number"
                  placeholder={unit === "kg" ? "120" : "265"}
                  value={weight}
                  onChange={handleWeightChange}
                  min="0"
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  If you don't know your 1RM, enter your best estimate or leave at 0
                </p>
              </div>
            </Tabs>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/onboarding/bench-press")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1 group transition-all duration-300">
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

