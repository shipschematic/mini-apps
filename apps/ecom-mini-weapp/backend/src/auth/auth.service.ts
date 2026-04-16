import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WechatService } from '../wechat/wechat.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private wechatService: WechatService
  ) {}

  async wechatLogin(code: string) {
    const tokenData = await this.wechatService.getAccessToken(code)
    const userInfo = await this.wechatService.getUserInfo(
      tokenData.access_token,
      tokenData.openid
    )

    const user = {
      id: tokenData.openid,
      name: userInfo.nickname,
      avatar: userInfo.headimgurl,
      role: 'customer',
    }

    const accessToken = this.jwtService.sign({ sub: user.id, ...user })
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' }
    )

    return {
      token: accessToken,
      refreshToken,
      user,
    }
  }

  async adminLogin(username: string, password: string) {
    if (username === 'admin' && password === 'REMOVED_DEFAULT_PASSWORD') {
      const user = {
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
      }

      const accessToken = this.jwtService.sign({ sub: user.id, ...user })
      const refreshToken = this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      )

      return {
        token: accessToken,
        refreshToken,
        user,
      }
    }

    throw new UnauthorizedException('Invalid credentials')
  }

  async validateUser(userId: string) {
    return { id: userId }
  }

  async refreshToken(userId: string) {
    const accessToken = this.jwtService.sign({ sub: userId })
    return { token: accessToken }
  }
}
