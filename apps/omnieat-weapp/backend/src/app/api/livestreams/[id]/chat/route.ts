import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const liveStreamId = params.id

    const messages = await prisma.chatMessage.findMany({
      where: { liveStreamId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 100
    })

    return NextResponse.json(messages)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const liveStreamId = params.id
    const { userId, text } = await request.json()

    if (!userId || !text) {
      return NextResponse.json(
        { error: 'Required fields: userId, text' },
        { status: 400 }
      )
    }

    const message = await prisma.chatMessage.create({
      data: {
        liveStreamId,
        userId,
        text
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
