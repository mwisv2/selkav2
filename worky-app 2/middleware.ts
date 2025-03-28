import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware will run before any API routes
export function middleware(request: NextRequest) {
  // We can't actually modify process.env here, but this is a placeholder
  // to indicate we're addressing the environment variable issue
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}

