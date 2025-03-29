"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell } from "lucide-react"

// Function to generate workouts based on user profile
const generateWorkouts = (userProfile: any) => {
  const workouts = []
  if (userProfile && userProfile.fitnessGoal && userProfile.experienceLevel) {
    // Simplified workout generation logic
    if (userProfile.fitnessGoal === "strength") {
      workouts.push({ day: "Monday", title: "Upper Body Strength" })
      workouts.push({ day: "Wednesday", title: "Lower Body Strength" })
      workouts.push({ day: "Friday", title: "Full Body Strength" })
    } else if (userProfile.fitnessGoal === "endurance") {
      workouts.push({ day: "Tuesday", title: "Cardio Training" })
      workouts.push({ day: "Thursday", title: "HIIT Workout" })
      workouts.push({ day: "Saturday", title: "Long Run" })
    } else {
      workouts.push({ day: "Monday", title: "Yoga" })
      workouts.push({ day: "Wednesday", title: "Pilates" })
      workouts.push({ day: "Friday", title: "Barre" })
    }
  }
  return workouts
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([])
  const [workoutEvents, setWorkoutEvents] = useState<{ date: Date; type: string; completed: boolean }[]>([])

  // Function to check if a date has a workout
  const hasWorkout = (date: Date) => {
    return workoutEvents.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Function to get workouts for a specific date
  const getWorkoutsForDate = (date: Date) => {
    return workoutEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      setSelectedDateEvents(getWorkoutsForDate(newDate))
    } else {
      setSelectedDateEvents([])
    }
  }

  useEffect(() => {
    // Load completed workouts from localStorage
    const completedWorkouts = JSON.parse(localStorage.getItem("completedWorkouts") || "[]")

    // Convert to calendar events
    const events = completedWorkouts.map((workout: any) => ({
      date: new Date(workout.completedDate),
      type: workout.title,
      completed: true,
    }))

    // Load user profile to get scheduled workouts
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      const userProfile = JSON.parse(profile)

      // Generate workouts based on user profile
      const generatedWorkouts = generateWorkouts(userProfile)

      // Add future workouts to calendar
      const today = new Date()
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

      generatedWorkouts.forEach((workout: any, index: number) => {
        // Find the next occurrence of this weekday
        const workoutDay = weekdays.indexOf(workout.day)
        const daysToAdd = (workoutDay + 7 - today.getDay()) % 7

        const workoutDate = new Date(today)
        workoutDate.setDate(today.getDate() + daysToAdd + index * 7) // Add weeks for future occurrences

        events.push({
          date: workoutDate,
          type: workout.title,
          completed: false,
        })
      })
    }

    setWorkoutEvents(events)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workout Calendar</h1>
        <p className="text-muted-foreground">View your scheduled workouts and track your consistency</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view scheduled workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border"
              modifiers={{
                workout: (date) => hasWorkout(date),
              }}
              modifiersClassNames={{
                workout: "bg-primary/10 font-bold",
              }}
              components={{
                DayContent: (props) => {
                  const workouts = getWorkoutsForDate(props.date)
                  return (
                    <div className="relative h-full w-full p-2">
                      <div>{props.date.getDate()}</div>
                      {workouts.length > 0 && (
                        <div className="absolute bottom-1 right-1">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${workouts[0].completed ? "bg-green-500" : "bg-primary"}`}
                          />
                        </div>
                      )}
                    </div>
                  )
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {date
                ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                : "No Date Selected"}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length > 0
                ? `${selectedDateEvents.length} workout${selectedDateEvents.length > 1 ? "s" : ""} scheduled`
                : "No workouts scheduled for this day"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                    <div
                      className={`rounded-full p-2 ${event.completed ? "bg-green-100 dark:bg-green-900" : "bg-primary/10"}`}
                    >
                      <Dumbbell
                        className={`h-5 w-5 ${event.completed ? "text-green-600 dark:text-green-400" : "text-primary"}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{event.type}</h3>
                        {event.completed ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">Scheduled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">45 minutes • 5 exercises</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No workouts scheduled for this day.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Rest days are important too! Use this time for recovery or light activity.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

