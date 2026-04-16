import { Controller, Post, Get, Body, Param, Headers, Req } from '@nestjs/common'
import { WechatService } from './wechat.service'
import { Request } from 'express'

@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Post('pay/create')
  async createPayment(@Body() body: { orderId: string; amount: number; description: string; openid: string }) {
    const result = await this.wechatService.createJsapiOrder({
      orderId: body.orderId,
      amount: body.amount,
      description: body.description,
      openid: body.openid,
    })

    return {
      success: true,
      data: result,
    }
  }

  @Get('pay/query/:orderId')
  async queryPayment(@Param('orderId') orderId: string) {
    const result = await this.wechatService.queryOrder(orderId)

    return {
      success: true,
      data: result,
    }
  }

  @Post('pay/close/:orderId')
  async closePayment(@Param('orderId') orderId: string) {
    await this.wechatService.closeOrder(orderId)

    return {
      success: true,
      message: 'Order closed successfully',
    }
  }

  @Post('pay/refund')
  async refund(
    @Body() body: { orderId: string; refundId: string; total: number; refund: number; reason: string }
  ) {
    const result = await this.wechatService.refund(
      body.orderId,
      body.refundId,
      body.total,
      body.refund,
      body.reason
    )

    return {
      success: true,
      data: result,
    }
  }

  @Post('pay/callback')
  async handleCallback(
    @Headers('wechatpay-signature') signature: string,
    @Headers('wechatpay-timestamp') timestamp: string,
    @Headers('wechatpay-nonce') nonce: string,
    @Body() body: any
  ) {
    const isValid = this.wechatService.verifyCallback(signature, timestamp, nonce, JSON.stringify(body))

    if (!isValid) {
      return {
        code: 'FAIL',
        message: 'Invalid signature',
      }
    }

    return await this.wechatService.handlePaymentCallback(body)
  }

  @Get('oauth/callback')
  async handleOAuthCallback(@Body() body: { code: string }) {
    const tokenData = await this.wechatService.getAccessToken(body.code)
    const userInfo = await this.wechatService.getUserInfo(
      tokenData.access_token,
      tokenData.openid
    )

    return {
      success: true,
      data: {
        openid: tokenData.openid,
        userInfo,
      },
    }
  }
}
