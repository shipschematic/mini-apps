import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

interface ProductDetailProps {
  data: {
    id: string
    title: string
    author?: string
    price: number
    description?: string
    cover?: string
    images?: string[]
    rating?: number
    format?: string[]
    category?: string
    inStock?: boolean
    features?: string[]
  }
  config?: any
  onAction?: (actions: any[], context: any) => void
}

export default function ProductDetail({ data, config, onAction }: ProductDetailProps) {
  const [selectedFormat, setSelectedFormat] = useState(data?.format?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = () => {
    if (onAction) {
      onAction([
        { 
          type: 'addToCart', 
          payload: { 
            ...data, 
            quantity, 
            selectedFormat,
            totalPrice: data.price * quantity
          } 
        },
        { type: 'showToast', payload: { title: `Added ${quantity} to cart`, icon: 'success' } }
      ], { item: data })
    }
  }

  const handleBuyNow = () => {
    if (onAction) {
      onAction([
        { type: 'addToCart', payload: { ...data, quantity, selectedFormat } },
        { type: 'navigate', payload: { target: 'cart' } }
      ], { item: data })
    }
  }

  const handleWishlist = () => {
    if (onAction) {
      onAction([
        { type: 'addToWishlist', payload: data },
        { type: 'showToast', payload: { title: 'Added to wishlist', icon: 'success' } }
      ], { item: data })
    }
  }

  if (!data) {
    return (
      <View className="product-detail-empty">
        <Text>Product not found</Text>
      </View>
    )
  }

  return (
    <ScrollView className="product-detail" scrollY>
      {/* Image Gallery */}
      <View className="image-gallery">
        {data.cover && !imageError ? (
          <Image 
            className="main-image" 
            src={data.cover} 
            mode="aspectFill"
            onError={() => setImageError(true)}
          />
        ) : (
          <View className="image-placeholder">
            <Text className="placeholder-icon">📚</Text>
            <Text className="placeholder-title">{data.title}</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="product-info">
        <View className="header">
          <View className="title-section">
            <Text className="category">{data.category || 'Book'}</Text>
            <Text className="title">{data.title}</Text>
            {data.author && <Text className="author">by {data.author}</Text>}
          </View>
          <View className="wishlist-btn" onClick={handleWishlist}>
            <Text>♡</Text>
          </View>
        </View>

        {/* Rating */}
        {data.rating && (
          <View className="rating">
            <Text className="stars">{'★'.repeat(Math.floor(data.rating))}</Text>
            <Text className="rating-value">{data.rating}</Text>
            <Text className="reviews">(128 reviews)</Text>
          </View>
        )}

        {/* Price */}
        <View className="price-section">
          <Text className="price">¥{data.price.toFixed(2)}</Text>
          {data.inStock !== false && <Text className="stock">In Stock</Text>}
        </View>

        {/* Format Selection */}
        {data.format && data.format.length > 0 && (
          <View className="format-section">
            <Text className="section-label">Format</Text>
            <View className="format-options">
              {data.format.map((fmt) => (
                <View 
                  key={fmt}
                  className={`format-option ${selectedFormat === fmt ? 'selected' : ''}`}
                  onClick={() => setSelectedFormat(fmt)}
                >
                  <Text>{fmt}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quantity */}
        <View className="quantity-section">
          <Text className="section-label">Quantity</Text>
          <View className="quantity-selector">
            <View 
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text>-</Text>
            </View>
            <Text className="qty-value">{quantity}</Text>
            <View 
              className="qty-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Text>+</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {data.description && (
          <View className="description-section">
            <Text className="section-title">Description</Text>
            <Text className="description-text">{data.description}</Text>
          </View>
        )}

        {/* Features */}
        {data.features && data.features.length > 0 && (
          <View className="features-section">
            <Text className="section-title">Features</Text>
            {data.features.map((feature, idx) => (
              <View key={idx} className="feature-item">
                <Text className="feature-check">✓</Text>
                <Text className="feature-text">{feature}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="action-bar">
        <View className="add-to-cart" onClick={handleAddToCart}>
          <Text>Add to Cart</Text>
        </View>
        <View className="buy-now" onClick={handleBuyNow}>
          <Text>Buy Now</Text>
        </View>
      </View>
    </ScrollView>
  )
}
