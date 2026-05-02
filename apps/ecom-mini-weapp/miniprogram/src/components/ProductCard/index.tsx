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

  // Handle missing data gracefully
  if (!data) {
    return (
      <View className="product-card">
        <Text>Loading...</Text>
      </View>
    )
  }

  // Normalize data fields - database uses 'name', component expects 'title'
  const productData = {
    ...data,
    title: data.title || data.name || 'Untitled',
    deliveryMethod: data.deliveryMethod || (data.type === 'digital' ? 'download' : 'ship'),
    cover: data.cover || (data.images && data.images[0]),
    preview: data.preview || data.description
  }

  const handleClick = () => {
    if (onAction) {
      onAction(
        [{ type: 'navigate', payload: { target: 'detail', params: { id: productData.id || productData._id } } }],
        { item: productData }
      )
    }
  }

  const handleAction = (e: any) => {
    e.stopPropagation()
    
    if (!onAction) return

    const actionType = productData.deliveryMethod
    const actions: any[] = []
    
    // Resolve product ID - try id, _id, or productId
    const productId = productData.id || productData._id || productData.productId
    const productTitle = productData.title || 'Product'
    const productPrice = productData.price || 0

    switch (actionType) {
      case 'download':
      case 'unlock':
        // For purchase: pass all required data in payload
        // Note: paymentService handles success/error toast internally
        actions.push(
          { 
            type: 'purchase', 
            payload: { 
              productId: productId,
              id: productId,
              _id: productId,
              title: productTitle,
              price: productPrice,
              ...productData
            } 
          }
        )
        break
      case 'ship':
        // For cart: pass product data
        actions.push(
          { 
            type: 'addToCart', 
            payload: { 
              productId: productId,
              id: productId,
              _id: productId,
              title: productTitle,
              price: productPrice,
              quantity: 1,
              ...productData
            } 
          },
          { type: 'showToast', payload: { title: 'Added to cart', icon: 'success' } }
        )
        break
      default:
        // Fallback: try to purchase if no delivery method
        actions.push(
          { 
            type: 'purchase', 
            payload: { 
              productId: productId,
              id: productId,
              _id: productId,
              title: productTitle,
              price: productPrice,
              ...productData
            } 
          }
        )
    }

    onAction(actions, { item: productData })
  }

  const getActionText = () => {
    switch (productData.deliveryMethod) {
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

  const productTypeConfig = PRODUCT_TYPE_CONFIG[productData.type]
  const deliveryConfig = DELIVERY_METHOD_CONFIG[productData.deliveryMethod]

  return (
    <View className="product-card" onClick={handleClick}>
      <View className="product-card__header">
        <View className="product-card__type-badge">
          <Text className="product-card__type-icon">{productTypeConfig?.icon}</Text>
          <Text className="product-card__type-label">{productTypeConfig?.label}</Text>
        </View>
        
        {showRating && productData.rating && (
          <View className="product-card__rating">
            <Text className="product-card__rating-icon">⭐</Text>
            <Text className="product-card__rating-value">{productData.rating}</Text>
          </View>
        )}
      </View>

      {productData.cover ? (
        <Image src={productData.cover} className="product-card__image" mode="aspectFill" />
      ) : (
        <View className="product-card__image-placeholder">
          <Text className="product-card__image-icon">{productTypeConfig?.icon}</Text>
        </View>
      )}

      <View className="product-card__content">
        <Text className="product-card__title" numberOfLines={2}>
          {productData.title}
        </Text>

        {showAuthor && productData.author && (
          <Text className="product-card__author">{productData.author}</Text>
        )}

        {showCategory && productData.category && (
          <View className="product-card__category">
            <Text className="product-card__category-text">{productData.category}</Text>
          </View>
        )}

        {showPreview && productData.preview && (
          <Text className="product-card__preview" numberOfLines={2}>
            {productData.preview}
          </Text>
        )}

        <View className="product-card__delivery">
          <Text className="product-card__delivery-icon">{deliveryConfig?.icon}</Text>
          <Text className="product-card__delivery-text">{deliveryConfig?.label}</Text>
        </View>

        <View className="product-card__footer">
          <View className="product-card__price">
            <Text className="product-card__price-symbol">{pricePrefix}</Text>
            <Text className="product-card__price-value">{productData.price}</Text>
            {priceSuffix && (
              <Text className="product-card__price-suffix">{priceSuffix}</Text>
            )}
          </View>

          <View
            className={`product-card__action-btn product-card__action-btn--${productData.deliveryMethod}`}
            onClick={handleAction}
          >
            <Text className="product-card__action-text">{getActionText()}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
