import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'dapoer_super_secret_jwt_key_123'

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url)
    const recipeId = pathname.split('/').pop()

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, avatar: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json(recipe)
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

    const { pathname } = new URL(request.url)
    const recipeId = pathname.split('/').pop()

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
    }

    // Verify ownership
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId }
    })

    if (!existingRecipe || existingRecipe.creatorId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

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
      status
    } = body

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        ...(estimatedTime && { estimatedTime }),
        ...(quantity && { quantity }),
        ...(imageUrl && { imageUrl }),
        ...(categoryId && { categoryId }),
        ...(ingredients && { ingredients: JSON.stringify(ingredients) }),
        ...(steps && { steps: JSON.stringify(steps) }),
        ...(status && { status })
      },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json(updatedRecipe)
  } catch (error: any) {
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
    const userId = decoded.userId

    const { pathname } = new URL(request.url)
    const recipeId = pathname.split('/').pop()

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
    }

    // Verify ownership
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId }
    })

    if (!existingRecipe || existingRecipe.creatorId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.recipe.delete({
      where: { id: recipeId }
    })

    return NextResponse.json({ success: true, message: 'Recipe deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
