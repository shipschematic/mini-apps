import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id
    const { userId, rating, text } = await request.json()

    if (!userId || !rating || !text) {
      return NextResponse.json(
        { error: 'Required fields: userId, rating, text' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        text,
        userId,
        recipeId
      },
      include: {
        user: { select: { name: true, avatar: true } }
      }
    })

    // Re-calculate aggregate average rating
    const allReviews = await prisma.review.findMany({
      where: { recipeId }
    })

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
    const avgRating = allReviews.length > 0 ? totalRating / allReviews.length : 0

    // Update recipe model
    await prisma.recipe.update({
      where: { id: recipeId },
      data: { rating: avgRating }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
