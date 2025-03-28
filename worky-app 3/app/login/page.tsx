"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WorkInProgress() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>🔒 Locked 🔒</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Selka is currently locked. To read more about Selka, visit <a href="https://selka-info.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a></p>
        </CardContent>
      </Card>
    </div>
  )
}

