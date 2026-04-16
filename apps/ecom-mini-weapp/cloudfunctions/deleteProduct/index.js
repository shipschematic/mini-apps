const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { productId } = event
  
  try {
    const result = await db.collection('products').doc(productId).remove()
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Delete product error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
