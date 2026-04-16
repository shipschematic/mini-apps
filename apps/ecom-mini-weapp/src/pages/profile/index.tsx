import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { useSelector } from 'react-redux'
import './profile.scss'

// Secret: Tap logo 5 times to access admin
const ADMIN_TAP_COUNT = 5

export default function ProfilePage() {
  const user = useSelector((state: any) => state.user)
  const storeConfig = useSelector((state: any) => state.storeConfig)
  const [logoTapCount, setLogoTapCount] = useState(0)
  const [showAdminHint, setShowAdminHint] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    if (!user.isLoggedIn) {
      Taro.showToast({ title: 'Please login first', icon: 'none' })
    }
  }, [user.isLoggedIn])

  const handleLogoTap = () => {
    const newCount = logoTapCount + 1
    setLogoTapCount(newCount)

    if (newCount >= ADMIN_TAP_COUNT) {
      // Navigate to admin
      Taro.navigateTo({
        url: '/pages/admin/index'
      })
      setLogoTapCount(0)
      setShowAdminHint(false)
    } else {
      setShowAdminHint(true)
      // Hide hint after 2 seconds
      setTimeout(() => setShowAdminHint(false), 2000)
    }
  }

  const handleLogin = async () => {
    try {
      // WeChat login
      const loginRes = await Taro.login()
      console.log('WeChat login:', loginRes.code)

      // Get user profile
      const profileRes = await Taro.getUserProfile({
        desc: 'For login'
      })

      Taro.showToast({ title: 'Login success', icon: 'success' })
    } catch (err) {
      console.error('Login error:', err)
      Taro.showToast({ title: 'Login failed', icon: 'none' })
    }
  }

  return (
    <View className="profile-page">
      {/* Logo - Secret Admin Access */}
      <View className="logo-container" onClick={handleLogoTap}>
        <View className="logo">
          <Text className="logo-text">
            {storeConfig?.appName?.charAt(0) || 'S'}
          </Text>
        </View>
        {showAdminHint && (
          <Text className="admin-hint">
            {ADMIN_TAP_COUNT - logoTapCount} more taps for admin
          </Text>
        )}
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
