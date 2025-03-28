type HeightData = {
  value: number
}

type WeightData = {
  value: number
}

type AgeData = {
  value: number
}

type WeightGoalData = {
  value: number
  type: string
}

type TimeFrameData = {
  value: number
}

type CalorieData = {
  maintenance: number
  target: number
  deficit: number
  dailyProtein: number
  dailyFat: number
  dailyCarbs: number
}

// Calculate calories based on user data
export function calculateCalories(
  height: HeightData,
  weight: WeightData,
  age: AgeData,
  weightGoal: WeightGoalData,
  timeFrame: TimeFrameData,
): CalorieData {
  // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
  // For simplicity, we're assuming male. In a real app, you'd factor in gender
  const bmr = 10 * weight.value + 6.25 * height.value - 5 * age.value + 5

  // Multiply BMR by activity factor (assuming moderate activity for our app)
  const activityFactor = 1.55 // Moderate exercise 3-5 times a week
  const maintenanceCalories = Math.round(bmr * activityFactor)

  let targetCalories = maintenanceCalories
  let calorieDeficit = 0

  // Calculate caloric deficit/surplus based on weight goal
  if (weightGoal.type !== "maintain") {
    // Calculate weight difference
    const weightDifference = Math.abs(weightGoal.value - weight.value) // kg

    // Convert timeFrame from weeks to days
    const days = timeFrame.value * 7

    // 1 kg of fat = 7700 calories
    const totalCalorieDifference = weightDifference * 7700

    // Daily calorie deficit/surplus needed
    const dailyCalorieDifference = Math.round(totalCalorieDifference / days)

    // Cap the daily deficit/surplus to safe levels
    const maxDailyChange = weightGoal.type === "lose" ? 1000 : 500 // More conservative with surplus
    calorieDeficit =
      weightGoal.type === "lose"
        ? -Math.min(dailyCalorieDifference, maxDailyChange)
        : Math.min(dailyCalorieDifference, maxDailyChange)

    targetCalories = maintenanceCalories + calorieDeficit
  }

  // Calculate macronutrients
  // Protein: 1.8g per kg of bodyweight (higher for athletes and weight loss)
  const dailyProtein = Math.round(weight.value * 1.8)

  // Fat: 25% of total calories
  const dailyFat = Math.round((targetCalories * 0.25) / 9) // 9 calories per gram of fat

  // Remaining calories from carbs
  const proteinCalories = dailyProtein * 4 // 4 calories per gram of protein
  const fatCalories = dailyFat * 9
  const carbCalories = targetCalories - proteinCalories - fatCalories
  const dailyCarbs = Math.round(carbCalories / 4) // 4 calories per gram of carbs

  return {
    maintenance: maintenanceCalories,
    target: targetCalories,
    deficit: calorieDeficit,
    dailyProtein,
    dailyFat,
    dailyCarbs,
  }
}

