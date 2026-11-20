import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { AppShell } from '../../core/AppShell'
import { Product } from '../../core/types/product'
import { store } from '../../store'
import './index.scss'

export default function DetailPage() {
  const router = useRouter()
  const { id } = router.params || {}
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = () => {
    if (!id) {
      setError('No product ID provided')
      setLoading(false)
      return
    }

    try {
      const config = AppShell.getConfigSafe()
      if (config?.products) {
        const found = config.products.find((p: any) => p.id === id || p._id === id)
        if (found) {
          setProduct(found)
        } else {
          setError('Product not found')
        }
      } else {
        setError('Products not loaded')
      }
    } catch (e) {
      setError('Failed to load product')
    }
    setLoading(false)
  }

  const handleAddToCart = () => {
    if (!product) return
    const productId = product.id || product._id
    store.dispatch({
      type: 'cart/add',
      payload: {
        productId: productId,
        quantity: 1,
        price: product.price,
        data: product
      }
    })
    Taro.showToast({ title: 'Added to cart', icon: 'success' })
  }

  const handlePurchase = () => {
    if (!product) return
    Taro.showToast({ title: 'Payment coming soon', icon: 'none' })
  }

  if (loading) {
    return (
      <View className="detail-page">
        <View className="loading">Loading...</View>
      </View>
    )
  }

  if (error || !product) {
    return (
      <View className="detail-page">
        <View className="error">
          <Text className="error-icon">❌</Text>
          <Text className="error-text">{error || 'Product not found'}</Text>
        </View>
      </View>
    )
  }

  const originalPrice = product.originalPrice

  return (
    <View className="detail-page">
      <ScrollView scrollY className="detail-scroll">
        <View className="detail-header">
          <View className="detail-type-badge">
            <Text className="detail-type-icon">📦</Text>
            <Text className="detail-type-label">Digital Product</Text>
          </View>
        </View>

        <View className="detail-cover">
          <View className="detail-cover-placeholder">
            <Text className="detail-cover-icon">📦</Text>
          </View>
        </View>

        <View className="detail-content">
          <Text className="detail-title">{product.title}</Text>

          {product.category && (
            <View className="detail-category">
              <Text className="detail-category-text">{product.category}</Text>
            </View>
          )}

          <View className="detail-price-row">
            <View className="detail-price">
              <Text className="detail-price-symbol">¥</Text>
              <Text className="detail-price-value">{product.price}</Text>
            </View>
            {originalPrice && originalPrice > product.price && (
              <Text className="detail-original-price">¥{originalPrice}</Text>
            )}
          </View>

          {product.rating && (
            <View className="detail-rating">
              <Text className="detail-rating-icon">⭐</Text>
              <Text className="detail-rating-value">{product.rating}</Text>
              {product.reviewCount && (
                <Text className="detail-review-count">({product.reviewCount} reviews)</Text>
              )}
            </View>
          )}

          <View className="detail-description">
            <Text className="detail-description-label">Description</Text>
            <Text className="detail-description-text">
              {product.description || 'No description available'}
            </Text>
          </View>

          <View className="detail-delivery">
            <Text className="detail-delivery-icon">📥</Text>
            <Text className="detail-delivery-text">Instant delivery after purchase</Text>
          </View>
        </View>
      </ScrollView>

      <View className="detail-footer">
        <Button className="detail-add-btn" onClick={handleAddToCart}>
          <Text>Add to Cart</Text>
        </Button>
        <Button className="detail-buy-btn" onClick={handlePurchase}>
          <Text>Buy Now</Text>
        </Button>
      </View>
    </View>
  )
}
