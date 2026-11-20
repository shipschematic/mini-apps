import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'dapoer_super_secret_jwt_key_123'

export interface AuthUser {
  userId: string
  email: string
  name: string
}

export async function getCurrentUser(request: Request): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return null
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function requireAuth(request: Request): Promise<AuthUser | NextResponse> {
  const user = await getCurrentUser(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or expired token' },
      { status: 401 }
    )
  }
  
  return user
}

export function validateRequest(schema: any, data: any) {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0].message
    }
  }
  
  return {
    success: true,
    data: result.data
  }
}
