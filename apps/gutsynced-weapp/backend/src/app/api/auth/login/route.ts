import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/db'
import { loginSchema } from '@/lib/validations'

const JWT_SECRET = process.env.JWT_SECRET || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Login attempt:', { email: body.email, hasPassword: !!body.password })
    
    // Validate input with Zod
    const validation = loginSchema.safeParse(body)
    
    if (!validation.success) {
      console.log('Validation failed:', validation.error.issues)
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }
    
    const { email, password } = validation.data

    console.log('Looking up user:', email)
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log('User found:', !!user)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('User has password:', !!user.passwordHash)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('Comparing passwords...')
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    console.log('Password match:', isMatch)

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('Login successful for:', email)
    return NextResponse.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        region: user.region
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
