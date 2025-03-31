"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateHWID, getStoredHWID, storeHWID } from "@/lib/hwid"
import { toast } from "sonner"

export default function Step1Page() {
  const [key, setKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get or generate HWID
      let hwid = await getStoredHWID()
      if (!hwid) {
        hwid = await generateHWID()
        await storeHWID(hwid)
      }

      // Verify key with HWID
      const response = await fetch("/api/verifyKey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, hwid }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify key")
      }

      // Store license data
      const licenseData = {
        key,
        hwid,
        isActive: true,
        expiresAt: data.expiresAt,
        workoutData: data.workoutData
      }

      // Set license data cookie
      document.cookie = `licenseData=${JSON.stringify(licenseData)}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
      localStorage.setItem("licenseData", JSON.stringify(licenseData))

      // Set authentication cookie
      document.cookie = `selkaUserAuthenticated=true; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

      // Show success message
      toast.success("Access key verified successfully!")

      // Redirect to step-2
      router.push("/onboarding/step-2")
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Failed to verify key")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-lg mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Enter Access Key</h1>
          <p className="text-muted-foreground">
            Please enter your access key to continue. This key will be locked to your device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your access key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  )
}

