import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has('selkaUserAuthenticated')
  const licenseData = request.cookies.get('licenseData')?.value
  const parsedLicenseData = licenseData ? JSON.parse(licenseData) : null
  const isOnboardingCompleted = parsedLicenseData?.workoutData?.onboardingCompleted

  // State 1: Uncomplete (no key activated)
  const uncompletePaths = ['/', '/login', '/onboarding/step-1']
  if (uncompletePaths.includes(pathname)) {
    // If user has a valid key, redirect to step-2
    if (isAuthenticated && licenseData) {
      return NextResponse.redirect(new URL('/onboarding/step-2', request.url))
    }
    return NextResponse.next()
  }

  // If not authenticated or no license data, redirect to login
  if (!isAuthenticated || !licenseData) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // State 2: Completing (key activated but onboarding not finished)
  if (!isOnboardingCompleted) {
    // Only allow access to onboarding steps 2-13
    const isOnboardingStep = /^\/onboarding\/step-(?:[2-9]|1[0-3])$/.test(pathname)
    if (!isOnboardingStep) {
      // If trying to access any other page, redirect to step-2
      return NextResponse.redirect(new URL('/onboarding/step-2', request.url))
    }
  } 
  // State 3: Complete (onboarding finished)
  else {
    // Block access to all onboarding steps and uncomplete paths
    const isOnboardingStep = /^\/onboarding\/step-(?:[1-9]|1[0-3])$/.test(pathname)
    const isUncompletePath = uncompletePaths.includes(pathname)
    if (isOnboardingStep || isUncompletePath) {
      // If trying to access onboarding steps or uncomplete paths, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 