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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PUBLISHED'

    const recipes = await prisma.recipe.findMany({
      where: {
        creatorId: userId,
        status: status
      },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(recipes)
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
    const userId = decoded.userId

    const body = await request.json()
    const {
      title,
      subtitle,
      estimatedTime,
      quantity,
      imageUrl,
      categoryId,
      ingredients,
      steps,
      status = 'DRAFT'
    } = body

    const recipe = await prisma.recipe.create({
      data: {
        title,
        subtitle,
        estimatedTime,
        quantity,
        imageUrl,
        categoryId,
        ingredients: JSON.stringify(ingredients || []),
        steps: JSON.stringify(steps || []),
        status,
        creatorId: userId,
        authorName: decoded.name || 'Anonymous'
      },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
