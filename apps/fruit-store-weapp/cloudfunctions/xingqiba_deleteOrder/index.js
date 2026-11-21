const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()

exports.main = async (event) => {
  const { orderId } = event
  const { OPENID } = cloud.getWXContext()

  if (!orderId) {
    return { success: false, error: 'Order ID required' }
  }

  try {
    const orderRes = await db.collection('xingqiba_orders').doc(orderId).get()
    const order = orderRes.data

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    if (!order.userId || order.userId !== OPENID) {
      return { success: false, error: 'Order does not belong to this user' }
    }

    await db.collection('xingqiba_orders').doc(orderId).update({
      data: {
        enabled: false,
        deletedAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Delete order error:', error)
    return { success: false, error: error.message }
  }
}
