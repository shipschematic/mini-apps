const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { status, limit = 100, skip = 0 } = event

  try {
    let query = db.collection('orders').where({
      userId: OPENID,
      enabled: true
    })

    if (status) {
      query = query.where({
        'payment.status': status
      })
    }

    const result = await query
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(limit)
      .get()

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('Get orders error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
