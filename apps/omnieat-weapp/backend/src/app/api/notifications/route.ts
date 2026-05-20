import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'dapoer_super_secret_jwt_key_123'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(notifications)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, type, title, message, recipeId, actorId } = await request.json()

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Required fields: userId, type, title, message' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        recipeId,
        actorId
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const { id } = await request.json()

    if (id) {
      await prisma.notification.updateMany({
        where: { id, userId },
        data: { read: true }
      })
    } else {
      await prisma.notification.updateMany({
        where: { userId },
        data: { read: true }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
