import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WishlistItem } from '../core/types'

interface WishlistState {
  items: WishlistItem[]
}

interface AddPayload {
  productId: string
  data?: any
}

interface RemovePayload {
  itemId: string
}

const initialState: WishlistState = {
  items: []
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    add(state, action: PayloadAction<AddPayload>) {
      const { productId, data } = action.payload
      
      const existingItem = state.items.find(item => item.productId === productId)

      if (!existingItem) {
        state.items.push({
          id: `${productId}-${Date.now()}`,
          productId,
          data
        })
      }
    },

    remove(state, action: PayloadAction<RemovePayload>) {
      const { itemId } = action.payload
      state.items = state.items.filter(item => item.id !== itemId)
    },

    clear(state) {
      state.items = []
    }
  }
})

export const { add, remove, clear } = wishlistSlice.actions
export default wishlistSlice.reducer
