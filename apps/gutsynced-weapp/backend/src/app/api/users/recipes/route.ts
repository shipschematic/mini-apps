import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || ''

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
    const { title, subtitle, estimatedTime, quantity, imageUrl, categoryId, ingredients, steps, status = 'DRAFT' } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 })
    }
    if (title.trim().length > 100) {
      return NextResponse.json({ error: 'Recipe name must be 100 characters or less' }, { status: 400 })
    }

    if (subtitle && typeof subtitle === 'string' && subtitle.length > 500) {
      return NextResponse.json({ error: 'Description must be 500 characters or less' }, { status: 400 })
    }

    if (!estimatedTime || typeof estimatedTime !== 'string' || estimatedTime.trim().length === 0) {
      return NextResponse.json({ error: 'Cook time is required' }, { status: 400 })
    }
    const timeMatch = estimatedTime.match(/^(\d+)\s*(min|minute|hour|hr|h)?$/i)
    if (!timeMatch) {
      return NextResponse.json({ error: 'Invalid cook time format. Use: 30 min or 1 hour' }, { status: 400 })
    }

    if (!quantity || typeof quantity !== 'string' || quantity.trim().length === 0) {
      return NextResponse.json({ error: 'Servings is required' }, { status: 400 })
    }
    const servingMatch = quantity.match(/^(\d+)\s*(serving|serves?|person|people|p)?$/i)
    if (!servingMatch) {
      return NextResponse.json({ error: 'Invalid servings format. Use: 4 serves or 2 people' }, { status: 400 })
    }

    if (!categoryId) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }
    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 400 })
    }

    const filteredIngredients = Array.isArray(ingredients) ? ingredients.filter((i: any) => typeof i === 'string' && i.trim().length > 0) : []
    if (filteredIngredients.length === 0) {
      return NextResponse.json({ error: 'At least 1 ingredient with content is required' }, { status: 400 })
    }

    const filteredSteps = Array.isArray(steps) ? steps.filter((s: any) => typeof s === 'string' && s.trim().length > 0) : []
    if (filteredSteps.length === 0) {
      return NextResponse.json({ error: 'At least 1 step with content is required' }, { status: 400 })
    }

    const recipe = await prisma.recipe.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || `${decoded.name || 'Chef'}'s recipe`,
        estimatedTime: estimatedTime.trim(),
        quantity: quantity.trim(),
        imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
        categoryId,
        ingredients: JSON.stringify(filteredIngredients),
        steps: JSON.stringify(filteredSteps),
        status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
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
