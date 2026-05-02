import { View, Text } from '@tarojs/components'
import './index.scss'

interface OrderHistoryProps {
  data?: {
    orders?: Array<{
      id: string
      date: string
      total: number
      status: string
      items: number
    }>
  }
  config?: any
}

export default function OrderHistory({ data, config }: OrderHistoryProps) {
  const orders = data?.orders || []

  return (
    <View className="order-history">
      <Text className="section-title">Order History</Text>
      {orders.length === 0 ? (
        <View className="empty-orders">
          <Text>No orders yet</Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} className="order-item">
            <View className="order-header">
              <Text className="order-id">Order #{order.id}</Text>
              <Text className={`order-status status-${order.status}`}>
                {order.status}
              </Text>
            </View>
            <View className="order-details">
              <Text className="order-date">{order.date}</Text>
              <Text className="order-total">¥{order.total.toFixed(2)}</Text>
            </View>
            <Text className="order-items">{order.items} items</Text>
          </View>
        ))
      )}
    </View>
  )
}
