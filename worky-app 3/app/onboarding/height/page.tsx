"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HeightPage() {
  const router = useRouter()
  const [unit, setUnit] = useState<"cm" | "ft">("cm")
  const [height, setHeight] = useState("170")
  const [inches, setInches] = useState("0")
  const [rulerPosition, setRulerPosition] = useState(170)
  const rulerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastY = useRef(0)

  // Initialize with default values
  useEffect(() => {
    if (unit === "cm") {
      setHeight("170")
    } else {
      // Convert 170cm to feet and inches
      const totalInches = Math.round(170 / 2.54)
      const feet = Math.floor(totalInches / 12)
      const inchesRemainder = totalInches % 12
      setHeight(feet.toString())
      setInches(inchesRemainder.toString())
    }
  }, [unit])

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setHeight(value)
    if (unit === "cm" && value) {
      const heightValue = Math.min(Math.max(Number.parseInt(value, 10), 110), 230)
      setRulerPosition(heightValue)
    } else if (unit === "ft" && value) {
      // When feet changes, update the ruler position
      updateRulerFromFeetAndInches(Number.parseInt(value, 10), Number.parseInt(inches, 10) || 0)
    }
  }

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInches(value)
    if (unit === "ft" && value) {
      // When inches changes, update the ruler position
      updateRulerFromFeetAndInches(Number.parseInt(height, 10) || 0, Number.parseInt(value, 10))
    }
  }

  const updateRulerFromFeetAndInches = (feet: number, inches: number) => {
    // Convert feet and inches to cm for the ruler
    const totalInches = feet * 12 + inches
    const cm = Math.round(totalInches * 2.54)
    setRulerPosition(Math.min(Math.max(cm, 110), 230))
  }

  const handleUnitChange = (value: string) => {
    const newUnit = value as "cm" | "ft"
    setUnit(newUnit)

    // Convert current height to the new unit
    if (newUnit === "cm" && height) {
      // Convert from feet/inches to cm
      const feet = Number.parseInt(height, 10) || 0
      const inch = Number.parseInt(inches, 10) || 0
      const totalInches = feet * 12 + inch
      const cm = Math.round(totalInches * 2.54)
      setHeight(cm.toString())
      setRulerPosition(cm)
    } else if (newUnit === "ft" && height) {
      // Convert from cm to feet/inches
      const cm = Number.parseInt(height, 10)
      const totalInches = Math.round(cm / 2.54)
      const feet = Math.floor(totalInches / 12)
      const inchesRemainder = totalInches % 12
      setHeight(feet.toString())
      setInches(inchesRemainder.toString())
      // Keep ruler position in cm
      setRulerPosition(cm)
    }
  }

  const updateHeightFromRuler = (newPosition: number) => {
    const clampedPosition = Math.min(Math.max(newPosition, 110), 230)
    setRulerPosition(clampedPosition)

    if (unit === "cm") {
      setHeight(Math.round(clampedPosition).toString())
    } else {
      // Convert cm to feet and inches
      const totalInches = Math.round(clampedPosition / 2.54)
      const feet = Math.floor(totalInches / 12)
      const inchesRemainder = totalInches % 12
      setHeight(feet.toString())
      setInches(inchesRemainder.toString())
    }
  }

  // Handle mouse/touch events for ruler interaction
  useEffect(() => {
    const ruler = rulerRef.current
    if (!ruler) return

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      lastY.current = e.clientY
      ruler.style.cursor = "grabbing"
      e.preventDefault()
    }

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true
      lastY.current = e.touches[0].clientY
      e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const deltaY = lastY.current - e.clientY
      lastY.current = e.clientY

      // Calculate new position (moving up increases height)
      const newPosition = rulerPosition + deltaY * 0.5
      updateHeightFromRuler(newPosition)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      const deltaY = lastY.current - e.touches[0].clientY
      lastY.current = e.touches[0].clientY

      // Calculate new position (moving up increases height)
      const newPosition = rulerPosition + deltaY * 0.5
      updateHeightFromRuler(newPosition)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      ruler.style.cursor = "grab"
    }

    const handleTouchEnd = () => {
      isDragging.current = false
    }

    ruler.addEventListener("mousedown", handleMouseDown)
    ruler.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      ruler.removeEventListener("mousedown", handleMouseDown)
      ruler.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [rulerPosition, unit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert to cm for storage
    let heightInCm
    if (unit === "cm") {
      heightInCm = Number.parseInt(height, 10)
    } else {
      // Convert feet and inches to cm
      const feet = Number.parseInt(height, 10) || 0
      const inch = Number.parseInt(inches, 10) || 0
      heightInCm = Math.round(feet * 30.48 + inch * 2.54)
    }

    localStorage.setItem(
      "worky-height",
      JSON.stringify({
        value: heightInCm,
        unit: unit,
        display: unit === "cm" ? `${height} cm` : `${height}'${inches}"`,
      }),
    )

    // Set flag that inputs have changed
    localStorage.setItem("worky-inputs-changed", "true")

    router.push("/onboarding/weight")
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">How tall are you?</CardTitle>
          <CardDescription>Your height helps us calculate the right workout intensity</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="cm" onValueChange={handleUnitChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cm">Centimeters</TabsTrigger>
                <TabsTrigger value="ft">Feet & Inches</TabsTrigger>
              </TabsList>

              <div className="mt-6 mb-2 flex flex-col items-center justify-center">
                <div
                  ref={rulerRef}
                  className="relative h-60 w-24 bg-muted rounded-lg overflow-hidden cursor-grab touch-none select-none"
                >
                  {/* Ruler markings - show increments of 10 */}
                  <div
                    className="absolute inset-0 transition-transform duration-300 ease-out"
                    style={{
                      transform: `translateY(${(170 - rulerPosition) * 1.8}px)`,
                    }}
                  >
                    {Array.from({ length: 13 }).map((_, i) => {
                      const value = 110 + i * 10
                      return (
                        <div key={i} className="absolute w-full flex items-center h-6" style={{ top: `${i * 18}px` }}>
                          <div className="h-px w-1/3 bg-foreground/50"></div>
                          <span className="text-xs text-foreground/70 ml-2">{value}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Center indicator */}
                  <div className="absolute left-0 top-1/2 w-full h-0.5 bg-primary z-10">
                    <div className="absolute right-0 w-4 h-4 bg-primary rounded-full -mt-1.5 -mr-2 shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* Drag indicator - outside the ruler div so it doesn't move */}
              <div className="text-xs text-muted-foreground text-center mb-4">Scroll or drag to adjust</div>

              <div className="text-center text-2xl font-bold text-primary mb-4 transition-all duration-300">
                {unit === "cm" ? `${height || 170} cm` : `${height || 5}'${inches || 7}"`}
              </div>

              <TabsContent value="cm" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="height-cm">Height (cm)</Label>
                  <Input
                    id="height-cm"
                    type="number"
                    placeholder="170"
                    value={height}
                    onChange={handleHeightChange}
                    min="110"
                    max="230"
                    required
                    className="text-lg transition-all duration-300"
                  />
                </div>
              </TabsContent>

              <TabsContent value="ft" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height-ft">Feet</Label>
                    <Input
                      id="height-ft"
                      type="number"
                      placeholder="5"
                      value={height}
                      onChange={handleHeightChange}
                      min="3"
                      max="7"
                      required
                      className="text-lg transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height-in">Inches</Label>
                    <Input
                      id="height-in"
                      type="number"
                      placeholder="10"
                      value={inches}
                      onChange={handleInchesChange}
                      min="0"
                      max="11"
                      required
                      className="text-lg transition-all duration-300"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/")} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
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

