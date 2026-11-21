import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:10080', 'http://localhost:3000', 'http://localhost:5000']

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

// Simple in-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 100 // requests per window

function checkRateLimit(ip: string): { limited: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(ip)
  
  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    })
    return { limited: false, remaining: RATE_LIMIT_MAX - 1 }
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { limited: true, remaining: 0 }
  }
  
  record.count++
  return { limited: false, remaining: RATE_LIMIT_MAX - record.count }
}

export function middleware(request: NextRequest) {
  // Get IP address
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // Check rate limit
  const rateLimitResult = checkRateLimit(ip)
  
  // CORS handling
  const origin = request.headers.get('origin') || ''
  const response = NextResponse.next()
  
  // Set CORS headers - allow all origins in development for WeChat Mini Program
  if (isDevelopment || allowedOrigins.includes(origin) || !origin || origin === '*') {
    response.headers.set('Access-Control-Allow-Origin', '*')
  } else {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Set rate limit headers
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString())
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response
  }
  
  // If rate limited, return error
  if (rateLimitResult.limited) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429 }
    )
  }
  
  // Skip authentication for public routes
  const publicRoutes = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/verify-email',
    '/api/auth/send-verification',
    '/api/categories',
    '/api/recipes',
    '/api/livestreams'
  ]
  
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  if (isPublicRoute) {
    return response
  }
  
  // Check authentication for protected routes
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized: No token provided' },
      { status: 401 }
    )
  }
  
  const token = authHeader.split(' ')[1]
  
  // Verify token (in a real app, you'd verify the JWT signature)
  // For now, we just check if token exists
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token format' },
      { status: 401 }
    )
  }
  
  // Add user info to request headers (decoded token would go here)
  response.headers.set('x-user-token', token)
  
  return response
}

export const config = {
  matcher: '/api/:path*'
}
