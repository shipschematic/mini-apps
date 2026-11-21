const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()

/**
 * Payment Callback Cloud Function
 *
 * Receives payment result notifications from WeChat Pay.
 * Must return { errcode: 0 } on success, otherwise WeChat retries.
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/reference-sdk-api/open/pay/paymentCallback.html
 */
exports.main = async (event) => {
  const { outTradeNo, resultCode, totalFee, transactionId } = event

  try {
    const paymentRes = await db.collection('xingqiba_payments')
      .where({ outTradeNo: outTradeNo })
      .get()

    if (paymentRes.data.length === 0) {
      console.error('Payment record not found:', outTradeNo)
      return { errcode: 0 }
    }

    const payment = paymentRes.data[0]
    const isPaid = resultCode === 'SUCCESS'

    await db.collection('xingqiba_payments').doc(payment._id).update({
      data: {
        status: isPaid ? 'paid' : 'failed',
        transactionId: transactionId || null,
        paidAt: isPaid ? db.serverDate() : null,
        updatedAt: db.serverDate()
      }
    })

    if (payment.orderId) {
      const orderStatus = isPaid ? 'COMPLETED' : 'LOCKED'
      await db.collection('xingqiba_orders').doc(payment.orderId).update({
        data: {
          status: orderStatus,
          payTime: isPaid ? new Date().toISOString() : null,
          'payment.status': isPaid ? 'paid' : 'failed',
          'payment.transactionId': transactionId || null,
          'payment.paidAt': isPaid ? db.serverDate() : null,
          'payment.method': 'wechat_cloud',
          updatedAt: db.serverDate()
        }
      })
    }

    return { errcode: 0 }
  } catch (error) {
    console.error('Payment callback error:', error)
    return { errcode: -1, errmsg: error.message }
  }
}
