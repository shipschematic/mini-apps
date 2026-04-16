import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('wechat/login')
  async wechatLogin(@Body('code') code: string) {
    return await this.authService.wechatLogin(code)
  }

  @Post('admin/login')
  async adminLogin(@Body() body: { username: string; password: string }) {
    return await this.authService.adminLogin(body.username, body.password)
  }

  @Post('refresh')
  async refreshToken(@Body('userId') userId: string) {
    return await this.authService.refreshToken(userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getCurrentUser(@Req() req: any) {
    return req.user
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout() {
    return { success: true, message: 'Logged out successfully' }
  }
}
