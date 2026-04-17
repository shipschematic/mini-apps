import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import './dashboard.scss'

interface Stats {
  totalRevenue: number
  orders: number
  customers: number
  products: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    orders: 0,
    customers: 0,
    products: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Try to load from cloud, but don't crash if not available
      if (typeof Taro.cloud !== 'undefined' && Taro.cloud.callFunction) {
        try {
          const productsRes = await Taro.cloud.callFunction({
            name: 'getProducts',
            data: {}
          })
          
          if (productsRes.result?.success && productsRes.result?.data) {
            const products = productsRes.result.data
            setStats(prev => ({
              ...prev,
              products: products.length,
              totalRevenue: products.reduce((sum: number, p: any) =>
                sum + (p.price * p.purchaseCount || 0), 0
              )
            }))
          }
          
          const ordersRes = await Taro.cloud.callFunction({
            name: 'getOrders',
            data: {}
          })
          
          if (ordersRes.result?.success && ordersRes.result?.data) {
            const orders = ordersRes.result.data
            setStats(prev => ({
              ...prev,
              orders: orders.length
            }))
            setRecentOrders(orders.slice(0, 5))
          }
        } catch (cloudErr: any) {
          // Cloud functions not available - this is normal
        }
      }
    } catch (err) {
      // Silent fail - show empty dashboard
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toFixed(2)}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <View className="admin-dashboard">
      <ScrollView scrollY className="dashboard-content">
        <View className="stats-grid">
          <View className="stat-card revenue">
            <Text className="stat-label">Total Revenue</Text>
            <Text className="stat-value">{formatCurrency(stats.totalRevenue)}</Text>
          </View>

          <View className="stat-card orders">
            <Text className="stat-label">Orders</Text>
            <Text className="stat-value">{stats.orders}</Text>
          </View>

          <View className="stat-card products">
            <Text className="stat-label">Products</Text>
            <Text className="stat-value">{stats.products}</Text>
          </View>

          <View className="stat-card customers">
            <Text className="stat-label">Customers</Text>
            <Text className="stat-value">{stats.customers}</Text>
          </View>
        </View>

        <View className="section">
          <Text className="section-title">Recent Orders</Text>
          {recentOrders.length > 0 ? (
            <View className="orders-list">
              {recentOrders.map((order) => (
                <View key={order._id} className="order-item">
                  <View className="order-info">
                    <Text className="order-id">#{order._id?.slice(-6)}</Text>
                    <Text className="order-date">{formatDate(order.createdAt)}</Text>
                  </View>
                  <View className="order-right">
                    <Text className="order-total">{formatCurrency(order.total)}</Text>
                    <Text className={`order-status status-${order.payment?.status}`}>
                      {order.payment?.status || 'pending'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="empty-state">
              <Text>No orders yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
