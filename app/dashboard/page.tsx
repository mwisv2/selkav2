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
import { generateWorkouts } from "@/lib/utils"

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [workoutStats, setWorkoutStats] = useState({
    totalCompleted: 0,
    lastWorkoutDate: null,
    totalTime: 0,
  })

  const [workoutCards, setWorkoutCards] = useState<any[]>([])

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

      // Generate workout cards based on user equipment
      const userProfile = JSON.parse(profile)
      const workouts = generateWorkouts(userProfile)
      setWorkoutCards(workouts.slice(0, 3)) // Just show the first 3 workouts
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
            <div className="text-2xl font-bold">
              {workoutStats.totalCompleted}/{userProfile?.daysPerWeek || 0}
            </div>
            <p className="text-xs text-muted-foreground">Workouts completed this week</p>
            <Progress className="mt-2" value={(workoutStats.totalCompleted / (userProfile?.daysPerWeek || 1)) * 100} />
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
            {(() => {
              // Check if there's a workout for today
              const today = new Date()
              const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
                today.getDay()
              ]
              const todayWorkout = workoutCards.find((workout) => workout.day === weekday)

              if (todayWorkout) {
                return (
                  <>
                    <div className="text-2xl font-bold">Today</div>
                    <p className="text-xs text-muted-foreground">
                      {todayWorkout.title} - {todayWorkout.description}
                    </p>
                  </>
                )
              } else {
                // Find the next workout day
                const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                const todayIndex = today.getDay()
                let nextWorkoutDay = null
                let daysUntilNext = 0

                // Look through the next 7 days to find the next workout
                for (let i = 1; i <= 7; i++) {
                  const nextIndex = (todayIndex + i) % 7
                  const nextDay = weekdays[nextIndex]
                  const workout = workoutCards.find((w) => w.day === nextDay)

                  if (workout) {
                    nextWorkoutDay = workout
                    daysUntilNext = i
                    break
                  }
                }

                if (nextWorkoutDay) {
                  return (
                    <>
                      <div className="text-2xl font-bold">Rest Day</div>
                      <p className="text-xs text-muted-foreground">
                        Next workout in {daysUntilNext} {daysUntilNext === 1 ? "day" : "days"}: {nextWorkoutDay.title}
                      </p>
                    </>
                  )
                } else {
                  return (
                    <>
                      <div className="text-2xl font-bold">Rest Day</div>
                      <p className="text-xs text-muted-foreground">No upcoming workouts scheduled</p>
                    </>
                  )
                }
              }
            })()}
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
            {workoutCards.length > 0 ? (
              workoutCards.map((workout, index) => (
                <WorkoutCard
                  key={index}
                  title={workout.title}
                  description={workout.description}
                  day={workout.day}
                  duration={workout.duration}
                  exercises={workout.exercises.slice(0, 3)}
                />
              ))
            ) : (
              <Card className="col-span-3 p-6 text-center">
                <CardContent>
                  <p className="text-muted-foreground">
                    No workouts available. Please update your equipment preferences.
                  </p>
                </CardContent>
              </Card>
            )}
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

