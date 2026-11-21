import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { remove, update, clear } from '../../store/cartSlice'
import { paymentService } from '../../services/paymentService'
import './index.scss'

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleRemove = (itemId: string) => {
    dispatch(remove({ itemId }))
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    dispatch(update({ itemId, quantity }))
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Taro.showToast({ title: 'Cart is empty', icon: 'none' })
      return
    }
    const result = await paymentService.checkout(
      cartItems.map(item => ({
        productId: item.productId,
        title: item.data?.title || 'Product',
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice
    )
    if (!result.success) {
      Taro.showToast({ title: result.error || 'Checkout failed', icon: 'none' })
    }
  }

  const handleClearCart = () => {
    dispatch(clear())
  }

  if (cartItems.length === 0) {
    return (
      <View className="cart-page">
        <View className="cart-empty">
          <Text className="cart-empty-icon">🛒</Text>
          <Text className="cart-empty-text">Your cart is empty</Text>
          <Text className="cart-empty-hint">Browse products and add them to your cart</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="cart-page">
      <ScrollView scrollY className="cart-scroll">
        <View className="cart-header">
          <Text className="cart-title">Shopping Cart</Text>
          <Button className="cart-clear-btn" onClick={handleClearCart}>
            <Text>Clear</Text>
          </Button>
        </View>

        <View className="cart-items">
          {cartItems.map((item) => (
            <View key={item.id} className="cart-item">
              <View className="cart-item-info">
                <Text className="cart-item-title">{item.data?.title || 'Product'}</Text>
                <Text className="cart-item-price">¥{item.price}</Text>
              </View>

              <View className="cart-item-controls">
                <View className="quantity-controls">
                  <Button
                    className="quantity-btn"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text>-</Text>
                  </Button>
                  <Text className="quantity-value">{item.quantity}</Text>
                  <Button
                    className="quantity-btn"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text>+</Text>
                  </Button>
                </View>
                <Button
                  className="cart-item-remove"
                  onClick={() => handleRemove(item.id)}
                >
                  <Text>🗑️</Text>
                </Button>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="cart-footer">
        <View className="cart-total">
          <Text className="cart-total-label">Total:</Text>
          <Text className="cart-total-value">¥{totalPrice.toFixed(2)}</Text>
        </View>
        <Button className="cart-checkout-btn" onClick={handleCheckout}>
          <Text>Checkout (¥{totalPrice.toFixed(2)})</Text>
        </Button>
      </View>
    </View>
  )
}
