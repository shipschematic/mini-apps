const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { status = 'published', type, category } = event

  try {
    let query = db.collection('products').where({
      status: status
    })
    
    if (type) {
      query = query.where({ type })
    }
    
    if (category) {
      query = query.where({ category })
    }
    
    const result = await query
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()
    
    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('Get products error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
