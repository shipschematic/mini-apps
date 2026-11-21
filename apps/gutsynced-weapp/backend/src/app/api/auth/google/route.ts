import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || ''

// Google OAuth client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code required' },
        { status: 400 }
      )
    }
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    
    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const userInfo = await oauth2.userinfo.get()
    const { email, name, picture } = userInfo.data
    const googleId = userInfo.data.id
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email not provided by Google' },
        { status: 400 }
      )
    }
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId }
        })
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          avatar: picture || null,
          googleId,
          authProvider: 'google',
          region: 'EN',
          emailVerified: true // Google emails are verified
        }
      })
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Redirect to app with token
    const redirectUrl = new URL(process.env.APP_URL || 'http://localhost:10080')
    redirectUrl.searchParams.set('token', token)
    redirectUrl.searchParams.set('auth', 'success')
    
    return NextResponse.redirect(redirectUrl)
  } catch (error: any) {
    console.error('Google OAuth error:', error)
    return NextResponse.json(
      { error: error.message || 'Google authentication failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token required' },
        { status: 400 }
      )
    }
    
    // Verify token with Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    
    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: 'Invalid token or missing email' },
        { status: 400 }
      )
    }
    
    const { sub: googleId, email, name, picture } = payload
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId }
        })
      }
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          avatar: picture || null,
          googleId,
          authProvider: 'google',
          region: 'EN',
          emailVerified: true
        }
      })
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    return NextResponse.json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        region: user.region,
        authProvider: user.authProvider
      }
    })
  } catch (error: any) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: error.message || 'Google authentication failed' },
      { status: 500 }
    )
  }
}
