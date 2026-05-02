import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem } from '../core/types'

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

interface AddPayload {
  productId: string
  quantity: number
  variant?: any
  price: number
  data?: any
}

interface RemovePayload {
  itemId: string
}

interface UpdatePayload {
  itemId: string
  quantity: number
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add(state, action: PayloadAction<AddPayload>) {
      const { productId, quantity, variant, price, data } = action.payload
      
      const existingItem = state.items.find(
        item => item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          id: `${productId}-${Date.now()}`,
          productId,
          quantity,
          variant,
          price,
          data
        })
      }
    },

    remove(state, action: PayloadAction<RemovePayload>) {
      const { itemId } = action.payload
      state.items = state.items.filter(item => item.id !== itemId)
    },

    update(state, action: PayloadAction<UpdatePayload>) {
      const { itemId, quantity } = action.payload
      
      const item = state.items.find(item => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== itemId)
        } else {
          item.quantity = quantity
        }
      }
    },

    clear(state) {
      state.items = []
    }
  }
})

export const { add, remove, update, clear } = cartSlice.actions
export default cartSlice.reducer
