const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()

/**
 * Payment Callback Cloud Function
 * 
 * This function receives payment result notifications from WeChat Pay.
 * It is specified in the createPayment function's `functionName` parameter.
 * 
 * IMPORTANT: This function MUST return { errcode: 0 } on success,
 * otherwise WeChat will keep sending callbacks.
 * 
 * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/reference-sdk-api/open/pay/paymentCallback.html
 */
exports.main = async (event) => {
  // Extract payment result from callback
  const { outTradeNo, resultCode, openid, totalFee, transactionId } = event

  try {
    // Find the payment record by outTradeNo
    const paymentRes = await db.collection('payments')
      .where({ outTradeNo: outTradeNo })
      .get()

    if (paymentRes.data.length === 0) {
      console.error('Payment record not found:', outTradeNo)
      return { errcode: 0 }  // Still return success to stop retries
    }

    const payment = paymentRes.data[0]
    const isPaid = resultCode === 'SUCCESS'

    // Update payment record
    await db.collection('payments').doc(payment._id).update({
      data: {
        status: isPaid ? 'paid' : 'failed',
        transactionId: transactionId || null,
        paidAt: isPaid ? db.serverDate() : null,
        updatedAt: db.serverDate()
      }
    })

    // Update order status
    if (payment.orderId) {
      await db.collection('orders').doc(payment.orderId).update({
        data: {
          'payment.status': isPaid ? 'paid' : 'failed',
          'payment.transactionId': transactionId || null,
          'payment.paidAt': isPaid ? db.serverDate() : null,
          'payment.method': 'wechat_cloud',
          updatedAt: db.serverDate()
        }
      })
    }

    // MUST return { errcode: 0 } to acknowledge receipt
    return { errcode: 0 }
  } catch (error) {
    console.error('Payment callback error:', error)
    // Return error to trigger retry
    return { errcode: -1, errmsg: error.message }
  }
}
