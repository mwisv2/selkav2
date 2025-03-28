"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function FitnessGoalsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    weightGoal: "",
    timeFrame: "12",
    fitnessLevel: "intermediate",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("worky-fitness-goals", JSON.stringify(formData))
    router.push("/onboarding/max-lifts")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Fitness Goals</CardTitle>
          <CardDescription>Tell us about your fitness goals and experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weightGoal">Target Weight (kg)</Label>
              <Input
                id="weightGoal"
                name="weightGoal"
                type="number"
                placeholder="65"
                value={formData.weightGoal}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeFrame">Time Frame (weeks)</Label>
              <Select value={formData.timeFrame} onValueChange={(value) => handleSelectChange("timeFrame", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 weeks</SelectItem>
                  <SelectItem value="8">8 weeks</SelectItem>
                  <SelectItem value="12">12 weeks</SelectItem>
                  <SelectItem value="16">16 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fitnessLevel">Fitness Level</Label>
              <Select
                value={formData.fitnessLevel}
                onValueChange={(value) => handleSelectChange("fitnessLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
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

