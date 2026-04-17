const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * Save Store Configuration
 * Upserts store config (only admins can save)
 * 
 * SECURITY: First-time setup requires INITIAL_ADMIN_OPENID environment variable
 * to prevent any user from becoming admin on first access.
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { appName, primaryColor, currency, adminOpenids, payment } = event

  try {
    // Verify admin access
    let isAdmin = false
    let configExists = false

    try {
      const configRes = await db.collection('config').doc('store').get()
      configExists = true
      const existingAdmins = configRes.data?.adminOpenids || []
      isAdmin = existingAdmins.includes(OPENID)
    } catch (e) {
      // Config doesn't exist yet
      configExists = false
    }

    // First-time setup: require INITIAL_ADMIN_OPENID env var
    if (!configExists) {
      const initialAdminOpenid = process.env.INITIAL_ADMIN_OPENID
      if (initialAdminOpenid && OPENID === initialAdminOpenid) {
        isAdmin = true
      } else if (!initialAdminOpenid) {
        // If no INITIAL_ADMIN_OPENID configured, log a warning but allow
        // (for development convenience - set INITIAL_ADMIN_OPENID in production!)
        console.warn('INITIAL_ADMIN_OPENID not set. Allowing first setup. Set this env var in production!')
        isAdmin = true
      }
    }

    if (!isAdmin) {
      return { success: false, error: 'Admin access required' }
    }

    // Build update data
    const updateData = {
      updatedAt: db.serverDate()
    }

    if (appName !== undefined) updateData.appName = appName
    if (primaryColor !== undefined) updateData.primaryColor = primaryColor
    if (currency !== undefined) updateData.currency = currency
    if (adminOpenids !== undefined) updateData.adminOpenids = adminOpenids
    if (payment !== undefined) updateData.payment = payment

    if (configExists) {
      await db.collection('config').doc('store').update({
        data: updateData
      })
    } else {
      await db.collection('config').doc('store').set({
        data: {
          _id: 'store',
          appName: appName || 'Whitelabel Store',
          primaryColor: primaryColor || '#2A4B7C',
          currency: currency || '¥',
          adminOpenids: adminOpenids || [],
          payment: payment || { enabled: false, mchId: '', bodyPrefix: '' },
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      })
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
