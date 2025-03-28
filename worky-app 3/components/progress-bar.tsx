"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const steps = [
  "/onboarding/height",
  "/onboarding/weight",
  "/onboarding/age",
  "/onboarding/fitness-level",
  "/onboarding/workout-frequency", // Added workout frequency page
  "/onboarding/workout-duration",
  "/onboarding/equipment",
  "/onboarding/workout-split",
  "/onboarding/bench-press",
  "/onboarding/squat",
  "/onboarding/deadlift",
  "/onboarding/weight-goal",
  "/onboarding/time-frame",
  "/onboarding/muscle-groups",
  "/onboarding/focus-type",
]

export function ProgressBar() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const currentStepIndex = steps.indexOf(pathname)
    if (currentStepIndex !== -1) {
      setProgress(((currentStepIndex + 1) / steps.length) * 100)
    } else if (pathname === "/workout-plan") {
      setProgress(100)
    }
  }, [pathname])

  return (
    <div className="w-full h-2 bg-muted">
      <div className="h-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }} />
    </div>
  )
}

