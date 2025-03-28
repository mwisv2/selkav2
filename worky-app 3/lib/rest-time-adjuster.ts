type ExerciseFeedback = {
  exerciseName: string
  difficulty: "too-easy" | "just-right" | "too-hard"
  restTime: number // in seconds
  date: string
}

// Function to adjust rest time based on feedback
export function adjustRestTime(
  currentRestTime: number,
  feedback: "too-easy" | "just-right" | "too-hard",
  exerciseHistory: ExerciseFeedback[] = [],
): number {
  // Basic adjustment based on immediate feedback
  let adjustment = 0

  if (feedback === "too-easy") {
    // If it's too easy, decrease rest time
    adjustment = -Math.max(5, Math.round(currentRestTime * 0.1))
  } else if (feedback === "too-hard") {
    // If it's too hard, increase rest time
    adjustment = Math.max(10, Math.round(currentRestTime * 0.15))
  }

  // "Just right" gets no immediate adjustment

  // If we have exercise history, do more sophisticated adjustments
  if (exerciseHistory.length >= 3) {
    // Get last 3 instances of this specific exercise
    const recentHistory = exerciseHistory.slice(-3)

    // Count occurrences of each feedback type
    const feedbackCounts = recentHistory.reduce(
      (counts, feedback) => {
        counts[feedback.difficulty] = (counts[feedback.difficulty] || 0) + 1
        return counts
      },
      {} as Record<string, number>,
    )

    // If consistent feedback, make larger adjustments
    if (feedbackCounts["too-easy"] >= 2) {
      adjustment -= Math.round(currentRestTime * 0.05)
    } else if (feedbackCounts["too-hard"] >= 2) {
      adjustment += Math.round(currentRestTime * 0.07)
    }

    // If we alternate between too easy and too hard, we're close to optimal - smaller adjustments
    if (feedbackCounts["too-easy"] && feedbackCounts["too-hard"]) {
      adjustment = Math.round(adjustment * 0.5)
    }
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

