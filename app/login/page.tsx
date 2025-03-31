"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateHWID, getStoredHWID, storeHWID } from "@/lib/hwid"
import { toast } from "sonner"

export default function LoginPage() {
  const [key, setKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Generate and store HWID
      const hwid = await generateHWID()
      await storeHWID(hwid)

      // Get user profile data
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      
      // Verify key and HWID
      const response = await fetch("/api/verifyKey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          hwid,
          workoutData: {
            userProfile: {
              ...userProfile,
              experienceLevel: userProfile.experienceLevel || "beginner",
              injuries: userProfile.injuries || [],
              daysPerWeek: userProfile.daysPerWeek || 3,
              minsPerDay: userProfile.minsPerDay || 45,
              equipment: userProfile.equipment || ["No Equipment (Bodyweight only)"],
              maxes: userProfile.maxes || {
                squat: "0",
                bench: "0",
                deadlift: "0",
                overhead: "0"
              }
            },
            completedWorkouts: [],
            currentWeek: {
              weekNumber: 1,
              completedWorkouts: []
            },
            lastUpdated: new Date().toISOString()
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify key")
      }

      // Store license data and user profile
      const licenseData = {
        key,
        hwid,
        isActive: true,
        expiresAt: data.expiresAt,
        workoutData: data.workoutData
      }

      // Set license data cookie
      document.cookie = `licenseData=${JSON.stringify(licenseData)}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
      localStorage.setItem("licenseData", JSON.stringify(licenseData))
      localStorage.setItem("userProfile", JSON.stringify(data.workoutData.userProfile))

      // Set authentication cookie
      document.cookie = `selkaUserAuthenticated=true; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

      // Show success message
      toast.success("Access key verified successfully!")

      // Redirect to step-2 since onboarding is not completed
      router.push("/onboarding/step-2")
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Failed to verify key")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-lg mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your access key to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your access key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 