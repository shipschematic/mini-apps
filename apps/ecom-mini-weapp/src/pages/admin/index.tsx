import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useSelector } from 'react-redux'
import './index.scss'

// Hidden admin access: tap logo 5 times on profile page
const ADMIN_OPENIDS = [
  // Add admin openids here, e.g. 'oXXXXXX...'
]

export default function AdminIndex() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const user = useSelector((state: any) => state.user)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      // Get current user's openid via WeChat cloud
      const { result } = await Taro.cloud.callFunction({
        name: 'getUserInfo',
        data: {}
      }).catch(() => ({ result: null }))

      const openid = result?.openid || user.id

      // Check if user is admin
      const adminStatus = ADMIN_OPENIDS.includes(openid) || isDevMode()
      setIsAdmin(adminStatus)
    } catch (err) {
      console.error('Admin check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const isDevMode = () => {
    // In dev mode, allow access (remove in production)
    return process.env.NODE_ENV === 'development'
  }

  const navigateTo = (page: string) => {
    Taro.navigateTo({
      url: `/pages/admin/${page}/index`
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
