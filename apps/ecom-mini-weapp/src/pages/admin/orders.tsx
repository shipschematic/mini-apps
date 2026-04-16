import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { adminCloudService } from '../../../services/adminService'
import './orders.scss'

const STATUS_OPTIONS = ['all', 'pending', 'paid', 'shipped', 'completed', 'refunded']

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await adminCloudService.getOrders()
      if (res.success && res.data) {
        setOrders(res.data)
      }
    } catch (err) {
      console.error('Load orders error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await adminCloudService.updateOrderStatus(orderId, status)
      if (res.success) {
        Taro.showToast({ title: 'Updated', icon: 'success' })
        loadOrders()
      }
    } catch (err) {
      Taro.showToast({ title: 'Error', icon: 'none' })
    }
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.payment?.status === filter)

  const formatCurrency = (amount: number) => `¥${amount.toFixed(2)}`
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <View className="admin-orders">
      <View className="filter-tabs">
        {STATUS_OPTIONS.map(status => (
          <Text
            key={status}
            className={`tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </Text>
        ))}
      </View>

      <ScrollView scrollY className="orders-list">
        {filteredOrders.map(order => (
          <View key={order._id} className="order-card">
            <View className="order-header">
              <Text className="order-id">#{order._id?.slice(-8)}</Text>
              <Text className="order-date">{formatDate(order.createdAt)}</Text>
            </View>

            <View className="order-items">
              {order.items?.map((item: any, idx: number) => (
                <View key={idx} className="item">
                  <Text className="item-title">{item.title}</Text>
                  <Text className="item-qty">x{item.quantity}</Text>
                  <Text className="item-price">{formatCurrency(item.price)}</Text>
                </View>
              ))}
            </View>

            <View className="order-footer">
              <View className="order-total">
                <Text className="label">Total:</Text>
                <Text className="value">{formatCurrency(order.total)}</Text>
              </View>

              <View className="order-actions">
                {order.payment?.status === 'paid' && (
                  <Text
                    className="action-btn"
                    onClick={() => updateOrderStatus(order._id, 'shipped')}
                  >
                    Ship
                  </Text>
                )}
                {order.payment?.status === 'shipped' && (
                  <Text
                    className="action-btn"
                    onClick={() => updateOrderStatus(order._id, 'completed')}
                  >
                    Complete
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}

        {filteredOrders.length === 0 && (
          <View className="empty-state">
            <Text>No orders found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
