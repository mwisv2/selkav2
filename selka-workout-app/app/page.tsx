import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Selka</h1>
            <p className="text-muted-foreground">AI-powered workouts tailored to your goals</p>
          </div>

          <div className="flex flex-col space-y-4">
            <Link href="/onboarding/step-1" passHref>
              <Button size="lg" className="w-full">
                Get Started
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button variant="outline" size="lg" className="w-full">
                Login
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Personalized workouts based on your goals, equipment, and schedule</p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}

