import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useVerify } from '../../hooks'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const isLoggedIn = useVerify()

  if (!isLoggedIn) {
    if (fallback) return <>{fallback}</>

    return (
      <View className="auth-guard">
        <View className="auth-guard__content">
          <Text className="auth-guard__icon">🔒</Text>
          <Text className="auth-guard__title">Login Required</Text>
          <Text className="auth-guard__hint">Please login to access this feature</Text>
          <View
            className="auth-guard__btn"
            onClick={() => Taro.navigateTo({ url: '/pages/profile/index' })}
          >
            <Text className="auth-guard__btn-text">Go to Login</Text>
          </View>
        </View>
      </View>
    )
  }

  return <>{children}</>
}
