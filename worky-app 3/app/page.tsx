import { HomeButtons } from "@/components/home-buttons"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 text-foreground">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto space-y-8 animate-fade-in">
          <div className="w-full flex flex-col items-center">
            <div className="mb-8 relative">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-3 py-2">
                Selka
              </h1>
              <span className="text-xs text-muted-foreground absolute bottom-2 left-full ml-1">made by capon</span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Your personalized workout plan based on your body, goals, and preferences.
          </p>
          <div className="pt-2 space-y-3">
            <HomeButtons />
          </div>
        </div>
      </main>
    </div>
  )
}

