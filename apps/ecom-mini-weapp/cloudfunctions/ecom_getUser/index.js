const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-d4gc2e7w9638ce590',
  traceUser: false
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const OPENID = wxContext.OPENID

  if (!OPENID) {
    return {
      success: false,
      error: 'No openid available'
    }
  }

  try {
    const userCollection = db.collection('ecom_userInfo')

    const existing = await userCollection.where({ openid: OPENID }).get()

    if (existing.data && existing.data.length > 0) {
      const user = existing.data[0]

      await userCollection.doc(user._id).update({
        data: {
          lastLoginAt: new Date(),
          updatedAt: new Date()
        }
      })

      return {
        success: true,
        data: {
          _id: user._id,
          openid: user.openid,
          name: user.name || '',
          avatar: user.avatar || '',
          isAdmin: user.isAdmin || false,
          createdAt: user.createdAt,
          lastLoginAt: new Date()
        }
      }
    }

    const isFirstAdmin = (await userCollection.count()).total === 0

    const newUser = {
      openid: OPENID,
      name: '',
      avatar: '',
      isAdmin: isFirstAdmin,
      createdAt: new Date(),
      lastLoginAt: new Date()
    }

    const createResult = await userCollection.add({ data: newUser })

    return {
      success: true,
      data: {
        _id: createResult.id,
        openid: OPENID,
        name: '',
        avatar: '',
        isAdmin: isFirstAdmin,
        createdAt: new Date(),
        lastLoginAt: new Date()
      }
    }
  } catch (error) {
    console.error('GetUser error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
