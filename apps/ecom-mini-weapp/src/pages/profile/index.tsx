import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import './profile.scss'

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user)
  const storeConfig = useSelector((state: RootState) => state.storeConfig)
  const dispatch = useDispatch()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Auto-silent login: try to restore session silently
    if (!user.isLoggedIn) {
      silentLogin()
    }
    // Check admin access
    checkAdmin()
  }, [])

  const silentLogin = async () => {
    try {
      if (typeof Taro.cloud === 'undefined' || !Taro.cloud.callFunction) {
        return
      }
      
      const { result } = await Taro.cloud.callFunction({
        name: 'getUserInfo',
        data: {}
      })
      if (result?.openid) {
        dispatch({
          type: 'user/login',
          payload: { id: result.openid }
        })
      }
    } catch (e) {
      // Silently fail - user can click "Login with WeChat" manually
    }
  }

  const checkAdmin = async () => {
    try {
      if (typeof Taro.cloud === 'undefined' || !Taro.cloud.callFunction) {
        return
      }
      const { result } = await Taro.cloud.callFunction({
        name: 'checkAdminAccess',
        data: {}
      })
      setIsAdmin(result?.isAdmin || false)
    } catch (e) {
      // Not admin or cloud not available
    }
  }

  const handleNavigateToAdmin = () => {
    Taro.navigateTo({
      url: '/pages/admin/index'
    })
  }

  const handleLogin = async () => {
    try {
      // Step 1: WeChat login to get code
      const loginRes = await Taro.login()

      // Step 2: Get user profile (avatar, name) - requires user permission
      const profileRes = await Taro.getUserProfile({
        desc: 'Used to display your profile'
      })

      const { nickName, avatarUrl } = profileRes.userInfo

      // Step 3: Get openid from cloud (if available)
      let userId = ''
      try {
        if (typeof Taro.cloud !== 'undefined' && Taro.cloud.callFunction) {
          const { result } = await Taro.cloud.callFunction({
            name: 'getUserInfo',
            data: {}
          })
          userId = result?.openid || ''
        }
      } catch (e) {
        // Silently fail - use code as fallback
      }

      // Step 4: Save to Redux
      dispatch({
        type: 'user/login',
        payload: {
          id: userId || loginRes.code,
          name: nickName,
          avatar: avatarUrl
        }
      })

      Taro.showToast({ title: 'Login success', icon: 'success' })
    } catch (err: any) {
      if (err.errMsg?.includes('cancel')) {
        Taro.showToast({ title: 'Cancelled', icon: 'none' })
      } else {
        Taro.showToast({ title: 'Login failed', icon: 'none' })
      }
    }
  }

  return (
    <View className="profile-page">
      {/* Logo */}
      <View className="logo-container">
        <View className="logo">
          <Text className="logo-text">
            {storeConfig?.appName?.charAt(0) || 'S'}
          </Text>
        </View>
      </View>

      <Text className="store-name">{storeConfig?.appName || 'Whitelabel Store'}</Text>

      {/* User Info or Login */}
      {user.isLoggedIn ? (
        <View className="user-info">
          <Image
            src={user.avatar || 'https://via.placeholder.com/80'}
            className="avatar"
          />
          <Text className="user-name">{user.name || 'User'}</Text>
        </View>
      ) : (
        <View className="login-section">
          <Button className="login-btn" onClick={handleLogin}>
            Login with WeChat
          </Button>
        </View>
      )}

      {/* Admin Panel Link (only shown to admins) */}
      {isAdmin && (
        <View className="admin-section">
          <View className="menu-item admin-entry" onClick={handleNavigateToAdmin}>
            <Text className="icon">🔧</Text>
            <Text className="label">Admin Panel</Text>
            <Text className="arrow">›</Text>
          </View>
        </View>
      )}

      {/* Menu */}
      <View className="menu-section">
        <View className="menu-item">
          <Text className="icon">📦</Text>
          <Text className="label">My Orders</Text>
          <Text className="arrow">›</Text>
        </View>

        <View className="menu-item">
          <Text className="icon">❤️</Text>
          <Text className="label">Wishlist</Text>
          <Text className="arrow">›</Text>
        </View>

        <View className="menu-item">
          <Text className="icon">📚</Text>
          <Text className="label">My Library</Text>
          <Text className="arrow">›</Text>
        </View>

        <View className="menu-item">
          <Text className="icon">⚙️</Text>
          <Text className="label">Settings</Text>
          <Text className="arrow">›</Text>
        </View>
      </View>

      {/* Purchases */}
      {user.purchases?.length > 0 && (
        <View className="purchases-section">
          <Text className="section-title">My Purchases</Text>
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
    </View>
  )
}
