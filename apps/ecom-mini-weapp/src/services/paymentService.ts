import Taro from '@tarojs/taro'
import { store } from '../store'

/**
 * Payment Service - WeChat Cloud Pay Integration
 * 
 * Uses cloud.pay.unifiedOrder for secure, certificate-free payment.
 * No need to manage certificates or calculate signatures - cloud handles it.
 * 
 * Setup required (one-time, in WeChat DevTools / Cloud Console):
 * 1. 云开发控制台 -> 设置 -> 全局设置 -> 微信支付配置
 * 2. Bind your merchant ID (mchId)
 * 3. Complete merchant authorization in WeChat Pay merchant platform
 * 
 * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/guide/wechatpay/openapi.html
 */

interface PaymentResult {
  success: boolean
  error?: string
  transactionId?: string
}

interface CreatePaymentResponse {
  success: boolean
  payment?: {
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
  }
  error?: string
}

class PaymentService {
  /**
   * Check if real cloud payment is enabled in store config
   */
  isRealPaymentEnabled(): boolean {
    try {
      const state = store.getState()
      return state.storeConfig?.payment?.enabled === true
    } catch {
      return false
    }
  }

  /**
   * Check if cloud payment is available
   */
  isCloudPaymentAvailable(): boolean {
    try {
      return typeof Taro.cloud !== 'undefined' && 
             !!Taro.cloud.callFunction
    } catch {
      return false
    }
  }

  /**
   * Get payment body prefix from config
   */
  private getPaymentBody(body: string): string {
    try {
      const prefix = store.getState().storeConfig?.payment?.bodyPrefix || ''
      return prefix ? `${prefix}${body}` : body
    } catch {
      return body
    }
  }

  /**
   * Initiate a payment for an order
   * 
   * Flow:
   * 1. Create order in cloud DB (if not already created)
   * 2. Call createPayment cloud function -> gets unified order params
   * 3. Call wx.requestPayment with the params
   * 4. Payment callback updates order status automatically
   * 
   * @param orderId - The order ID from createOrder
   * @param totalFee - Amount in fen (分), e.g. 9900 = ¥99.00
   * @param body - Product description shown in payment UI
   */
  async pay(orderId: string, totalFee: number, body: string = '商品购买'): Promise<PaymentResult> {
    try {
      if (!this.isCloudPaymentAvailable()) {
        return { success: false, error: 'Cloud payment not available' }
      }

      // Step 1: Call createPayment cloud function to get unified order params
      Taro.showLoading({ title: 'Creating order...' })

      const createRes: any = await Taro.cloud.callFunction({
        name: 'createPayment',
        data: { orderId, totalFee, body }
      })

      Taro.hideLoading()

      if (!createRes.result?.success || !createRes.result?.payment) {
        const errorMsg = createRes.result?.error || 'Failed to create payment order'
        Taro.showToast({ title: errorMsg, icon: 'none' })
        return { success: false, error: errorMsg }
      }

      const paymentParams = createRes.result.payment

      // Step 2: Call wx.requestPayment to trigger WeChat Pay
      await Taro.requestPayment({
        timeStamp: paymentParams.timeStamp,
        nonceStr: paymentParams.nonceStr,
        package: paymentParams.package,
        signType: paymentParams.signType || 'MD5',
        paySign: paymentParams.paySign
      })

      // Step 3: requestPayment resolved - user completed payment flow
      // Note: actual payment confirmation comes via paymentCallback cloud function.
      // We do NOT show "Payment successful!" here because the payment may still
      // be processing on the server side. The callback will update order status.
      Taro.showToast({ title: 'Payment submitted', icon: 'success' })
      
      return { success: true }
    } catch (error: any) {
      Taro.hideLoading()
      
      // User cancelled payment
      if (error.errMsg?.includes('cancel')) {
        Taro.showToast({ title: 'Payment cancelled', icon: 'none' })
        return { success: false, error: 'cancelled' }
      }
      
      // Payment failed
      const errMsg = error.errMsg || error.message || 'Payment failed'
      Taro.showToast({ title: 'Payment failed', icon: 'none' })
      return { success: false, error: errMsg }
    }
  }

  /**
   * Quick purchase flow: create order + pay in one step
   * Used for single-product purchases (digital/service)
   * 
   * @param product - Product data
   */
  async quickPurchase(product: {
    id: string
    title: string
    price: number
  }): Promise<PaymentResult> {
    try {
      // If real payment is not enabled, use demo mode
      if (!this.isRealPaymentEnabled()) {
        return this.simulatePayment(product)
      }

      if (!this.isCloudPaymentAvailable()) {
        return this.simulatePayment(product)
      }

      // Step 1: Create order in cloud DB
      const orderRes: any = await Taro.cloud.callFunction({
        name: 'createOrder',
        data: {
          items: [{
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
          }],
          total: product.price,
          discount: 0
        }
      })

      if (!orderRes.result?.success) {
        return { success: false, error: orderRes.result?.error || 'Failed to create order' }
      }

      const orderId = orderRes.result.orderId
      const totalFee = Math.round(product.price * 100)  // Convert yuan to fen
      const body = this.getPaymentBody(product.title)

      // Step 2: Initiate payment
      const paymentResult = await this.pay(orderId, totalFee, body)

      // Step 3: Update local state if payment succeeded
      if (paymentResult.success) {
        store.dispatch({
          type: 'user/addPurchase',
          payload: {
            productId: String(product.id),
            purchaseDate: new Date().toISOString(),
            price: product.price,
            title: product.title
          }
        })
      }

      return paymentResult
    } catch (error: any) {
      return { success: false, error: error.message || 'Purchase failed' }
    }
  }

  /**
   * Cart checkout flow: create order from cart items + pay
   * 
   * @param items - Cart items
   * @param total - Total amount in yuan
   */
  async checkout(items: Array<{
    productId: string
    title: string
    price: number
    quantity: number
  }>, total: number): Promise<PaymentResult> {
    try {
      // If real payment is not enabled, use demo mode
      if (!this.isRealPaymentEnabled() || !this.isCloudPaymentAvailable()) {
        // Demo checkout: just clear cart
        store.dispatch({ type: 'cart/clear' })
        Taro.showToast({ title: 'Checkout successful! (Demo)', icon: 'success' })
        return { success: true }
      }

      // Step 1: Create order
      const orderRes: any = await Taro.cloud.callFunction({
        name: 'createOrder',
        data: { items, total, discount: 0 }
      })

      if (!orderRes.result?.success) {
        return { success: false, error: orderRes.result?.error || 'Failed to create order' }
      }

      const orderId = orderRes.result.orderId
      const totalFee = Math.round(total * 100)  // Convert yuan to fen
      const body = items.length === 1 
        ? this.getPaymentBody(items[0].title)
        : this.getPaymentBody(`${items[0].title}等${items.length}件商品`)

      // Step 2: Initiate payment
      const paymentResult = await this.pay(orderId, totalFee, body)

      // Step 3: Clear cart if payment succeeded
      if (paymentResult.success) {
        store.dispatch({ type: 'cart/clear' })
      }

      return paymentResult
    } catch (error: any) {
      return { success: false, error: error.message || 'Checkout failed' }
    }
  }

  /**
   * Simulated payment for development/testing without cloud payment setup
   * This is the fallback when cloud payment is not configured
   */
  private async simulatePayment(product: {
    id: string
    title: string
    price: number
  }): Promise<PaymentResult> {
    await Taro.showLoading({ title: 'Processing payment...' })
    await new Promise(resolve => setTimeout(resolve, 1000))
    Taro.hideLoading()

    // Update local state
    store.dispatch({
      type: 'user/addPurchase',
      payload: {
        productId: String(product.id),
        purchaseDate: new Date().toISOString(),
        price: product.price,
        title: product.title
      }
    })

    Taro.showToast({ title: 'Purchase successful! (Demo)', icon: 'success' })
    return { success: true }
  }
}

export const paymentService = new PaymentService()
