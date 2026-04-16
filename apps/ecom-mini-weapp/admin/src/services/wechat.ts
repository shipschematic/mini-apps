import api from './api'

export const wechatService = {
  getOAuthUrl(redirectUri: string): string {
    const appId = import.meta.env.VITE_WECHAT_APP_ID
    const encodedRedirect = encodeURIComponent(redirectUri)
    return `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${encodedRedirect}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`
  },

  async handleOAuthCallback(code: string): Promise<{ token: string; user: any }> {
    const response = await api.post('/auth/wechat/callback', { code })
    return response.data
  },

  async createPayment(orderId: string): Promise<{
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
  }> {
    const response = await api.post('/wechat/pay/create', { orderId })
    return response.data
  },

  async queryPayment(orderId: string): Promise<{
    status: string
    transactionId?: string
  }> {
    const response = await api.get(`/wechat/pay/query/${orderId}`)
    return response.data
  },

  async refund(orderId: string, reason: string): Promise<{
    refundId: string
    status: string
  }> {
    const response = await api.post('/wechat/pay/refund', { orderId, reason })
    return response.data
  },
}
