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
    console.log('Saved GET - userId:', userId)

    const { searchParams } = new URL(request.url)
    const idsOnly = searchParams.get('ids') === 'true'

    if (idsOnly) {
      const saved = await prisma.saved.findMany({
        where: { userId },
        select: { recipeId: true }
      })
      console.log('Saved GET (ids) - count:', saved.length)
      return NextResponse.json(saved.map((s: any) => s.recipeId))
    }

    const saved = await prisma.saved.findMany({
      where: { userId },
      include: { recipe: { include: { category: true, creator: { select: { name: true, avatar: true } } } } }
    })
    console.log('Saved GET (full) - count:', saved.length, 'data:', JSON.stringify(saved, null, 2))
    return NextResponse.json(saved)
  } catch (e: any) {
    console.error('Saved GET error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
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
    
    const { recipeId } = await request.json()
    console.log('Saved POST - userId:', userId, 'recipeId:', recipeId)
    
    const saved = await prisma.saved.create({ data: { userId, recipeId } })
    console.log('Saved POST - created:', saved)
    return NextResponse.json(saved, { status: 201 })
  } catch (e: any) {
    console.error('Saved POST error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
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
    
    const { recipeId } = await request.json()
    await prisma.saved.deleteMany({ where: { userId, recipeId } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Saved DELETE error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
