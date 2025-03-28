"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { calculateCalories } from "@/lib/calorie-calculator"

export default function NutritionPage() {
  const [calorieData, setCalorieData] = useState({
    maintenance: 0,
    target: 0,
    deficit: 0,
    dailyProtein: 0,
    dailyFat: 0,
    dailyCarbs: 0,
  })
  const [userData, setUserData] = useState({
    height: { value: 170 },
    weight: { value: 70 },
    age: { value: 30 },
    weightGoal: { value: 65, type: "lose" },
    timeFrame: { value: 12 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load all user data from localStorage
    try {
      const safelyParseJSON = (jsonString: string | null, defaultValue: any) => {
        if (!jsonString) return defaultValue
        try {
          return JSON.parse(jsonString)
        } catch (e) {
          return defaultValue
        }
      }

      const height = safelyParseJSON(localStorage.getItem("worky-height"), { value: 170 })
      const weight = safelyParseJSON(localStorage.getItem("worky-weight"), { value: 70 })
      const age = safelyParseJSON(localStorage.getItem("worky-age"), { value: 30 })
      const weightGoal = safelyParseJSON(localStorage.getItem("worky-weight-goal"), { value: 70, type: "maintain" })
      const timeFrame = safelyParseJSON(localStorage.getItem("worky-time-frame"), { value: 12 })

      setUserData({
        height,
        weight,
        age,
        weightGoal,
        timeFrame,
      })

      // Calculate calories based on user data
      const calories = calculateCalories(height, weight, age, weightGoal, timeFrame)
      setCalorieData(calories)
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-lg">Calculating your nutrition plan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <Link href="/workout-plan">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Workout Plan
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Your Nutrition Plan</CardTitle>
          <CardDescription>
            Calculated based on your current metrics and{" "}
            {userData.weightGoal.type === "lose"
              ? "weight loss"
              : userData.weightGoal.type === "gain"
                ? "muscle gain"
                : "maintenance"}{" "}
            goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Daily Calorie Target</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-primary">{calorieData.target}</span>
                  <span className="text-muted-foreground mb-1">calories</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  To reach your goal of {userData.weightGoal.value}kg in {userData.timeFrame.value} weeks
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Calorie Breakdown</h3>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Maintenance:</span>
                  <span>{calorieData.maintenance} calories</span>
                </div>
                {userData.weightGoal.type !== "maintain" && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">
                      Daily {userData.weightGoal.type === "lose" ? "Deficit" : "Surplus"}:
                    </span>
                    <span>{Math.abs(calorieData.deficit)} calories</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Macronutrient Targets</h3>

              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm">
                      {calorieData.dailyProtein}g ({Math.round(calorieData.dailyProtein * 4)} cals)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${((calorieData.dailyProtein * 4) / calorieData.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Carbohydrates</span>
                    <span className="text-sm">
                      {calorieData.dailyCarbs}g ({Math.round(calorieData.dailyCarbs * 4)} cals)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${((calorieData.dailyCarbs * 4) / calorieData.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm">
                      {calorieData.dailyFat}g ({Math.round(calorieData.dailyFat * 9)} cals)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${((calorieData.dailyFat * 9) / calorieData.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 mt-6">
            <h3 className="font-medium mb-2">Nutrition Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Prioritize whole foods like lean proteins, fruits, vegetables, and whole grains</li>
              <li>Drink at least 8 glasses of water daily to stay hydrated</li>
              <li>Time your protein intake around workouts for optimal muscle recovery</li>
              <li>Adjust your calorie intake if you're not progressing toward your goal after 2-3 weeks</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

