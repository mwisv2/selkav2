"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Step1() {
  const router = useRouter()
  const [licenseKey, setLicenseKey] = useState("")
  const [error, setError] = useState("")

  // Predefined license keys
  const validLicenseKeys = [
    "SELKA-1234-5678-90AB",
    "SELKA-2345-6789-01BC",
    "SELKA-3456-7890-12CD",
    "SELKA-4567-8901-23DE",
    "SELKA-5678-9012-34EF",
  ]

  const handleNext = () => {
    // Check if license key is valid
    if (validLicenseKeys.includes(licenseKey)) {
      // Generate a simple HWID (in a real app, this would be more secure)
      const hwid = `${navigator.userAgent}-${window.screen.width}x${window.screen.height}`

      // Save license key and HWID to localStorage
      const licenseData = {
        key: licenseKey,
        hwid,
        activationDate: new Date().toISOString(),
      }

      localStorage.setItem("selkaLicense", JSON.stringify(licenseData))

      // Create initial user profile
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          licenseKey,
        }),
      )

      // Set a cookie to remember user (in a real app, would use proper cookie management)
      document.cookie = "selkaUserAuthenticated=true; path=/; max-age=31536000" // 1 year

      router.push("/onboarding/step-2")
    } else {
      setError("Invalid license key. Please try again.")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Activate Selka</CardTitle>
        <Progress value={6.25} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="licenseKey">License Key</Label>
          <Input
            id="licenseKey"
            placeholder="SELKA-XXXX-XXXX-XXXX"
            value={licenseKey}
            onChange={(e) => {
              setLicenseKey(e.target.value)
              setError("")
            }}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-xs text-muted-foreground mt-1">Enter your license key to activate Selka</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!licenseKey}>
          Activate
        </Button>
      </CardFooter>
    </Card>
  )
}

