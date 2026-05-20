import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'dapoer_super_secret_jwt_key_123'

// GET /api/recipes/[id]/like - Check if current user liked this recipe
// POST /api/recipes/[id]/like - Like a recipe
// DELETE /api/recipes/[id]/like - Unlike a recipe

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const currentUserId = decoded.userId

    const { pathname } = new URL(request.url)
    const recipeId = pathname.split('/').reverse()[1]

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_recipeId: {
          userId: currentUserId,
          recipeId
        }
      }
    })

    const likeCount = await prisma.like.count({
      where: { recipeId }
    })

    return NextResponse.json({ 
      liked: !!like,
      count: likeCount
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const currentUserId = decoded.userId

    const { pathname } = new URL(request.url)
    const recipeId = pathname.split('/').reverse()[1]

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
    }

    const like = await prisma.like.create({
      data: {
        userId: currentUserId,
        recipeId
      }
    })

    const likeCount = await prisma.like.count({
      where: { recipeId }
    })

    return NextResponse.json({ 
      success: true, 
      like,
      count: likeCount
    }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already liked this recipe' }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const currentUserId = decoded.userId

    const { pathname } = new URL(request.url)
    const recipeId = pathname.split('/').reverse()[1]

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
    }

    await prisma.like.deleteMany({
      where: {
        userId: currentUserId,
        recipeId
      }
    })

    const likeCount = await prisma.like.count({
      where: { recipeId }
    })

    return NextResponse.json({ 
      success: true,
      count: likeCount
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
