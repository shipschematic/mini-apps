import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { login, logout } from '../../store/userSlice'
import { AppShell } from '../../core/AppShell'
import { ensureCloudInit } from '../../utils/cloud'
import './profile.scss'

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user.isLoggedIn) {
      checkAdmin()
    }
  }, [user.isLoggedIn, user.id])

  const checkAdmin = async () => {
    if (!user.id) return

    try {
      const config = AppShell.getConfigSafe()
      const configAdminIds = (config as any)?.adminIds || []

      if (configAdminIds.includes(user.id)) {
        setIsAdmin(true)
        return
      }

      if (ensureCloudInit()) {
        const res: any = await Taro.cloud.callFunction({
          name: 'ecom_getUser',
          data: {}
        })

        if (res.result?.success && res.result?.data?.isAdmin) {
          setIsAdmin(true)
        }
      }
    } catch (e) {
    }
  }

  const handleLogin = async () => {
    let loginError = ''

    try {
      let userId = ''
      let nickName = ''
      let avatarUrl = ''

      const cloudReady = ensureCloudInit()

      if (cloudReady) {
        try {
          const res: any = await Taro.cloud.callFunction({
            name: 'ecom_getUser',
            data: {}
          })

          if (res.result?.success) {
            const userData = res.result.data
            userId = userData.openid

            if (userData.name) nickName = userData.name
            if (userData.avatar) avatarUrl = userData.avatar

            if (userData.isAdmin) {
              setIsAdmin(true)
            }
          } else {
            loginError = res.result?.error || 'Cloud login failed'
          }
        } catch (e: any) {
          loginError = e?.message || 'Cloud function error'
        }
      } else {
        loginError = 'Cloud not available'
      }

      if (!userId) {
        const loginRes = await Taro.login()
        userId = loginRes.code || 'unknown'
        if (loginError) {
          loginError += ' — used fallback login'
        }
      }

      try {
        const profileRes = await Taro.getUserProfile({
          desc: 'Used to display your profile'
        })
        nickName = profileRes.userInfo.nickName
        avatarUrl = profileRes.userInfo.avatarUrl
      } catch (e) {
      }

      dispatch(login({
        id: userId,
        name: nickName || 'User',
        avatar: avatarUrl
      }))

      if (loginError) {
        Taro.showToast({ title: 'Login OK — ' + loginError, icon: 'none', duration: 3000 })
      } else {
        Taro.showToast({ title: 'Login success', icon: 'success' })
      }

      if (user.isLoggedIn) {
        checkAdmin()
      }
    } catch (err: any) {
      if (err?.errMsg?.includes('cancel')) {
        Taro.showToast({ title: 'Cancelled', icon: 'none' })
      } else {
        Taro.showToast({ title: 'Login failed', icon: 'none' })
      }
    }
  }

  const copyOpenid = () => {
    if (!user.id) return
    Taro.setClipboardData({
      data: user.id,
      success: () => {
        Taro.showToast({ title: 'OpenID copied', icon: 'success' })
      }
    })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      success: (res) => {
        if (res.confirm) {
          dispatch(logout())
          setIsAdmin(false)
          Taro.showToast({ title: 'Logged out', icon: 'success' })
        }
      }
    })
  }

  const handleNavigateToAdmin = () => {
    Taro.navigateTo({ url: '/pages/admin/index' })
  }

  const config = AppShell.getConfigSafe()
  const appName = config?.meta?.appName || 'PromptMarket'

  return (
    <ScrollView scrollY className="profile-page">
      <View className="profile-header">
        {user.isLoggedIn ? (
          <View className="user-info">
            {user.avatar ? (
              <Image src={user.avatar} className="avatar" />
            ) : (
              <View className="avatar-placeholder">
                <Text className="avatar-text">{(user.name || 'U').charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <Text className="user-name">{user.name || 'User'}</Text>
            <View className="openid-row" onClick={copyOpenid}>
              <Text className="user-id">OpenID: {user.id}</Text>
              <Text className="copy-btn">📋</Text>
            </View>
            <Text className="tap-hint">Tap to copy</Text>
          </View>
        ) : (
          <View className="login-section">
            <View className="avatar-placeholder">
              <Text className="avatar-text">?</Text>
            </View>
            <Text className="login-hint">Login to manage your orders and purchases</Text>
            <Button className="login-btn" onClick={handleLogin}>
              Login with WeChat
            </Button>
          </View>
        )}
      </View>

      {isAdmin && (
        <View className="admin-section">
          <View className="menu-item admin-entry" onClick={handleNavigateToAdmin}>
            <Text className="icon">🔧</Text>
            <Text className="label">Admin Panel</Text>
            <Text className="arrow">›</Text>
          </View>
        </View>
      )}

      <View className="menu-section">
        <Text className="section-title">My Account</Text>

        <View className="menu-item" onClick={() => Taro.switchTab({ url: '/pages/cart/index' })}>
          <Text className="icon">🛒</Text>
          <Text className="label">My Cart</Text>
          {cartItems.length > 0 && <Text className="badge">{cartItems.length}</Text>}
          <Text className="arrow">›</Text>
        </View>

        {user.isLoggedIn && (
          <>
            <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/orders/index' })}>
              <Text className="icon">📦</Text>
              <Text className="label">My Orders</Text>
              <Text className="arrow">›</Text>
            </View>

            <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/library/index' })}>
              <Text className="icon">📚</Text>
              <Text className="label">My Library</Text>
              <Text className="arrow">›</Text>
            </View>
          </>
        )}
      </View>

      <View className="menu-section">
        <Text className="section-title">Support</Text>

        <View className="menu-item" onClick={() => Taro.showToast({ title: 'Help coming soon', icon: 'none' })}>
          <Text className="icon">❓</Text>
          <Text className="label">Help & FAQ</Text>
          <Text className="arrow">›</Text>
        </View>

        <View className="menu-item" onClick={() => Taro.showToast({ title: 'About coming soon', icon: 'none' })}>
          <Text className="icon">ℹ️</Text>
          <Text className="label">About {appName}</Text>
          <Text className="arrow">›</Text>
        </View>
      </View>

      {user.purchases && user.purchases.length > 0 && (
        <View className="purchases-section">
          <Text className="section-title">Recent Purchases</Text>
          {user.purchases.map((purchase: any, idx: number) => (
            <View key={idx} className="purchase-item">
              <Text className="purchase-title">{purchase.title}</Text>
              <Text className="purchase-date">
                {new Date(purchase.purchaseDate).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {user.isLoggedIn && (
        <View className="logout-section">
          <Button className="logout-btn" onClick={handleLogout}>
            Logout
          </Button>
        </View>
      )}

      <Text className="version-text">v1.0.0</Text>
    </ScrollView>
  )
}
