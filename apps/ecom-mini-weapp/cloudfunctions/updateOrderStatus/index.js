const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { orderId, status, transactionId } = event
  
  try {
    const updates = {
      'payment.status': status,
      'payment.paidAt': status === 'paid' ? db.serverDate() : null,
      'payment.transactionId': transactionId || null,
      updatedAt: db.serverDate()
    }
    
    const result = await db.collection('orders').doc(orderId).update({
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
