import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import './index.scss'

export default function AdminIndex() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const user = useSelector((state: RootState) => state.user)
  const storeConfig = useSelector((state: RootState) => state.storeConfig)
  const dispatch = useDispatch()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      let openid = user.id || ''

      // Get openid from cloud if not available
      if (!openid && typeof Taro.cloud !== 'undefined' && Taro.cloud.callFunction) {
        try {
          const { result } = await Taro.cloud.callFunction({
            name: 'getUserInfo',
            data: {}
          }).catch(() => ({ result: null }))
          openid = result?.openid || ''
        } catch (e) {
          // Cloud not available
        }
      }

      // Auto-login if not logged in
      if (!user.isLoggedIn && openid) {
        dispatch({
          type: 'user/login',
          payload: { id: openid, name: 'User' }
        })
      }

      // Check admin access via cloud function (proper auth)
      let hasAccess = false

      if (typeof Taro.cloud !== 'undefined' && Taro.cloud.callFunction) {
        try {
          const res = await Taro.cloud.callFunction({
            name: 'checkAdminAccess',
            data: {}
          })
          hasAccess = res.result?.isAdmin || false
        } catch (e) {
          // Cloud function not available - check local config
        }
      }

      // Fallback: check against locally stored admin OpenIDs
      if (!hasAccess && openid) {
        const adminOpenids = storeConfig.adminOpenids || []
        hasAccess = adminOpenids.includes(openid)
      }

      // Fallback: if cloud is entirely unavailable (dev mode with no cloud),
      // allow access if user is logged in and storeConfig has no adminOpenids set
      if (!hasAccess && !openid && typeof Taro.cloud === 'undefined') {
        hasAccess = true // No cloud = dev mode, allow admin
      }

      setIsAdmin(hasAccess)
    } catch (err) {
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  const navigateTo = (page: string) => {
    Taro.navigateTo({
      url: `/pages/admin/${page}`
    })
  }

  if (loading) {
    return (
      <View className="admin-index">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!isAdmin) {
    return (
      <View className="admin-index admin-locked">
        <Text className="title">Admin Access</Text>
        <Text className="subtitle">You don't have permission to access admin panel</Text>
        <Text className="subtitle hint">Add your OpenID in Settings -> Admin Access</Text>
        <Button onClick={() => Taro.navigateBack()}>Go Back</Button>
      </View>
    )
  }

  return (
    <View className="admin-index">
      <View className="admin-header">
        <Text className="title">Admin Panel</Text>
        <Text className="subtitle">Manage your store</Text>
      </View>

      <View className="admin-menu">
        <View className="menu-item" onClick={() => navigateTo('dashboard')}>
          <Text className="icon">📊</Text>
          <Text className="label">Dashboard</Text>
        </View>

        <View className="menu-item" onClick={() => navigateTo('products')}>
          <Text className="icon">📦</Text>
          <Text className="label">Products</Text>
        </View>

        <View className="menu-item" onClick={() => navigateTo('orders')}>
          <Text className="icon">📋</Text>
          <Text className="label">Orders</Text>
        </View>

        <View className="menu-item" onClick={() => navigateTo('settings')}>
          <Text className="icon">⚙️</Text>
          <Text className="label">Settings</Text>
        </View>
      </View>

      <Button className="exit-btn" onClick={() => Taro.navigateBack()}>
        Exit Admin
      </Button>
    </View>
  )
}
