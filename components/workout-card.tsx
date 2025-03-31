import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"
import Link from "next/link"

interface WorkoutCardProps {
  title: string
  description: string
  day: string
  duration: string
  exercises: string[]
}

export function WorkoutCard({ title, description, day, duration, exercises }: WorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="rounded-full bg-primary/10 p-1">
            <Dumbbell className="h-4 w-4 text-primary" />
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mb-2">
          <div className="text-muted-foreground">{day}</div>
          <div className="font-medium">{duration}</div>
        </div>
        <div className="space-y-1">
          {exercises.map((exercise, index) => (
            <div key={index} className="text-sm">
              • {exercise}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/workouts/active" className="w-full">
          <Button variant="outline" className="w-full">
            Start Workout
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

