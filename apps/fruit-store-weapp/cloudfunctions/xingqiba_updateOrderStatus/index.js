const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { orderId, status } = event
  const { OPENID } = cloud.getWXContext()

  if (!orderId || !status) {
    return { success: false, error: 'Order ID and status required' }
  }

  if (status !== 'CANCELLED') {
    return { success: false, error: 'Only CANCELLED is allowed from the client' }
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

    const updates = {
      status: 'CANCELLED',
      updatedAt: db.serverDate()
    }

    const result = await db.collection('xingqiba_orders').doc(orderId).update({
      data: updates
    })

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Update order status error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
