import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { recipes: true }
        }
      }
    })

    // Auto-seed default categories - adds missing ones without deleting existing data
    const allCategories = [
      { name: 'Soup', icon: '🍜' },
      { name: 'Grill', icon: '🍖' },
      { name: 'Dessert', icon: '🍰' },
      { name: 'Salad', icon: '🥗' },
      { name: 'Drink', icon: '🍹' },
      { name: 'Breakfast', icon: '🍳' },
      { name: 'Pasta', icon: '🍝' },
      { name: 'Pizza', icon: '🍕' },
      { name: 'Burger', icon: '🍔' },
      { name: 'Sushi', icon: '🍣' },
      { name: 'Curry', icon: '🍛' },
      { name: 'Seafood', icon: '🦐' },
      { name: 'Vegan', icon: '🥑' },
      { name: 'Snack', icon: '🍿' },
      { name: 'Bakery', icon: '🥐' }
    ]

    const existingNames = new Set(categories.map(c => c.name))
    const missing = allCategories.filter(c => !existingNames.has(c.name))

    if (missing.length > 0) {
      await prisma.category.createMany({ data: missing })
      // Refresh the list
      categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { recipes: true }
          }
        }
      })
    }

    return NextResponse.json(categories)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
