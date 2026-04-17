const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * Get User Info
 * Returns the current user's OpenID from cloud context
 * This is the secure way to get user identity (cannot be spoofed)
 */
exports.main = async (event, context) => {
  const { OPENID, APPID } = cloud.getWXContext()

  return {
    openid: OPENID,
    appid: APPID
  }
}
