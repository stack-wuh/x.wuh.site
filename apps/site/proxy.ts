import { NextResponse, type NextRequest } from 'next/server'

const ANON_COOKIE_NAME = 'anonId'
const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function appendCookie(cookieHeader: string | null, name: string, value: string) {
  const cookie = `${name}=${encodeURIComponent(value)}`
  return cookieHeader ? `${cookieHeader}; ${cookie}` : cookie
}

export function proxy(request: NextRequest) {
  const existingAnonId = request.cookies.get(ANON_COOKIE_NAME)?.value
  if (existingAnonId) {
    return NextResponse.next()
  }

  const anonId = crypto.randomUUID()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('cookie', appendCookie(request.headers.get('cookie'), ANON_COOKIE_NAME, anonId))

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.cookies.set(ANON_COOKIE_NAME, anonId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ANON_COOKIE_MAX_AGE,
    path: '/',
  })

  return response
}

export const config = {
  matcher: ['/post/:path*', '/api/content/:path*'],
}
