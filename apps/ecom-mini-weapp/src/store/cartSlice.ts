import { createSlice } from '@reduxjs/toolkit'
import { CartItem } from '../core/types'

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add(state: any, action: any) {
      const { productId, quantity, variant, price, data } = action.payload
      
      // Check if item already exists
      const existingItem = state.items.find(
        (item: any) => item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
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

    remove(state: any, action: any) {
      const { itemId } = action.payload
      state.items = state.items.filter((item: any) => item.id !== itemId)
    },

    update(state: any, action: any) {
      const { itemId, quantity } = action.payload
      
      const item = state.items.find((item: any) => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i: any) => i.id !== itemId)
        } else {
          item.quantity = quantity
        }
      }
    },

    clear(state: any) {
      state.items = []
    }
  }
})

export const { add, remove, update, clear } = cartSlice.actions
export default cartSlice.reducer
