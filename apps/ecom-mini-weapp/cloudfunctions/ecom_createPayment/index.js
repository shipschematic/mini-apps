const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()

/**
 * Create Payment - WeChat Cloud Pay Unified Order
 * 
 * Uses cloud.pay.unifiedOrder for secure, certificate-free payment.
 * The merchant ID (sub_mch_id) is configured in the cloud console.
 * 
 * Required cloud console setup:
 * 1. 云开发控制台 -> 设置 -> 全局设置 -> 微信支付配置
 * 2. Add your merchant ID and complete authorization
 * 
 * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/reference-sdk-api/open/pay/CloudPay.unifiedOrder.html
 */
exports.main = async (event) => {
  const { orderId, totalFee, body = '商品购买' } = event
  const { OPENID } = cloud.getWXContext()

  try {
    // Validate inputs
    if (!orderId) {
      return { success: false, error: 'Order ID is required' }
    }
    if (!totalFee || totalFee <= 0) {
      return { success: false, error: 'Invalid payment amount' }
    }

    // Generate unique outTradeNo (order number for WeChat Pay)
    // Format: timestamp + random digits
    const outTradeNo = `${Date.now()}${Math.random().toString().slice(2, 8)}`

    // Call WeChat Cloud Pay unified order API
    // This replaces the need for certificate management and signing
    const result = await cloud.cloudPay.unifiedOrder({
      body: body,                          // Product description
      outTradeNo: outTradeNo,               // Merchant order number
      spbillCreateIp: '127.0.0.1',          // Terminal IP (cloud function default)
      subMchId: event.subMchId || undefined, // Optional: sub-merchant ID (for multi-merchant)
      totalFee: Math.round(totalFee),        // Amount in fen (分), must be integer
      envId: 'cloud1-d4gc2e7w9638ce590',      // Cloud env ID for payment callback
      functionName: 'ecom_paymentCallback',   // Cloud function name for payment result callback
      nonceStr: Math.random().toString(36).slice(2),    // Random string
      tradeType: 'JSAPI',                    // Payment type for Mini Program
    })

    // Save payment record to database
    await db.collection('ecom_payments').add({
      data: {
        orderId: orderId,
        outTradeNo: outTradeNo,
        openid: OPENID,
        totalFee: totalFee,
        body: body,
        status: 'pending',
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })

    // Update order status to pending payment
    try {
      await db.collection('ecom_orders').doc(orderId).update({
        data: {
          'payment.status': 'pending',
          'payment.outTradeNo': outTradeNo,
          updatedAt: db.serverDate()
        }
      })
    } catch (e) {
      // Order might not exist yet, that's ok
    }

    return {
      success: true,
      payment: result.payment  // This contains all params needed for wx.requestPayment
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errCode: error.errCode
    }
  }
}
