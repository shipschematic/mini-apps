import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, name, email, bio, avatar } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) {
      const emailExists = await prisma.user.findFirst({
        where: { 
          email,
          NOT: { id: userId }
        }
      })
      
      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }
      
      updateData.email = email
      updateData.emailVerified = false
      updateData.verificationCode = generateVerificationCode()
      updateData.verificationExpires = new Date(Date.now() + 10 * 60 * 1000)
    }
    if (bio !== undefined) updateData.bio = bio
    if (avatar !== undefined) updateData.avatar = avatar

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        emailVerified: true,
        createdAt: true
      }
    })

    return NextResponse.json({ 
      user: updatedUser,
      requiresVerification: email !== undefined
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
