"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { generateHWID } from "@/lib/hwid"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is already authenticated
      const isAuthenticated = document.cookie.includes("selkaUserAuthenticated=true")
      const licenseData = localStorage.getItem("selkaLicense")

      if (isAuthenticated && licenseData) {
        try {
          // Verify HWID matches current device
          const parsedLicense = JSON.parse(licenseData)
          const currentHWID = await generateHWID()

          if (parsedLicense.hwid === currentHWID) {
            // HWID matches, redirect to dashboard
            router.push("/dashboard")
          }
        } catch (e) {
          console.error("Error parsing license data", e)
        }
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Selka</h1>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/onboarding/step-1">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
        <div className="mt-8 flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

