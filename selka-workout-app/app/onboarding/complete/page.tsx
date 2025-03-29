"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

export default function Complete() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
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
      <CardHeader>
        <CardTitle className="text-2xl">Generating Your Workout Plan</CardTitle>
        <Progress value={100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <Progress value={progress} className="w-full h-2" />
            <p className="text-center text-muted-foreground">Our AI is creating your personalized workout plan...</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center rounded-full p-2 bg-green-100 dark:bg-green-900">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Your workout plan is ready!</h3>
            <p className="text-muted-foreground">
              We've created a personalized plan based on your goals and preferences.
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

