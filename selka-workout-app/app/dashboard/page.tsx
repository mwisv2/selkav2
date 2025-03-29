"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Dumbbell, Timer, TrendingUp, Weight } from "lucide-react"
import Link from "next/link"
import { WorkoutCard } from "@/components/workout-card"
import { WeightTracker } from "@/components/weight-tracker"
import { CalorieTracker } from "@/components/calorie-tracker"

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [workoutStats, setWorkoutStats] = useState({
    totalCompleted: 0,
    lastWorkoutDate: null,
    totalTime: 0,
  })

  useEffect(() => {
    // Load workout stats from localStorage
    const stats = localStorage.getItem("workoutStats")
    if (stats) {
      setWorkoutStats(JSON.parse(stats))
    }

    // Load user profile from localStorage
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
  }, [])

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Selka</CardTitle>
            <CardDescription>Please complete the onboarding process to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/onboarding/step-1" passHref>
              <Button className="w-full">Start Onboarding</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="mt-2 md:mt-0">
          <Link href="/dashboard/workouts/active">
            <Button>
              <Dumbbell className="mr-2 h-4 w-4" />
              Start Workout
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutStats.totalCompleted}/7</div>
            <p className="text-xs text-muted-foreground">Workouts completed this week</p>
            <Progress className="mt-2" value={(workoutStats.totalCompleted / 7) * 100} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile.weight} kg</div>
            <p className="text-xs text-muted-foreground">Track your weight changes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workoutStats.totalTime ? workoutStats.totalTime.toFixed(1) : "0"} hrs
            </div>
            <p className="text-xs text-muted-foreground">Total workout time this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Workout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">Get started with your first workout</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workouts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
        </TabsList>
        <TabsContent value="workouts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <WorkoutCard
              title="Upper Body"
              description="Chest, shoulders, and triceps"
              day="Today"
              duration="45 min"
              exercises={["Bench Press", "Overhead Press", "Tricep Extensions"]}
            />
            <WorkoutCard
              title="Lower Body"
              description="Quads, hamstrings, and calves"
              day="Tomorrow"
              duration="50 min"
              exercises={["Squats", "Deadlifts", "Leg Press"]}
            />
            <WorkoutCard
              title="Back & Biceps"
              description="Back, biceps, and core"
              day="Thursday"
              duration="40 min"
              exercises={["Pull-ups", "Barbell Rows", "Bicep Curls"]}
            />
          </div>
          <div className="flex justify-center">
            <Link href="/dashboard/workouts">
              <Button variant="outline">View All Workouts</Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracking</CardTitle>
              <CardDescription>Track your weight progress over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeightTracker />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calorie Tracking</CardTitle>
              <CardDescription>Monitor your daily calorie intake</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <CalorieTracker />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

