import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import * as crypto from 'crypto'
import * as CryptoJS from 'crypto-js'

interface WechatPayConfig {
  appId: string
  mchId: string
  apiV3Key: string
  notifyUrl: string
}

interface PaymentOrder {
  orderId: string
  amount: number
  description: string
  openid: string
}

interface PaymentResult {
  prepayId: string
  codeUrl?: string
  h5Url?: string
  jsapiParams?: {
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
  }
}

@Injectable()
export class WechatService {
  private config: WechatPayConfig

  constructor(private configService: ConfigService) {
    this.config = {
      appId: this.configService.get('WECHAT_APP_ID') || '',
      mchId: this.configService.get('WECHAT_MCH_ID') || '',
      apiV3Key: this.configService.get('WECHAT_API_V3_KEY') || '',
      notifyUrl: this.configService.get('WECHAT_NOTIFY_URL') || '',
    }
  }

  private generateNonceStr(length = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private generateTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString()
  }

  private sign(params: any, key: string): string {
    const sortedParams = Object.keys(params)
      .filter((k) => params[k] !== undefined && params[k] !== '')
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&')

    const stringToSign = `${sortedParams}&key=${key}`
    return crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase()
  }

  private signV3(message: string, privateKey: string): string {
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(message)
    return sign.sign(privateKey, 'base64')
  }

  async createJsapiOrder(order: PaymentOrder): Promise<PaymentResult> {
    const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi'

    const params = {
      appid: this.config.appId,
      mchid: this.config.mchId,
      description: order.description,
      out_trade_no: order.orderId,
      notify_url: this.config.notifyUrl,
      amount: {
        total: Math.round(order.amount * 100),
        currency: 'CNY',
      },
      payer: {
        openid: order.openid,
      },
    }

    try {
      const response = await axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      const prepayId = response.data.prepay_id

      const jsapiParams = this.generateJsapiParams(prepayId)

      return {
        prepayId,
        jsapiParams,
      }
    } catch (error: any) {
      console.error('WeChat Pay create order error:', error.response?.data || error.message)
      throw new BadRequestException('Failed to create payment order')
    }
  }

  private generateJsapiParams(prepayId: string) {
    const timeStamp = this.generateTimestamp()
    const nonceStr = this.generateNonceStr()
    const packageStr = `prepay_id=${prepayId}`

    const message = `${this.config.appId}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`
    const paySign = this.signV3(message, this.config.apiV3Key)

    return {
      timeStamp,
      nonceStr,
      package: packageStr,
      signType: 'RSA',
      paySign,
    }
  }

  async queryOrder(orderId: string): Promise<any> {
    const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${orderId}?mchid=${this.config.mchId}`

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('WeChat Pay query order error:', error.response?.data || error.message)
      throw new BadRequestException('Failed to query order')
    }
  }

  async closeOrder(orderId: string): Promise<void> {
    const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${orderId}/close`

    try {
      await axios.post(url, { mchid: this.config.mchId }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error: any) {
      console.error('WeChat Pay close order error:', error.response?.data || error.message)
      throw new BadRequestException('Failed to close order')
    }
  }

  async refund(orderId: string, refundId: string, total: number, refund: number, reason: string): Promise<any> {
    const url = 'https://api.mch.weixin.qq.com/v3/refund/domestic/refunds'

    const params = {
      out_trade_no: orderId,
      out_refund_no: refundId,
      reason,
      amount: {
        total: Math.round(total * 100),
        refund: Math.round(refund * 100),
        currency: 'CNY',
      },
    }

    try {
      const response = await axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('WeChat Pay refund error:', error.response?.data || error.message)
      throw new BadRequestException('Failed to process refund')
    }
  }

  verifyCallback(signature: string, timestamp: string, nonce: string, body: string): boolean {
    const message = `${timestamp}\n${nonce}\n${body}\n`
    const expectedSignature = this.signV3(message, this.config.apiV3Key)
    return signature === expectedSignature
  }

  async handlePaymentCallback(body: any): Promise<{ code: string; message: string }> {
    const { resource } = body
    
    const decrypted = this.decryptCallback(resource)
    
    console.log('Payment callback:', decrypted)
    
    return {
      code: 'SUCCESS',
      message: '成功',
    }
  }

  private decryptCallback(resource: any): any {
    const { ciphertext, associated_data, nonce } = resource
    const key = CryptoJS.enc.Utf8.parse(this.config.apiV3Key)
    const iv = CryptoJS.enc.Utf8.parse(nonce)
    const authTag = CryptoJS.enc.Base64.parse(ciphertext.substring(ciphertext.length - 24))
    const data = CryptoJS.enc.Base64.parse(ciphertext.substring(0, ciphertext.length - 24))

    const decipher = CryptoJS.AES.decrypt(
      { ciphertext: data, salt: '' },
      key,
      {
        iv,
        mode: CryptoJS.mode.GCM,
        padding: CryptoJS.pad.NoPadding,
      }
    )

    return JSON.parse(decipher.toString(CryptoJS.enc.Utf8))
  }

  async getAccessToken(code: string): Promise<any> {
    const url = 'https://api.weixin.qq.com/sns/oauth2/access_token'
    
    try {
      const response = await axios.get(url, {
        params: {
          appid: this.config.appId,
          secret: this.configService.get('WECHAT_APP_SECRET'),
          code,
          grant_type: 'authorization_code',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('WeChat OAuth error:', error.response?.data || error.message)
      throw new BadRequestException('Failed to get access token')
    }
  }

  async getUserInfo(accessToken: string, openid: string): Promise<any> {
    const url = 'https://api.weixin.qq.com/sns/userinfo'
    
    try {
      const response = await axios.get(url, {
        params: {
          access_token: accessToken,
          openid,
        },
      })

      return response.data
    } catch (error: any) {
      console.error('WeChat get user info error:', error.response?.data || error.message)
      throw new BadRequestException('Failed to get user info')
    }
  }
}
