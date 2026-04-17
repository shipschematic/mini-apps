const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * Get Store Configuration
 * Returns store config from cloud database
 */
exports.main = async (event, context) => {
  try {
    const res = await db.collection('config')
      .doc('store')
      .get()

    return {
      success: true,
      data: res.data || {}
    }
  } catch (error) {
    // Config doesn't exist yet, return defaults
    return {
      success: true,
      data: {
        _id: 'store',
        appName: 'Whitelabel Store',
        primaryColor: '#2A4B7C',
        currency: '¥',
        adminOpenids: [],
        payment: {
          enabled: false,
          mchId: '',
          bodyPrefix: ''
        }
      }
    }
  }
}
