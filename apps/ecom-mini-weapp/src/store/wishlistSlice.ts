import { createSlice } from '@reduxjs/toolkit'
import { WishlistItem } from '../core/types'

interface WishlistState {
  items: WishlistItem[]
}

const initialState: WishlistState = {
  items: []
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    add(state: any, action: any) {
      const { productId, data } = action.payload
      
      // Check if item already exists
      const existingItem = state.items.find((item: any) => item.productId === productId)

      if (!existingItem) {
        state.items.push({
          id: `${productId}-${Date.now()}`,
          productId,
          data
        })
      }
    },

    remove(state: any, action: any) {
      const { itemId } = action.payload
      state.items = state.items.filter((item: any) => item.id !== itemId)
    },

    clear(state: any) {
      state.items = []
    }
  }
})

export const { add, remove, clear } = wishlistSlice.actions
export default wishlistSlice.reducer
