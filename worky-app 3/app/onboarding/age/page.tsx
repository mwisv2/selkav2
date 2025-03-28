"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function AgePage() {
  const router = useRouter()
  const [age, setAge] = useState(30)
  const [animatedAge, setAnimatedAge] = useState(1)

  useEffect(() => {
    // Animate age counter on load
    const interval = setInterval(() => {
      setAnimatedAge((prev) => {
        if (prev >= age) {
          clearInterval(interval)
          return age
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [age])

  const handleAgeChange = (value: number[]) => {
    setAge(value[0])
    setAnimatedAge(value[0])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("worky-age", JSON.stringify({ value: age }))
    router.push("/onboarding/fitness-level")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">How old are you?</CardTitle>
          <CardDescription>Your age helps us tailor recovery times and exercise selection</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-7xl font-bold text-primary mb-8 tabular-nums transition-all duration-300">
                {animatedAge}
              </div>

              <div className="w-full max-w-md px-4">
                <Slider
                  defaultValue={[30]}
                  min={16}
                  max={80}
                  step={1}
                  onValueChange={handleAgeChange}
                  className="my-6"
                />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>16</span>
                  <span>30</span>
                  <span>50</span>
                  <span>80</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/onboarding/weight")}
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

