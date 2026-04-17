const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * Check Admin Access
 * 
 * Verifies if the current user has admin access by checking:
 * 1. Cloud-stored admin OpenID list
 * 2. Falls back to config collection
 * 
 * This is the secure way to verify admin access - 
 * the OpenID comes directly from cloud context (cannot be spoofed).
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  try {
    // Check admin list in config collection
    const configRes = await db.collection('config')
      .doc('store')
      .get()
      .catch(() => ({ data: null }))

    const adminOpenids = configRes.data?.adminOpenids || []

    // Check if current user's OPENID is in admin list
    const isAdmin = adminOpenids.includes(OPENID)

    return {
      isAdmin,
      openid: OPENID  // Return openid so frontend can store it
    }
  } catch (error) {
    return {
      isAdmin: false,
      openid: OPENID,
      error: error.message
    }
  }
}
