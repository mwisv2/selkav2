import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateWorkouts = () => {
  return []
}

// Add this function to the utils.ts file
export function generateHWID(): string {
  const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`
  const browserInfo = navigator.userAgent
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = navigator.language
  const cores = navigator.hardwareConcurrency || 1

  // Combine various hardware/browser characteristics
  const hwidSource = `${screenInfo}-${browserInfo}-${timeZone}-${language}-${cores}`

  // Create a simple hash of the source string
  let hash = 0
  for (let i = 0; i < hwidSource.length; i++) {
    const char = hwidSource.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return hash.toString(16) // Convert to hex string
}

// Add this function to check authentication
export function checkAuth(): { isAuthenticated: boolean; hwidValid: boolean } {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, hwidValid: false }
  }

  const isAuthenticated = document.cookie.includes("selkaUserAuthenticated=true")
  const licenseData = localStorage.getItem("selkaLicense")

  if (!isAuthenticated || !licenseData) {
    return { isAuthenticated: false, hwidValid: false }
  }

  try {
    const parsedLicense = JSON.parse(licenseData)
    const currentHWID = generateHWID()

    return {
      isAuthenticated: true,
      hwidValid: parsedLicense.hwid === currentHWID,
    }
  } catch (e) {
    console.error("Error parsing license data", e)
    return { isAuthenticated: false, hwidValid: false }
  }
}

