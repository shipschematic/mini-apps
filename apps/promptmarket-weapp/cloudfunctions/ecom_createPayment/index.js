const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()

/**
 * Create Payment - WeChat Cloud Pay Unified Order
 *
 * The amount is read from the order record, never from the client.
 * Client-supplied totals can be tampered with and must not be trusted.
 *
 * Required cloud console setup:
 * 1. 云开发控制台 -> 设置 -> 全局设置 -> 微信支付配置
 * 2. Add merchant ID and complete authorization
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/reference-sdk-api/open/pay/CloudPay.unifiedOrder.html
 */
exports.main = async (event) => {
  const { orderId, body = '商品购买' } = event
  const { OPENID } = cloud.getWXContext()

  if (!orderId) {
    return { success: false, error: 'Order ID required' }
  }

  try {
    let order
    try {
      const orderRes = await db.collection('ecom_orders').doc(orderId).get()
      order = orderRes.data
    } catch (error) {
      return { success: false, error: 'Order not found' }
    }

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    if (!order.userId || order.userId !== OPENID) {
      return { success: false, error: 'Order does not belong to this user' }
    }

    if (order.status && ['CANCELLED', 'COMPLETED', 'PAID'].includes(order.status)) {
      return { success: false, error: 'Order cannot be paid in its current state' }
    }

    const amount = Number(order.totalPrice != null ? order.totalPrice : order.total)
    if (!Number.isFinite(amount) || amount <= 0) {
      return { success: false, error: 'Order amount is invalid' }
    }

    const totalFee = Math.round(amount * 100)
    const productTitle = order.productSnapshot && order.productSnapshot.title
    const paymentBody = productTitle || body

    const outTradeNo = `${Date.now()}${Math.random().toString().slice(2, 8)}`

    const result = await cloud.cloudPay.unifiedOrder({
      body: paymentBody,
      outTradeNo: outTradeNo,
      spbillCreateIp: '127.0.0.1',
      subMchId: event.subMchId || undefined,
      totalFee: totalFee,
      envId: 'cloud1-d4gc2e7w9638ce590',
      functionName: 'ecom_paymentCallback',
      nonceStr: Math.random().toString(36).slice(2),
      tradeType: 'JSAPI'
    })

    await db.collection('ecom_payments').add({
      data: {
        orderId: orderId,
        outTradeNo: outTradeNo,
        openid: OPENID,
        totalFee: totalFee,
        body: paymentBody,
        status: 'pending',
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })

    await db.collection('ecom_orders').doc(orderId).update({
      data: {
        'payment.status': 'pending',
        'payment.outTradeNo': outTradeNo,
        updatedAt: db.serverDate()
      }
    })

    return {
      success: true,
      totalFee: totalFee,
      payment: result.payment
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errCode: error.errCode
    }
  }
}
