"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function WeightGoalPage() {
  const router = useRouter()
  const [unit, setUnit] = useState<"kg" | "lb">("kg")
  const [goalType, setGoalType] = useState<"lose" | "maintain" | "gain">("lose")
  const [weight, setWeight] = useState("")
  const [currentWeight, setCurrentWeight] = useState<number>(0)

  useEffect(() => {
    // Get current weight from localStorage
    try {
      const storedWeight = localStorage.getItem("worky-weight")
      if (storedWeight) {
        const weightData = JSON.parse(storedWeight)
        setCurrentWeight(weightData.value)
      }
    } catch (error) {
      console.error("Error loading weight data:", error)
    }
  }, [])

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value)
  }

  const handleUnitChange = (value: string) => {
    setUnit(value as "kg" | "lb")
    setWeight("")
  }

  const handleGoalTypeChange = (value: string) => {
    setGoalType(value as "lose" | "maintain" | "gain")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert to kg for storage
    let weightInKg
    if (unit === "kg") {
      weightInKg = Number.parseInt(weight, 10) || currentWeight
    } else {
      // Convert pounds to kg
      weightInKg = Math.round((Number.parseInt(weight, 10) || 0) * 0.453592)
    }

    localStorage.setItem(
      "worky-weight-goal",
      JSON.stringify({
        value: weightInKg,
        unit: unit,
        display: unit === "kg" ? `${weight} kg` : `${weight} lb`,
        type: goalType,
      }),
    )

    router.push("/onboarding/time-frame")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Weight Goal</CardTitle>
          <CardDescription>What's your target weight goal?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup defaultValue={goalType} onValueChange={handleGoalTypeChange} className="grid grid-cols-3 gap-2">
              <div className="relative">
                <RadioGroupItem value="lose" id="lose" className="peer sr-only" />
                <Label
                  htmlFor="lose"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <TrendingDown className="mb-3 h-6 w-6 text-red-500" />
                  <span className="text-sm font-medium">Lose Weight</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="maintain" id="maintain" className="peer sr-only" />
                <Label
                  htmlFor="maintain"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Minus className="mb-3 h-6 w-6 text-amber-500" />
                  <span className="text-sm font-medium">Maintain</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="gain" id="gain" className="peer sr-only" />
                <Label
                  htmlFor="gain"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <TrendingUp className="mb-3 h-6 w-6 text-green-500" />
                  <span className="text-sm font-medium">Gain Muscle</span>
                </Label>
              </div>
            </RadioGroup>

            {goalType !== "maintain" && (
              <Tabs defaultValue="kg" onValueChange={handleUnitChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="kg">Kilograms</TabsTrigger>
                  <TabsTrigger value="lb">Pounds</TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="weight-goal">Target Weight ({unit})</Label>
                  <Input
                    id="weight-goal"
                    type="number"
                    placeholder={unit === "kg" ? "65" : "143"}
                    value={weight}
                    onChange={handleWeightChange}
                    min="0"
                    className="text-lg"
                    required={goalType !== "maintain"}
                  />

                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <span>
                      Current: {unit === "kg" ? currentWeight : Math.round(currentWeight * 2.20462)} {unit}
                    </span>
                    <span>{goalType === "lose" ? "Target: Lower" : "Target: Higher"}</span>
                  </div>
                </div>
              </Tabs>
            )}

            <Button type="submit" className="w-full group mt-8">
              Continue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

