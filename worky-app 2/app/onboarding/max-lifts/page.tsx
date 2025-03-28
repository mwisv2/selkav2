"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function MaxLiftsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    benchPress: "",
    squat: "",
    deadlift: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("worky-max-lifts", JSON.stringify(formData))
    router.push("/onboarding/muscle-groups")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Maximum Lifts</CardTitle>
          <CardDescription>Enter your one-rep maximum for these compound lifts (kg)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="benchPress">Bench Press</Label>
              <Input
                id="benchPress"
                name="benchPress"
                type="number"
                placeholder="80"
                value={formData.benchPress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="squat">Squat</Label>
              <Input
                id="squat"
                name="squat"
                type="number"
                placeholder="120"
                value={formData.squat}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadlift">Deadlift</Label>
              <Input
                id="deadlift"
                name="deadlift"
                type="number"
                placeholder="140"
                value={formData.deadlift}
                onChange={handleChange}
                required
              />
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

