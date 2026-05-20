import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      )
    }

    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    if (user.verificationExpires && new Date() > user.verificationExpires) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null
      }
    })

    return NextResponse.json(
      { 
        message: 'Email verified successfully',
        verified: true
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
