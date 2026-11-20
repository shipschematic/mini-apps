import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/db'
import { registerSchema } from '@/lib/validations'

const JWT_SECRET = process.env.JWT_SECRET || 'dapoer_super_secret_jwt_key_123'

function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input with Zod
    const validation = registerSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }
    
    const { email, password, name, avatar, region = 'EN', authProvider = 'email' } = validation.data

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const code = generateVerificationCode()
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop',
        region,
        authProvider,
        verificationCode: code,
        verificationExpires: expires
      }
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log(`Verification code for ${email}: ${code}`)

    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          avatar: user.avatar,
          emailVerified: false,
          region: user.region
        },
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
