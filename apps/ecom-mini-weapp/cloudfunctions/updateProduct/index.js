const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { productId, updates } = event
  
  try {
    const result = await db.collection('products').doc(productId).update({
      data: {
        ...updates,
        updatedAt: db.serverDate()
      }
    })
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Update product error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
