import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { ensureCloudInit } from '../../utils/cloud'
import AuthGuard from '../../components/Common/AuthGuard'
import './index.scss'

interface OrderItem {
  _id: string
  items: Array<{
    productId: string
    title: string
    price: number
    quantity: number
  }>
  payment: {
    status: string
    paidAt?: string
  }
  totalAmount: number
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = useSelector((state: RootState) => state.user)

  const fetchOrders = async () => {
    if (!user.isLoggedIn || !user.id) return

    setLoading(true)
    setError('')

    try {
      if (!ensureCloudInit()) {
        setError('Cloud not available')
        setLoading(false)
        return
      }

      const res: any = await Taro.cloud.callFunction({
        name: 'getOrders',
        data: { limit: 50 }
      })

      if (res.result?.success) {
        setOrders(res.result.data || [])
      } else {
        setError(res.result?.error || 'Failed to load orders')
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user.isLoggedIn])

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      paid: 'Paid',
      pending: 'Pending',
      refunded: 'Refunded',
      cancelled: 'Cancelled'
    }
    return map[status] || status
  }

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      paid: 'status-paid',
      pending: 'status-pending',
      refunded: 'status-refunded',
      cancelled: 'status-cancelled'
    }
    return map[status] || ''
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const renderContent = () => {
    if (loading) {
      return (
        <View className="orders-loading">
          <Text className="orders-loading__text">Loading orders...</Text>
        </View>
      )
    }

    if (error) {
      return (
        <View className="orders-error">
          <Text className="orders-error__icon">⚠️</Text>
          <Text className="orders-error__text">{error}</Text>
          <View className="orders-error__retry" onClick={fetchOrders}>
            <Text className="orders-error__retry-text">Retry</Text>
          </View>
        </View>
      )
    }

    if (orders.length === 0) {
      return (
        <View className="orders-empty">
          <Text className="orders-empty__icon">📦</Text>
          <Text className="orders-empty__title">No orders yet</Text>
          <Text className="orders-empty__hint">Your orders will appear here after purchase</Text>
        </View>
      )
    }

    return (
      <ScrollView scrollY className="orders-list">
        {orders.map((order) => (
          <View key={order._id} className="order-card">
            <View className="order-card__header">
              <Text className="order-card__id">#{order._id}</Text>
              <Text className={`order-card__status ${getStatusClass(order.payment?.status)}`}>
                {getStatusText(order.payment?.status || 'pending')}
              </Text>
            </View>

            <View className="order-card__items">
              {order.items?.slice(0, 3).map((item, idx) => (
                <View key={idx} className="order-card__item">
                  <Text className="order-card__item-title" numberOfLines={1}>{item.title}</Text>
                  <Text className="order-card__item-qty">x{item.quantity}</Text>
                  <Text className="order-card__item-price">¥{item.price}</Text>
                </View>
              ))}
              {order.items?.length > 3 && (
                <Text className="order-card__more">+{order.items.length - 3} more items</Text>
              )}
            </View>

            <View className="order-card__footer">
              <Text className="order-card__date">{formatDate(order.createdAt)}</Text>
              <Text className="order-card__total">¥{order.totalAmount?.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    )
  }

  return (
    <AuthGuard
      fallback={
        <View className="orders-guard">
          <Text className="orders-guard__icon">🔒</Text>
          <Text className="orders-guard__title">Login Required</Text>
          <Text className="orders-guard__hint">Please login to view your orders</Text>
        </View>
      }
    >
      <View className="orders-page">
        <View className="orders-header">
          <Text className="orders-title">My Orders</Text>
          <Text className="orders-count">{orders.length} orders</Text>
        </View>
        {renderContent()}
      </View>
    </AuthGuard>
  )
}
