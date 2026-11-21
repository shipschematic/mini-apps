import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id
    const comments = await prisma.comment.findMany({
      where: { recipeId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(comments)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id
    const { userId, text } = await request.json()

    if (!userId || !text) {
      return NextResponse.json(
        { error: 'Required fields: userId, text' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        recipeId
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
