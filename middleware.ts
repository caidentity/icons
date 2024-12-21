import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log the request
  console.log('Request:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries())
  })

  // Continue to the next middleware or route handler
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/icons-metadata.json'
  ]
} 