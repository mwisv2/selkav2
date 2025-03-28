"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Scale, ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export default function WeightPage() {
  const router = useRouter()
  const [unit, setUnit] = useState<"kg" | "lb">("kg")
  const [weight, setWeight] = useState("70")
  const [scaleAnimation, setScaleAnimation] = useState(0.5)
  const animationRef = useRef<number>(0)

  // Initialize with default values
  useEffect(() => {
    if (unit === "kg") {
      setWeight("70")
    } else {
      // Convert 70kg to pounds
      const pounds = Math.round(70 * 2.20462)
      setWeight(pounds.toString())
    }
  }, [])

  // Smooth animation for scale
  useEffect(() => {
    // Animate scale on load
    let start: number | null = null
    const targetScale = weight
      ? Math.min(Math.max(Number.parseInt(weight, 10) / (unit === "kg" ? 150 : 330), 0.2), 1)
      : 0.5

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const duration = 400 // ms

      // Ease out animation
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
      const timeProgress = Math.min(progress / duration, 1)
      const easedProgress = easeOut(timeProgress)

      const currentScale = scaleAnimation + (targetScale - scaleAnimation) * easedProgress
      setScaleAnimation(currentScale)

      if (progress < duration) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [weight, unit])

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value)
  }

  const handleSliderChange = (value: number[]) => {
    setWeight(value[0].toString())
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
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert to kg for storage
    let weightInKg
    if (unit === "kg") {
      weightInKg = Number.parseInt(weight, 10)
    } else {
      // Convert pounds to kg
      weightInKg = Math.round(Number.parseInt(weight, 10) / 2.20462)
    }

    localStorage.setItem(
      "worky-weight",
      JSON.stringify({
        value: weightInKg,
        unit: unit,
        display: unit === "kg" ? `${weight} kg` : `${weight} lb`,
      }),
    )

    // Set flag that inputs have changed
    localStorage.setItem("worky-inputs-changed", "true")

    router.push("/onboarding/age")
  }

  // Calculate if the scale should be visible based on weight
  const scaleThreshold = 0.3 // Minimum scale size before showing
  const showScale = scaleAnimation > scaleThreshold

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">What's your weight?</CardTitle>
          <CardDescription>This helps us calculate your strength-to-weight ratio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="kg" onValueChange={handleUnitChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kg">Kilograms</TabsTrigger>
                <TabsTrigger value="lb">Pounds</TabsTrigger>
              </TabsList>

              <div className="mt-8 mb-10 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-primary/10"></div>
                  <Scale
                    className="w-32 h-32 text-primary transition-all duration-700 ease-out"
                    style={{
                      transform: `scale(${0.8 + scaleAnimation * 0.4})`,
                      opacity: 0.2 + scaleAnimation * 0.8,
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border-8 border-primary transition-all duration-700"
                    style={{
                      transform: `scale(${scaleAnimation})`,
                      opacity: showScale ? scaleAnimation : 0,
                    }}
                  ></div>
                </div>

                <div className="text-3xl font-bold text-primary mt-4 transition-all duration-300 tabular-nums">
                  {weight ? weight : unit === "kg" ? "70" : "154"} {unit}
                </div>
              </div>

              <div className="w-full px-2 py-4">
                <Slider
                  value={weight ? [Number.parseInt(weight)] : unit === "kg" ? [70] : [154]}
                  min={unit === "kg" ? 30 : 66}
                  max={unit === "kg" ? 200 : 440}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="my-6"
                />

                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{unit === "kg" ? "30 kg" : "66 lb"}</span>
                  <span>{unit === "kg" ? "200 kg" : "440 lb"}</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="weight-input">Weight ({unit})</Label>
                <Input
                  id="weight-input"
                  type="number"
                  placeholder={unit === "kg" ? "70" : "154"}
                  value={weight}
                  onChange={handleWeightChange}
                  min={unit === "kg" ? "30" : "66"}
                  max={unit === "kg" ? "200" : "440"}
                  required
                  className="text-lg transition-all duration-300"
                />
              </div>
            </Tabs>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/onboarding/height")}
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

