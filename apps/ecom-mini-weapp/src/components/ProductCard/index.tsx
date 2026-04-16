import { View, Text, Image } from '@tarojs/components'
import { Product, ProductConfig, PRODUCT_TYPE_CONFIG, DELIVERY_METHOD_CONFIG } from '../../core/types/product'
import './index.scss'

interface ProductCardProps {
  data: Product
  config?: ProductConfig
  onAction?: (actions: any[], context: any) => void
}

export default function ProductCard({ data, config = {}, onAction }: ProductCardProps) {
  const {
    showPreview = true,
    showRating = true,
    showCategory = true,
    showAuthor = true,
    pricePrefix = '¥',
    priceSuffix = '',
    unlockButtonText = 'Unlock',
    downloadButtonText = 'Download',
    addToCartButtonText = 'Add to Cart'
  } = config

  const handleClick = () => {
    console.log('[ProductCard] handleClick called')
    console.log('[ProductCard] data:', data)
    
    if (onAction) {
      onAction(
        [{ type: 'navigate', payload: { target: 'detail', params: { id: data.id } } }],
        { item: data }
      )
    }
  }

  const handleAction = (e: any) => {
    e.stopPropagation()
    console.log('[ProductCard] handleAction called for type:', data.deliveryMethod)
    
    if (!onAction) return

    const actionType = data.deliveryMethod
    const actions: any[] = []

    switch (actionType) {
      case 'download':
      case 'unlock':
        actions.push(
          { type: 'purchase', payload: { productId: data.id, price: data.price, title: data.title } },
          { type: 'showToast', payload: { title: 'Purchase successful!', icon: 'success' } }
        )
        break
      case 'ship':
        actions.push(
          { type: 'addToCart', payload: { ...data, quantity: 1 } },
          { type: 'showToast', payload: { title: 'Added to cart', icon: 'success' } }
        )
        break
    }

    console.log('[ProductCard] Executing actions:', actions)
    onAction(actions, { item: data })
  }

  const getActionText = () => {
    switch (data.deliveryMethod) {
      case 'download':
        return downloadButtonText
      case 'unlock':
        return unlockButtonText
      case 'ship':
        return addToCartButtonText
      default:
        return 'Buy'
    }
  }

  const productTypeConfig = PRODUCT_TYPE_CONFIG[data.type]
  const deliveryConfig = DELIVERY_METHOD_CONFIG[data.deliveryMethod]

  return (
    <View className="product-card" onClick={handleClick}>
      <View className="product-card__header">
        <View className="product-card__type-badge">
          <Text className="product-card__type-icon">{productTypeConfig?.icon}</Text>
          <Text className="product-card__type-label">{productTypeConfig?.label}</Text>
        </View>
        
        {showRating && data.rating && (
          <View className="product-card__rating">
            <Text className="product-card__rating-icon">⭐</Text>
            <Text className="product-card__rating-value">{data.rating}</Text>
          </View>
        )}
      </View>

      {data.cover ? (
        <Image src={data.cover} className="product-card__image" mode="aspectFill" />
      ) : (
        <View className="product-card__image-placeholder">
          <Text className="product-card__image-icon">{productTypeConfig?.icon}</Text>
        </View>
      )}

      <View className="product-card__content">
        <Text className="product-card__title" numberOfLines={2}>
          {data.title}
        </Text>

        {showAuthor && data.author && (
          <Text className="product-card__author">{data.author}</Text>
        )}

        {showCategory && data.category && (
          <View className="product-card__category">
            <Text className="product-card__category-text">{data.category}</Text>
          </View>
        )}

        {showPreview && data.preview && (
          <Text className="product-card__preview" numberOfLines={2}>
            {data.preview}
          </Text>
        )}

        <View className="product-card__delivery">
          <Text className="product-card__delivery-icon">{deliveryConfig?.icon}</Text>
          <Text className="product-card__delivery-text">{deliveryConfig?.label}</Text>
        </View>

        <View className="product-card__footer">
          <View className="product-card__price">
            <Text className="product-card__price-symbol">{pricePrefix}</Text>
            <Text className="product-card__price-value">{data.price}</Text>
            {priceSuffix && (
              <Text className="product-card__price-suffix">{priceSuffix}</Text>
            )}
          </View>

          <View
            className={`product-card__action-btn product-card__action-btn--${data.deliveryMethod}`}
            onClick={handleAction}
          >
            <Text className="product-card__action-text">{getActionText()}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
