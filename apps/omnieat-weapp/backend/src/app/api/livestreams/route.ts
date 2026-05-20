import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const where: any = {}
    if (status) {
      where.status = status
    }

    const livestreams = await prisma.liveStream.findMany({
      where,
      include: {
        host: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(livestreams)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, hostName, hostAvatar, imageUrl, status, scheduledAt, hostId } = body

    if (!title || !hostName) {
      return NextResponse.json(
        { error: 'Required fields: title, hostName' },
        { status: 400 }
      )
    }

    const livestream = await prisma.liveStream.create({
      data: {
        title,
        hostName,
        hostAvatar,
        imageUrl,
        status: status || 'UPCOMING',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        hostId
      }
    })

    return NextResponse.json(livestream, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
