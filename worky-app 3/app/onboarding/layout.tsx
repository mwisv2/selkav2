import type React from "react"
import { ProgressBar } from "@/components/progress-bar"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ProgressBar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </main>
    </div>
  )
}

