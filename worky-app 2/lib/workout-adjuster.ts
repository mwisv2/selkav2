type SetFeedback = {
  type: "weight" | "rest" | "difficulty"
  value: "too-light" | "too-heavy" | "just-right" | "too-short" | "too-long" | "too-easy" | "too-hard"
  exerciseName: string
  date: string
}

type ExerciseFeedback = {
  exerciseName: string
  difficulty: "too-easy" | "just-right" | "too-hard"
  restTime: number
  date: string
}

// Function to adjust weight based on feedback using ML-like approach
export function adjustWeight(
  currentWeight: number,
  feedback: "too-light" | "too-heavy" | "just-right",
  exerciseHistory: SetFeedback[] = [],
): number {
  // Basic adjustment based on immediate feedback
  let adjustment = 0

  if (feedback === "too-light") {
    // If it's too light, increase weight by 5-10%
    adjustment = Math.max(2.5, Math.round((currentWeight * 0.075) / 2.5) * 2.5)
  } else if (feedback === "too-heavy") {
    // If it's too heavy, decrease weight by 5-10%
    adjustment = -Math.max(2.5, Math.round((currentWeight * 0.075) / 2.5) * 2.5)
  }

  // "Just right" gets no immediate adjustment

  // If we have exercise history, do more sophisticated ML-like adjustments
  if (exerciseHistory.length >= 3) {
    // Get last 5 instances of weight feedback for this exercise
    const recentHistory = exerciseHistory
      .filter((item) => item.type === "weight")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    // Count occurrences of each feedback type
    const feedbackCounts = recentHistory.reduce(
      (counts, feedback) => {
        counts[feedback.value] = (counts[feedback.value] || 0) + 1
        return counts
      },
      {} as Record<string, number>,
    )

    // Calculate a weighted adjustment based on feedback patterns
    let weightedAdjustment = 0

    // If consistent feedback, make larger adjustments
    if ((feedbackCounts["too-light"] || 0) >= 2) {
      // Progressive overload - increase more if consistently too light
      const consistencyFactor = Math.min((feedbackCounts["too-light"] || 0) / 2, 1.5)
      weightedAdjustment = Math.round((currentWeight * 0.025 * consistencyFactor) / 2.5) * 2.5
    } else if ((feedbackCounts["too-heavy"] || 0) >= 2) {
      // Reduce more if consistently too heavy
      const consistencyFactor = Math.min((feedbackCounts["too-heavy"] || 0) / 2, 1.5)
      weightedAdjustment = -Math.round((currentWeight * 0.025 * consistencyFactor) / 2.5) * 2.5
    }

    // If we alternate between too light and too heavy, we're close to optimal - smaller adjustments
    if ((feedbackCounts["too-light"] || 0) > 0 && (feedbackCounts["too-heavy"] || 0) > 0) {
      // Calculate the ratio of too light vs too heavy to determine direction
      const lightRatio = (feedbackCounts["too-light"] || 0) / recentHistory.length
      const heavyRatio = (feedbackCounts["too-heavy"] || 0) / recentHistory.length

      if (Math.abs(lightRatio - heavyRatio) < 0.3) {
        // If the ratios are close, we're near optimal - make very small adjustments
        weightedAdjustment = Math.round((adjustment * 0.3) / 2.5) * 2.5
      } else {
        // Otherwise, favor the more frequent feedback but with reduced magnitude
        weightedAdjustment = Math.round((adjustment * 0.7) / 2.5) * 2.5
      }
    }

    // Add the weighted adjustment to the base adjustment
    adjustment += weightedAdjustment
  }

  // Round to nearest 2.5kg/5lb for practical purposes
  const adjustedWeight = Math.round((currentWeight + adjustment) / 2.5) * 2.5

  // Don't let weight go below 2.5kg
  return Math.max(2.5, adjustedWeight)
}

// Function to adjust rest time based on feedback using ML-like approach
export function adjustRestTime(
  currentRestTime: number,
  feedback: "too-short" | "too-long" | "just-right" | "too-easy" | "too-hard",
  exerciseHistory: (SetFeedback | ExerciseFeedback)[] = [],
): number {
  // Basic adjustment based on immediate feedback
  let adjustment = 0

  if (feedback === "too-short" || feedback === "too-hard") {
    // If rest is too short or exercise too hard, increase rest time
    adjustment = Math.max(10, Math.round(currentRestTime * 0.15))
  } else if (feedback === "too-long" || feedback === "too-easy") {
    // If rest is too long or exercise too easy, decrease rest time
    adjustment = -Math.max(5, Math.round(currentRestTime * 0.1))
  }

  // "Just right" gets no immediate adjustment

  // If we have exercise history, do more sophisticated ML-like adjustments
  if (exerciseHistory.length >= 3) {
    // Get last 5 instances of rest/difficulty feedback for this exercise
    const recentHistory = exerciseHistory
      .filter(
        (item) => ("type" in item && (item.type === "rest" || item.type === "difficulty")) || "difficulty" in item,
      )
      .sort((a, b) => {
        const dateA = new Date("date" in a ? a.date : "2000-01-01").getTime()
        const dateB = new Date("date" in b ? b.date : "2000-01-01").getTime()
        return dateB - dateA
      })
      .slice(0, 5)

    // Count occurrences of each feedback type
    const feedbackCounts: Record<string, number> = {}

    recentHistory.forEach((feedback) => {
      if ("type" in feedback) {
        if (feedback.type === "rest") {
          feedbackCounts[feedback.value] = (feedbackCounts[feedback.value] || 0) + 1
        } else if (feedback.type === "difficulty") {
          // Map difficulty to rest time adjustment
          if (feedback.value === "too-hard") {
            feedbackCounts["too-short"] = (feedbackCounts["too-short"] || 0) + 0.7
          } else if (feedback.value === "too-easy") {
            feedbackCounts["too-long"] = (feedbackCounts["too-long"] || 0) + 0.7
          }
        }
      } else if ("difficulty" in feedback) {
        // Map difficulty to rest time adjustment
        if (feedback.difficulty === "too-hard") {
          feedbackCounts["too-short"] = (feedbackCounts["too-short"] || 0) + 0.5
        } else if (feedback.difficulty === "too-easy") {
          feedbackCounts["too-long"] = (feedbackCounts["too-long"] || 0) + 0.5
        }
      }
    })

    // Calculate a weighted adjustment based on feedback patterns
    let weightedAdjustment = 0

    // If consistent feedback, make larger adjustments
    if ((feedbackCounts["too-short"] || 0) >= 1.5) {
      // Increase rest time more if consistently too short
      const consistencyFactor = Math.min((feedbackCounts["too-short"] || 0) / 1.5, 1.5)
      weightedAdjustment = Math.round(currentRestTime * 0.07 * consistencyFactor)
    } else if ((feedbackCounts["too-long"] || 0) >= 1.5) {
      // Decrease rest time more if consistently too long
      const consistencyFactor = Math.min((feedbackCounts["too-long"] || 0) / 1.5, 1.5)
      weightedAdjustment = -Math.round(currentRestTime * 0.05 * consistencyFactor)
    }

    // If we have mixed feedback, make more nuanced adjustments
    if ((feedbackCounts["too-short"] || 0) > 0 && (feedbackCounts["too-long"] || 0) > 0) {
      // Calculate the ratio of too short vs too long to determine direction
      const shortRatio =
        (feedbackCounts["too-short"] || 0) / ((feedbackCounts["too-short"] || 0) + (feedbackCounts["too-long"] || 0))

      if (Math.abs(shortRatio - 0.5) < 0.2) {
        // If the ratios are close to 50/50, we're near optimal - make very small adjustments
        weightedAdjustment = Math.round(adjustment * 0.3)
      } else if (shortRatio > 0.5) {
        // More "too short" feedback - increase rest time but with reduced magnitude
        weightedAdjustment = Math.round(Math.abs(adjustment) * 0.6 * (shortRatio * 1.5))
      } else {
        // More "too long" feedback - decrease rest time but with reduced magnitude
        weightedAdjustment = -Math.round(Math.abs(adjustment) * 0.6 * ((1 - shortRatio) * 1.5))
      }
    }

    // Add the weighted adjustment to the base adjustment
    adjustment += weightedAdjustment
  }

  // Don't let rest time go below 15 seconds or above 5 minutes
  const minRestTime = 15
  const maxRestTime = 300

  return Math.min(maxRestTime, Math.max(minRestTime, currentRestTime + adjustment))
}

// Function to convert seconds to a readable format (e.g. "90 sec" or "2 min")
export function formatRestTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sec`
  } else {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (remainingSeconds === 0) {
      return `${minutes} min`
    } else {
      return `${minutes} min ${remainingSeconds} sec`
    }
  }
}

// Function to parse rest time string to seconds
export function parseRestTime(restTime: string): number {
  if (restTime.includes("min")) {
    // Check if it includes seconds as well
    if (restTime.includes("sec")) {
      const parts = restTime.split(" ")
      const minutes = Number.parseInt(parts[0])
      const seconds = Number.parseInt(parts[2])
      return minutes * 60 + seconds
    } else {
      const minutes = Number.parseInt(restTime)
      return minutes * 60
    }
  } else {
    return Number.parseInt(restTime)
  }
}

// Function to parse weight string to number (e.g. "80 kg" to 80)
export function parseWeight(weightStr: string): number {
  if (!weightStr) return 0
  return Number.parseInt(weightStr)
}

// Function to format weight (e.g. 80 to "80 kg")
export function formatWeight(weight: number): string {
  return `${weight} kg`
}

