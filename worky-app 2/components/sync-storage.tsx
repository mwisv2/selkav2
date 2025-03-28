"use client"

import { useEffect } from "react"

export function SyncStorage() {
  useEffect(() => {
    // Check if the user has a workout plan in localStorage
    const hasPlan = localStorage.getItem("worky-has-plan")

    // If the user has a plan, set a cookie
    if (hasPlan) {
      document.cookie = `worky-has-plan=true; max-age=${60 * 60 * 24 * 30}; path=/`
    }
  }, [])

  return null
}

