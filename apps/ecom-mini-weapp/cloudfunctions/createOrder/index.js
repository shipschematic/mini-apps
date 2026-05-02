const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { items, total, discount = 0 } = event
  const { OPENID } = cloud.getWXContext()
  
  try {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const finalTotal = total || (subtotal - discount)
    
    const order = {
      userId: OPENID,
      items: items,
      subtotal: subtotal,
      discount: discount,
      total: finalTotal,
      payment: {
        method: 'wechat',
        status: 'pending',
        transactionId: null,
        paidAt: null
      },
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
    
    const result = await db.collection('orders').add({
      data: order
    })
    
    return {
      success: true,
      orderId: result._id,
      order: {
        ...order,
        _id: result._id
      }
    }
  } catch (error) {
    console.error('Create order error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
