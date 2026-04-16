const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { product } = event
  
  try {
    const newProduct = {
      ...product,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
    
    const result = await db.collection('products').add({
      data: newProduct
    })
    
    return {
      success: true,
      data: {
        _id: result._id,
        ...newProduct
      }
    }
  } catch (error) {
    console.error('Create product error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
