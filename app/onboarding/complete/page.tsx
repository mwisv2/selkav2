"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, Dumbbell } from "lucide-react"

export default function Complete() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    // Load user profile
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }

    // Simulate AI workout generation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setLoading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const handleComplete = () => {
    router.push("/dashboard")
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{loading ? "Generating Your Workout Plan" : "Your Plan is Ready!"}</CardTitle>
          {loading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <Dumbbell className="h-8 w-8 text-primary" />
          )}
        </div>
        <CardDescription>
          {loading
            ? "Our AI is analyzing your profile to create a personalized workout plan"
            : "Your personalized workout plan has been created based on your goals and preferences"}
        </CardDescription>
        <Progress value={100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <Progress value={progress} className="w-full h-2" />
            <p className="text-center text-muted-foreground">
              {progress < 30 && "Analyzing your profile data..."}
              {progress >= 30 && progress < 60 && "Selecting optimal exercises for your goals..."}
              {progress >= 60 && progress < 90 && "Creating your personalized workout schedule..."}
              {progress >= 90 && "Finalizing your workout plan..."}
            </p>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center rounded-full p-2 bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium">Your workout plan is ready!</h3>

            {userProfile && (
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Goal</p>
                  <p className="font-medium capitalize">{userProfile.goal?.replace(/_/g, " ")}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="font-medium capitalize">{userProfile.experienceLevel || "Not specified"}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Schedule</p>
                  <p className="font-medium">
                    {userProfile.daysPerWeek} days/week, {userProfile.timePerDay} min
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Equipment</p>
                  <p className="font-medium">{userProfile.equipment?.length} items selected</p>
                </div>

                {userProfile.equipmentWeights && Object.keys(userProfile.equipmentWeights).length > 0 && (
                  <div className="rounded-lg border p-3 col-span-2">
                    <p className="text-xs text-muted-foreground">Available Weights</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(userProfile.equipmentWeights).map(
                        ([equipment, weights]: [string, any]) =>
                          weights.length > 0 && (
                            <div key={equipment} className="text-xs">
                              <span className="font-medium">{equipment}:</span>{" "}
                              {Array.isArray(weights) ? weights.join("kg, ") : weights}kg
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-muted-foreground">
              We've created a personalized plan based on your goals and preferences. Your dashboard is ready with your
              first workout!
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleComplete} disabled={loading} className="w-full">
          Go to Dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}

