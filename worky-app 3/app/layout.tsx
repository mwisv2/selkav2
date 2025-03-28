import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SyncStorage } from "@/components/sync-storage"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Worky - Personalized Workout Plans",
  description: "Create personalized workout plans based on your body, goals, and preferences.",
  metadataBase: new URL("https://worky-app.vercel.app"),
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload audio for timer alerts */}
        <link
          rel="preload"
          href="https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
          as="audio"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SyncStorage />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'