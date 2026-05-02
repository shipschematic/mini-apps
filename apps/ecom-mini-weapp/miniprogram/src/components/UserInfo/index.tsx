import { View, Text, Image } from '@tarojs/components'
import './index.scss'

interface UserInfoProps {
  data?: {
    name?: string
    avatar?: string
    email?: string
    phone?: string
  }
  config?: any
}

export default function UserInfo({ data, config }: UserInfoProps) {
  const user = data || {}

  return (
    <View className="user-info">
      <View className="user-avatar">
        {user.avatar ? (
          <Image src={user.avatar} className="avatar-image" />
        ) : (
          <View className="avatar-placeholder">👤</View>
        )}
      </View>
      <View className="user-details">
        <Text className="user-name">{user.name || 'Guest User'}</Text>
        {user.email && <Text className="user-email">{user.email}</Text>}
        {user.phone && <Text className="user-phone">{user.phone}</Text>}
      </View>
    </View>
  )
}
