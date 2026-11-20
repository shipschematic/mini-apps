const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  
  try {
    const ordersResult = await db.collection('ecom_orders')
      .where({
        userId: OPENID,
        'payment.status': 'paid'
      })
      .orderBy('createdAt', 'desc')
      .get()
    
    const productIds = []
    const purchases = []
    
    ordersResult.data.forEach(order => {
      order.items.forEach(item => {
        if (!productIds.includes(item.productId)) {
          productIds.push(item.productId)
          purchases.push({
            productId: item.productId,
            orderId: order._id,
            purchasedAt: order.payment.paidAt || order.createdAt,
            price: item.price,
            title: item.title
          })
        }
      })
    })
    
    return {
      success: true,
      data: purchases
    }
  } catch (error) {
    console.error('Get user purchases error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
