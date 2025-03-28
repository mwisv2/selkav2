"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function TimeFramePage() {
  const router = useRouter()
  const [weeks, setWeeks] = useState(12)

  const handleWeeksChange = (value: number[]) => {
    setWeeks(value[0])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("worky-time-frame", JSON.stringify({ value: weeks }))
    router.push("/onboarding/muscle-groups")
  }

  // Calculate the target date
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + weeks * 7)
  const formattedDate = targetDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Time Frame</CardTitle>
          <CardDescription>How many weeks do you want to follow this workout plan?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-full max-w-xs h-32 mb-8">
                <Calendar className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-5xl font-bold text-primary">{weeks}</span>
                  <span className="text-sm text-muted-foreground">weeks</span>
                </div>
              </div>

              <div className="w-full max-w-md px-4">
                <Slider
                  defaultValue={[12]}
                  min={4}
                  max={24}
                  step={1}
                  onValueChange={handleWeeksChange}
                  className="my-6"
                />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>4 weeks</span>
                  <span>12 weeks</span>
                  <span>24 weeks</span>
                </div>

                <div className="text-center mt-6 text-sm">
                  <span className="text-muted-foreground">Target completion date: </span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full group">
              Continue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

