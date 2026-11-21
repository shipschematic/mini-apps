import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { ensureCloudInit } from '../../utils/cloud'
import AuthGuard from '../../components/Common/AuthGuard'
import './index.scss'

interface Purchase {
  productId: string
  orderId: string
  purchasedAt: string
  price: number
  title?: string
  product?: {
    _id: string
    title: string
    description?: string
    image?: string
    downloadUrl?: string
  }
}

export default function LibraryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = useSelector((state: RootState) => state.user)

  const fetchPurchases = async () => {
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
        name: 'ecom_getUserPurchases',
        data: {}
      })

      if (res.result?.success) {
        setPurchases(res.result.data || [])
      } else {
        setError(res.result?.error || 'Failed to load library')
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load library')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchPurchases()
    } else {
      setLoading(false)
    }
  }, [user.isLoggedIn])

  const handleDownload = (purchase: Purchase) => {
    if (purchase.product?.downloadUrl) {
      Taro.setClipboardData({
        data: purchase.product.downloadUrl,
        success: () => {
          Taro.showToast({ title: 'Download link copied', icon: 'success' })
        }
      })
    } else {
      Taro.showToast({ title: 'No download link available', icon: 'none' })
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const renderContent = () => {
    if (loading) {
      return (
        <View className="library-loading">
          <Text className="library-loading__text">Loading library...</Text>
        </View>
      )
    }

    if (error) {
      return (
        <View className="library-error">
          <Text className="library-error__icon">⚠️</Text>
          <Text className="library-error__text">{error}</Text>
          <View className="library-error__retry" onClick={fetchPurchases}>
            <Text className="library-error__retry-text">Retry</Text>
          </View>
        </View>
      )
    }

    if (purchases.length === 0) {
      return (
        <View className="library-empty">
          <Text className="library-empty__icon">📚</Text>
          <Text className="library-empty__title">Library is empty</Text>
          <Text className="library-empty__hint">Your purchased digital products will appear here</Text>
        </View>
      )
    }

    return (
      <ScrollView scrollY className="library-grid">
        {purchases.map((purchase, idx) => (
          <View key={idx} className="library-card">
            <View className="library-card__image">
              <Text className="library-card__image-icon">📦</Text>
            </View>

            <View className="library-card__content">
              <Text className="library-card__title" numberOfLines={2}>
                {purchase.product?.title || purchase.title || 'Digital Product'}
              </Text>

              {purchase.product?.description && (
                <Text className="library-card__desc" numberOfLines={2}>
                  {purchase.product.description}
                </Text>
              )}

              <Text className="library-card__date">
                Purchased: {formatDate(purchase.purchasedAt)}
              </Text>

              <View
                className="library-card__download"
                onClick={() => handleDownload(purchase)}
              >
                <Text className="library-card__download-icon">⬇️</Text>
                <Text className="library-card__download-text">Download</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    )
  }

  return (
    <AuthGuard
      fallback={
        <View className="library-guard">
          <Text className="library-guard__icon">🔒</Text>
          <Text className="library-guard__title">Login Required</Text>
          <Text className="library-guard__hint">Please login to access your library</Text>
        </View>
      }
    >
      <View className="library-page">
        <View className="library-header">
          <Text className="library-title">My Library</Text>
          <Text className="library-count">{purchases.length} items</Text>
        </View>
        {renderContent()}
      </View>
    </AuthGuard>
  )
}
