import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    const jwt = await import('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'dapoer_super_secret_jwt_key_123'
    
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    
    const saved = await prisma.saved.findMany({
      where: { userId },
      include: { recipe: { include: { category: true, creator: { select: { name: true, avatar: true } } } } }
    })
    return NextResponse.json(saved)
  } catch (e: any) {
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
    const jwt = await import('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'dapoer_super_secret_jwt_key_123'
    
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    
    const { recipeId } = await request.json()
    const saved = await prisma.saved.create({ data: { userId, recipeId } })
    return NextResponse.json(saved, { status: 201 })
  } catch (e: any) {
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
    const jwt = await import('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'dapoer_super_secret_jwt_key_123'
    
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    
    const { recipeId } = await request.json()
    await prisma.saved.deleteMany({ where: { userId, recipeId } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
