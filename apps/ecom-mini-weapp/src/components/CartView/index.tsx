import { View, Text, Image } from '@tarojs/components'
import './index.scss'

interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  data?: {
    title?: string
    cover?: string
    author?: string
    description?: string
  }
}

interface CartViewProps {
  data?: CartItem[]
  config?: any
  onAction?: (actions: any[], context: any) => void
}

export default function CartView({ data, config, onAction }: CartViewProps) {
  const items = Array.isArray(data) ? data : []
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = () => {
    if (onAction) {
      onAction([
        { type: 'showToast', payload: { title: 'Proceeding to checkout...', icon: 'loading' } }
      ], {})
    }
  }

  const handleRemoveItem = (itemId: string) => {
    if (onAction) {
      onAction([
        { type: 'removeFromCart', payload: { itemId } },
        { type: 'showToast', payload: { title: 'Item removed', icon: 'success' } }
      ], {})
    }
  }

  if (items.length === 0) {
    return (
      <View className="cart-view">
        <View className="cart-empty">
          <Text className="empty-icon">🛒</Text>
          <Text className="empty-title">Your cart is empty</Text>
          <Text className="empty-subtitle">Add some items to get started</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="cart-view">
      <Text className="cart-title">Shopping Cart ({items.length} items)</Text>
      
      <View className="cart-items">
        {items.map((item) => (
          <View key={item.id} className="cart-item">
            <View className="item-image">
              {item.data?.cover ? (
                <Image src={item.data.cover} className="product-image" mode="aspectFill" />
              ) : (
                <View className="image-placeholder">📚</View>
              )}
            </View>
            <View className="item-details">
              <Text className="item-title">{item.data?.title || 'Unknown Product'}</Text>
              {item.data?.author && (
                <Text className="item-author">{item.data.author}</Text>
              )}
              <Text className="item-price">¥{item.price.toFixed(2)}</Text>
              <Text className="item-quantity">Qty: {item.quantity}</Text>
            </View>
            <View className="item-actions">
              <Text className="total-price">¥{(item.price * item.quantity).toFixed(2)}</Text>
              <View 
                className="remove-btn"
                onClick={() => handleRemoveItem(item.id)}
              >
                <Text>Remove</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="cart-summary">
        <View className="summary-row">
          <Text>Subtotal</Text>
          <Text>¥{total.toFixed(2)}</Text>
        </View>
        <View className="summary-row">
          <Text>Shipping</Text>
          <Text>Free</Text>
        </View>
        <View className="summary-row total">
          <Text>Total</Text>
          <Text>¥{total.toFixed(2)}</Text>
        </View>
      </View>

      <View className="cart-actions">
        <View className="checkout-btn" onClick={handleCheckout}>
          <Text>Proceed to Checkout</Text>
        </View>
      </View>
    </View>
  )
}
