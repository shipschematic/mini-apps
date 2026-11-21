import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || ''
const WECHAT_APP_ID = process.env.WECHAT_APP_ID
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // Can be used for region or redirect
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code required' },
        { status: 400 }
      )
    }
    
    // Exchange code for access token and openid
    const tokenResponse = await fetch(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`
    )
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get WeChat access token')
    }
    
    const tokenData = await tokenResponse.json()
    const { access_token, openid, refresh_token } = tokenData
    
    if (!access_token || !openid) {
      return NextResponse.json(
        { error: 'Invalid WeChat token response' },
        { status: 500 }
      )
    }
    
    // Get user info from WeChat
    const userResponse = await fetch(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    )
    
    if (!userResponse.ok) {
      throw new Error('Failed to get WeChat user info')
    }
    
    const userData = await userResponse.json()
    const { openid: wechatOpenid, nickname, headimgurl: avatar, unionid } = userData
    
    // Check if user exists by WeChat openid
    let user = await prisma.user.findUnique({
      where: { wechatOpenid }
    })
    
    if (user) {
      // Update last login
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          refreshToken: refresh_token
        }
      })
    } else {
      // Check if user exists by unionid (if available)
      if (unionid) {
        user = await prisma.user.findFirst({
          where: { wechatOpenid: unionid }
        })
        
        if (user) {
          // Link WeChat to existing account
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              wechatOpenid,
              authProvider: 'wechat',
              lastLogin: new Date(),
              refreshToken: refresh_token
            }
          })
        }
      }
      
      // Create new user if still not found
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `wechat_${openid}`,
            name: nickname || `User_${openid.substring(0, 8)}`,
            avatar: avatar || null,
            wechatOpenid,
            authProvider: 'wechat',
            region: 'CN',
            emailVerified: true,
            refreshToken: refresh_token
          }
        })
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email || wechatOpenid, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    // Redirect to app with token
    const redirectUrl = new URL(process.env.APP_URL || 'http://localhost:10080')
    redirectUrl.searchParams.set('token', token)
    redirectUrl.searchParams.set('auth', 'success')
    
    return NextResponse.redirect(redirectUrl)
  } catch (error: any) {
    console.error('WeChat OAuth error:', error)
    return NextResponse.json(
      { error: error.message || 'WeChat authentication failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code required' },
        { status: 400 }
      )
    }
    
    // Exchange code for access token and openid
    const tokenResponse = await fetch(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`
    )
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get WeChat access token')
    }
    
    const tokenData = await tokenResponse.json()
    const { access_token, openid, refresh_token } = tokenData
    
    if (!access_token || !openid) {
      return NextResponse.json(
        { error: 'Invalid WeChat token response' },
        { status: 500 }
      )
    }
    
    // Get user info
    const userResponse = await fetch(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    )
    
    if (!userResponse.ok) {
      throw new Error('Failed to get WeChat user info')
    }
    
    const userData = await userResponse.json()
    const { nickname, headimgurl: avatar, unionid } = userData
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { wechatOpenid: openid }
    })
    
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          refreshToken: refresh_token
        }
      })
    } else {
      // Check by unionid
      if (unionid) {
        user = await prisma.user.findFirst({
          where: { wechatOpenid: unionid }
        })
        
        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              wechatOpenid: openid,
              authProvider: 'wechat',
              lastLogin: new Date(),
              refreshToken: refresh_token
            }
          })
        }
      }
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `wechat_${openid}`, // Use openid as pseudo-email
            name: nickname || `User_${openid.substring(0, 8)}`,
            avatar: avatar || null,
            wechatOpenid: openid,
            authProvider: 'wechat',
            region: 'CN',
            emailVerified: true,
            refreshToken: refresh_token
          }
        })
      }
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email || openid, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    return NextResponse.json({
      message: 'WeChat login successful',
      token,
      user: {
        id: user.id,
        email: user.email || openid,
        name: user.name,
        avatar: user.avatar,
        region: user.region,
        authProvider: user.authProvider
      }
    })
  } catch (error: any) {
    console.error('WeChat auth error:', error)
    return NextResponse.json(
      { error: error.message || 'WeChat authentication failed' },
      { status: 500 }
    )
  }
}
